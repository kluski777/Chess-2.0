import React from 'react';
import Moveable from 'react-moveable';
import {useMoveSound} from './../HandyComponents/Sound';
import {checkIfIllegalMove} from './pieceLogic';

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
      return [blackKing, 'king', false];
    else if( props.i === 4 )
      return [blackQueen, 'queen', false];
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
      return [whiteKing, 'king', true];
    else if( props.i === 4 )
      return [whiteQueen, 'queen', true];
  }
  else if( props.j === props.boardSize-2)
    return [whitePawn, 'pawn', true];
  return [null, null, null];
}

const toPieceNotation = (pieceType, xIndex, yIndex) => {
  let notation = "";
  if(pieceType === 'knight')
    notation += 'N';
  else if(pieceType !== 'pawn')
    notation += pieceType.toUpperCase().charAt(0);

  // konwersja z indeksu na notacje PGN
  notation += String.fromCharCode(xIndex + 97);
  notation += 8 - yIndex + '';

  return notation;
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
    if(pieceType !== null && isWhite)
      props.whitePieces.setWhitePieceList((prevList) => ({...prevList, [`${pieceType}${props.i}${props.j}`]: `${props.i}-${props.j}`}));
    else if(pieceType !== null && !isWhite)
      props.blackPieces.setBlackPieceList((prevList) => ({...prevList, [`${pieceType}${props.i}${props.j}`]: `${props.i}-${props.j}`}));
  }, [])

  const playMove = useMoveSound('move');
  const playCheck = useMoveSound('check');

  const pieceStyling = {
    position: 'relative',
    display: 'flex',
    height: '100%',
    width: '100%',
    border: 'none',
    cursor: 'pointer',
  }

  const handleMove = (e) => {
    // square indexes (beginning in the upper left corner)
    const [finalXIndex, finalYIndex] = props.coordsToTile(e.clientX, e.clientY);
    const [startXIndex, startYIndex] = props.coordsToTile(dragStartPosition.x, dragStartPosition.y);

    const updateDomAndPlaySound = () => {
      if(destinationSquare.childElementCount > 0) {
        destinationSquare.replaceChildren(thisNode.current);
        playMove();
      }
      else {
        destinationSquare.appendChild(thisNode.current);
        playCheck();
      }
    }

    const updateNotation = () => {
      if(isWhite)
        props.whitePieces.setWhitePieceList( (prevPositions) => ({...prevPositions, [`${pieceType}${props.i}${props.j}`]: `${finalXIndex}-${finalYIndex}`}) )
      else
        props.blackPieces.setBlackPieceList( (prevPositions) => ({...prevPositions, [`${pieceType}${props.i}${props.j}`]: `${finalXIndex}-${finalYIndex}`}) )
    }

    // setting piece in the middle of the square
    e.target.style.transform = "translate(0px, 0px)";

    if(
      (startXIndex === finalXIndex && startYIndex === finalYIndex) || // brak zmiany pola
      !isIndexLegit(finalXIndex) || // poza planszą
      !isIndexLegit(finalYIndex) || // poza planszą
      (isWhite && props.moveNotation.length%2 === 1) || // ruch białych w czarnej turze
      (!isWhite && props.moveNotation.length%2 === 0) || // ruch czarncyh w białej turze
      checkIfIllegalMove(
        pieceType,
        isWhite,
        [startXIndex, startYIndex],
        [finalXIndex, finalYIndex],
        props.boardSize,
        props.whitePieces.whitePieceList,
        props.blackPieces.blackPieceList
      )
    )
      return ;

    const destinationSquare = ref.current.querySelector(`#square-from-${finalXIndex}-${finalYIndex}`);    
    updateDomAndPlaySound();
    // Removing and appeding children from the destination square
    
    updateNotation();

    props.setMoveNotation(
      [...props.moveNotation, toPieceNotation(pieceType, finalXIndex, finalYIndex)]
    );
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