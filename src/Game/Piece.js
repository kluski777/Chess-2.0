import React from 'react';
import Moveable from 'react-moveable';
import {useMoveSound} from './../HandyComponents/Sound';
import {checkIfIllegalMove, toPieceNotation, filterOut} from './pieceLogic';

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
  if( props.j === 0 ){ // depending from the player
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
  }
  else if( props.j === 1 )
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
  }
  else if( props.j === props.boardSize-2)
    return [whitePawn, 'pawn', true];
  return [null, null, null];
}

const Piece = React.forwardRef((props, ref) => {
  const [pieceGraphics, pieceType, isWhite] = choosePiece(props);
  const pieceImage = React.useRef(null);
  const thisNode = React.useRef(null);
  const [dragStartPosition, setDragStartPosition] = React.useState({
    x: 0,
    y: 0
  });

  React.useEffect(() => {
    if(isWhite && pieceType !== null){
      props.whitePieces.current = {...props.whitePieces.current, [`${pieceType}${props.i}${props.j}`]: `${props.i}-${props.j}`}
    } else if(!isWhite && pieceType !== null){
      props.blackPieces.current = {...props.blackPieces.current, [`${pieceType}${props.i}${props.j}`]: `${props.i}-${props.j}`};
    }
  }, []); // nie resetuje ustawienia o dziwo.

  const playCheck = useMoveSound('check');
  const playMove = useMoveSound('move');
  const playTaking = useMoveSound('taking');
  const playCastle = useMoveSound('castle');

  const pieceStyling = {
    position: 'relative',
    display: 'flex',
    height: '100%',
    width: '100%',
    border: 'none',
    cursor: 'pointer'
  }

  const handleMove = (e) => {
    const [finalXIndex, finalYIndex] = props.coordsToTile(e.clientX, e.clientY);
    const [startXIndex, startYIndex] = props.coordsToTile(dragStartPosition.x, dragStartPosition.y);
    
    const updateDOM = () => {
      const castled = isWhite && props.moveNotation.current.length%2 !== 0 || !isWhite && props.moveNotation.current.length%2 === 0; 

      if(props.moveNotation.current.at(-1) === 'O-O' && castled) {
        const edge = isWhite ? props.boardSize-1 : 0;
        const rook = ref.current.querySelector(`#figure-from-square-${props.boardSize - 1}-${edge}`);

        destinationSquare = ref.current.querySelector(`#square-from-${props.boardSize - 2}-${edge}`);
        props.result.current.check ? playCheck() : playCastle();
        destinationSquare.appendChild(thisNode.current);
        ref.current.querySelector(`#square-from-${props.boardSize - 3}-${edge}`).appendChild(rook);

      } else if(props.moveNotation.current.at(-1) === 'O-O-O' && castled){
        const edge = isWhite ? props.boardSize-1 : 0;
        const rook = ref.current.querySelector(`#figure-from-square-0-${edge}`);

        destinationSquare = ref.current.querySelector(`#square-from-2-${edge}`);
        props.result.current.check ? playCheck() : playCastle();
        destinationSquare.appendChild(thisNode.current);
        ref.current.querySelector(`#square-from-3-${edge}`).appendChild(rook);

      } else if(destinationSquare.childElementCount > 0) {
        props.moveNotation.current = [...props.moveNotation.current, pieceTakingNotation(pieceType, [finalXIndex, finalYIndex], startXIndex)];
        destinationSquare.replaceChildren(thisNode.current);
        props.result.current.check ? playCheck() : playTaking();
        filterOut((isWhite ? props.blackPieces : props.whitePieces), finalXIndex, finalYIndex);
    
      } else {
        props.moveNotation.current = [...props.moveNotation.current, toPieceNotation(pieceType, finalXIndex, finalYIndex)];
        destinationSquare.appendChild(thisNode.current);
        props.result.current.check ? playCheck() : playMove();
      
      }
    }

    // setting piece in the middle of the square
    e.target.style.transform = "translate(0px, 0px)";

    if(
      (startXIndex === finalXIndex && startYIndex === finalYIndex) || // No move being made
      !isIndexLegit(finalXIndex) || // poza planszą
      !isIndexLegit(finalYIndex) || // poza planszą
      (isWhite && props.moveNotation.current.length%2 === 1) || // ruch białych w czarnej turze
      (!isWhite && props.moveNotation.current.length%2 === 0) || // ruch czarncyh w białej turze
      checkIfIllegalMove(
        `${pieceType}${props.i}${props.j}`,
        isWhite,
        [startXIndex, startYIndex],
        [finalXIndex, finalYIndex],
        props.boardSize,
        props.whitePieces,
        props.blackPieces,
        props.moveNotation,
        ref.current,
        props.result
      ) // this function also checks if it's check/mate/stalemate.
    )
      return ;

    let destinationSquare = ref.current.querySelector(`#square-from-${finalXIndex}-${finalYIndex}`);
    updateDOM();
  }

  if(pieceGraphics !== null)
    return (
      <div
        style={pieceStyling}
        ref={thisNode}
        id={`figure-from-square-${props.i}-${props.j}`}
      >
        <Moveable
          draggable={true}
          target={pieceImage}
          onDrag={e => {
            e.target.style.transform = e.transform
          }}
          onDragEnd={handleMove}
          onDragStart={e => {
            setDragStartPosition({
              x: e.inputEvent.clientX,
              y: e.inputEvent.clientY
            })
          }}
        />
        <img
          ref={pieceImage}
          src={pieceGraphics}
          alt={`figure-from-square-${props.i}-${props.j}`}
        />
      </div>
    );
})

export default Piece; 