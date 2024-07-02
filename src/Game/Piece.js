import React from 'react';
import Moveable from 'react-moveable';
import {useMoveSound} from './../HandyComponents/Sound';
import {checkIfIllegalMove, toPieceNotation, filterOut} from './pieceLogic';
import './piece.css';

import blackRook from './../Assets/blackPieces/rook.png';
import blackKnight from './../Assets/blackPieces/knight.png';
import blackBishop from './../Assets/blackPieces/bishop.png';
import blackKing from './../Assets/blackPieces/king.png';
import blackQueen from './../Assets/blackPieces/queen.png';
import blackPawn from './../Assets/blackPieces/pawn.png';
import whiteRook from './../Assets/whitePieces/rook.png';
import whiteKnight from './../Assets/whitePieces/knight.png';
import whiteBishop from './../Assets/whitePieces/bishop.png';
import whiteKing from './../Assets/whitePieces/king.png';
import whiteQueen from './../Assets/whitePieces/queen.png';
import whitePawn from './../Assets/whitePieces/pawn.png';

const pieceTakingNotation = (pieceType, finalSquares, startXSquare) => {
  let toRet = "";

  if(pieceType === 'pawn'){
    toRet += String.fromCharCode(startXSquare + 97) + "";
  } else if(pieceType === 'knight'){
    toRet += "N";
  } else {
    toRet += pieceType.at(-1).toUpperCase() + "";
  } 

  toRet += 'x';
  toRet += String.fromCharCode(finalSquares[0] + 97);
  toRet += 8 - finalSquares[1] + '';
  return toRet;
}

const isIndexLegit = (tileIndex) => {
  return tileIndex >= 0 && tileIndex < 8;
}

const choosePiece = (props) => {
  if( props.j === 0 ){
    if( props.i === 0 || props.i === props.boardSize-1 )
      return [blackRook, 'rook', false];
    else if( props.i === 1 || props.i === props.boardSize-2 )
      return [blackKnight, 'knight', false];
    else if( props.i === 2 || props.i === props.boardSize-3 )
      return [blackBishop, 'bishop', false];
    else if( props.i === 3 )
      return [blackQueen, 'queen', false];
    else if( props.i === 4 )
      return [blackKing, 'king', false];
  } else if( props.j === 1 )
    return [blackPawn, 'pawn', false];
  else if( props.j === props.boardSize-1 ){ // white pieces or black, depending from the player.
    if( props.i === 0 || props.i === props.boardSize-1 )
      return [whiteRook, 'rook', true];
    else if( props.i === 1 || props.i === props.boardSize-2 )
      return [whiteKnight, 'knight', true];
    else if( props.i === 2 || props.i === props.boardSize-3 )
      return [whiteBishop, 'bishop', true];
    else if( props.i === 3 )
      return [whiteQueen, 'queen', true];
    else if( props.i === 4 )
      return [whiteKing, 'king', true];
  } else if( props.j === props.boardSize-2)
    return [whitePawn, 'pawn', true];
  return [null, null, null];
}

const Piece = React.forwardRef((props, ref) => {
  let [pieceLook, typeTemp, isWhite] = choosePiece(props);  // jako że isWhite nie jest refem to może się pierdolić w skrajnych przypadkach.
  const isUpgradeOngoing = React.useRef(false);
  const pieceType = React.useRef(typeTemp);
  const pieceImage = React.useRef(null);
  const thisNode = React.useRef(null);
  
  const [pieceGraphics, setPieceGraphics] = React.useState(pieceLook);
  const [dragStartPosition, setDragStartPosition] = React.useState({
    x: 0,
    y: 0
  });
  
  const playCheck = useMoveSound('check');
  const playMove = useMoveSound('move');
  const playTaking = useMoveSound('taking');
  const playCastle = useMoveSound('castle');

  React.useEffect(() => {
    if(isWhite && pieceType.current !== null){
      props.whitePieces.current = {...props.whitePieces.current, [`${pieceType.current}${props.i}${props.j}`]: `${props.i}-${props.j}`};
    } else if(!isWhite && pieceType.current !== null){
      props.blackPieces.current = {...props.blackPieces.current, [`${pieceType.current}${props.i}${props.j}`]: `${props.i}-${props.j}`};
    }
  }, []);

  const handleMove = async (e) => {
    const [finalXIndex, finalYIndex] = props.coordsToTile(e.clientX, e.clientY);
    const [startXIndex, startYIndex] = props.coordsToTile(dragStartPosition.x, dragStartPosition.y);

    // setting piece in the middle of the square
    e.target.style.transform = "translate(0px, 0px)";

    if(
      (startXIndex === finalXIndex && startYIndex === finalYIndex) || // No move being made
      !isIndexLegit(finalXIndex) || // poza planszą
      !isIndexLegit(finalYIndex) || // poza planszą
      (isWhite && props.moveNotation.current.length%2 === 1) || // ruch białych w czarnej turze
      (!isWhite && props.moveNotation.current.length%2 === 0) || // ruch czarncyh w białej turze
      checkIfIllegalMove(
        `${pieceType.current}${props.i}${props.j}`,
        isWhite,
        [startXIndex, startYIndex],
        [finalXIndex, finalYIndex],
        props.boardSize,
        props.whitePieces,
        props.blackPieces,
        props.moveNotation,
        ref.current,
        props.result
      )
    )
      return ;

    let destinationSquare = ref.current.querySelector(`#square-from-${finalXIndex}-${finalYIndex}`);
    const castled = isWhite && props.moveNotation.current.length%2 !== 0 || !isWhite && props.moveNotation.current.length%2 === 0;
    
    if( props.result.current.pawn !== undefined ) {
      isUpgradeOngoing.current = true;
      props.result.current.pawn = finalXIndex - startXIndex;

      await new Promise(resolve => {
        const checkUpgrade = () => {
          if (!isUpgradeOngoing.current)
            resolve();
          else
            setTimeout(checkUpgrade, 100);
        };
        checkUpgrade();
      });

      delete props.result.current.pawn;

      if(pieceType.current === 'pawn')
        return ;

      // bardzo przydałyby się listy możliwych ruchów, ale tak, żeby były łatwe w użyciu.
      if(destinationSquare.childElementCount > 0){
        destinationSquare.replaceChildren(thisNode.current);
        props.moveNotation.current = [...props.moveNotation.current, pieceTakingNotation('pawn', [finalXIndex, finalYIndex], startXIndex) + `=${pieceType.current.charAt(0).toUpperCase()}`];
        filterOut((isWhite ? props.blackPieces : props.whitePieces), finalXIndex, finalYIndex);
      } else {
        destinationSquare.appendChild(thisNode.current);
        props.moveNotation.current = [...props.moveNotation.current, toPieceNotation('pawn', finalXIndex, finalYIndex)  + `=${pieceType.current.charAt(0).toUpperCase()}`];
      }

      if(isWhite){
        delete props.whitePieces.current[`pawn${props.i}${props.j}`];
        props.whitePieces.current[`${pieceType.current}${props.i}${props.j}`] = `${finalXIndex}-${finalYIndex}`;
      } else {
        delete props.blackPieces.current[`pawn${props.i}${props.j}`];
        props.blackPieces.current[`${pieceType.current}${props.i}${props.j}`] = `${finalXIndex}-${finalYIndex}`;
      } 

    } else if(castled) { // castle
      const edge = isWhite ? props.boardSize - 1 : 0;
      let rook;
      props.result.current.check ? playCheck() : playCastle();
      
      if(props.moveNotation.current.at(-1) === 'O-O') { // short castle
        rook = ref.current.querySelector(`#figure-from-square-${props.boardSize - 1}-${edge}`);
        ref.current.querySelector(`#square-from-${props.boardSize - 3}-${edge}`).appendChild(rook);
        destinationSquare = ref.current.querySelector(`#square-from-${props.boardSize - 2}-${edge}`);
      } else if(props.moveNotation.current.at(-1) === 'O-O-O') { // long castle
        rook = ref.current.querySelector(`#figure-from-square-0-${edge}`);
        ref.current.querySelector(`#square-from-3-${edge}`).appendChild(rook);
        destinationSquare = ref.current.querySelector(`#square-from-2-${edge}`);
      }
      destinationSquare.appendChild(thisNode.current);
    } else if(destinationSquare.childElementCount > 0) { // taking
      props.moveNotation.current = [...props.moveNotation.current, pieceTakingNotation(pieceType.current, [finalXIndex, finalYIndex], startXIndex)];
      props.result.current.check ? playCheck() : playTaking();
      destinationSquare.replaceChildren(thisNode.current);
      filterOut((isWhite ? props.blackPieces : props.whitePieces), finalXIndex, finalYIndex);
    } else { // rest moves
      props.moveNotation.current = [...props.moveNotation.current, toPieceNotation(pieceType.current, finalXIndex, finalYIndex)];
      props.result.current.check ? playCheck() : playMove();
      destinationSquare.appendChild(thisNode.current);
    }
  }

  const PieceToChoose = ({pieceChosen, newPieceGraphics}) => {
    return (
      <img
        src={newPieceGraphics}
        alt={`${isWhite ? 'white' : 'black'}-${pieceChosen}`}
        className='figureToPromoteStyle'
        onClick={() => {
          pieceType.current = pieceChosen;
          setPieceGraphics(newPieceGraphics);
          isUpgradeOngoing.current = false;
          }
        }
      />
    );
  }

  if(pieceGraphics !== null)
    return (
      <div
        className='pieceStyling'
        ref={thisNode}
        id={props.pieceID}
        key={props.pieceID}
      >
        { isUpgradeOngoing.current ?
        <div style={{ display: 'flex', flexDirection: 'column', transform: `translate(calc(${props.result.current.pawn * 100}% - 1px) , calc(-100% - 2px))`}}> 
          <PieceToChoose pieceChosen='bishop' newPieceGraphics={isWhite ? whiteBishop : blackBishop}/>
          <PieceToChoose pieceChosen='knight' newPieceGraphics={isWhite ? whiteKnight : blackKnight}/>
          <PieceToChoose pieceChosen='rook' newPieceGraphics={isWhite ? whiteRook : blackRook}/>
          <PieceToChoose pieceChosen='queen' newPieceGraphics={isWhite ? whiteQueen : blackQueen}/>
        </div> :
        <>
        {/* isInside wydaje się być fajnym propem */}
          <Moveable
            draggable={true}
            origin={false}
            target={pieceImage}
            onDrag={e => {
              e.target.style.transform = e.transform
            }}
            hideDefaultLines={true}
            onDragEnd={handleMove}
            onDragStart={e => {
              setDragStartPosition({
                x: e.inputEvent.clientX,
                y: e.inputEvent.clientY
              })
            }}
          />
          <img
            className="moveableStyle"
            ref={pieceImage}
            src={pieceGraphics}
            alt={`figure-from-square-${props.i}-${props.j}`}
          />
        </>
        }
      </div>
    );
})

export default Piece;