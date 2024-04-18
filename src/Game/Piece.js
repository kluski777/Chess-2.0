import React from 'react'
import Moveable from "react-moveable"
import {useMoveSound} from './../HandyComponents/Sound'

import blackRook from './../Assets/blackPieces/rook.png'
import blackKnight from './../Assets/blackPieces/knight.png'
import blackBishop from './../Assets/blackPieces/bishop.png'
import blackKing from './../Assets/blackPieces/king.png'
import blackQueen from './../Assets/blackPieces/queen.png'
import blackPawn from './../Assets/blackPieces/pawn.png'
import whiteRook from './../Assets/whitePieces/rook.png'
import whiteKnight from './../Assets/whitePieces/knight.png'
import whiteBishop from './../Assets/whitePieces/bishop.png'
import whiteKing from './../Assets/whitePieces/king.png'
import whiteQueen from './../Assets/whitePieces/queen.png'
import whitePawn from './../Assets/whitePieces/pawn.png'

const pieceStyling = {
  position: 'relative',
  display: 'flex',
  height: '100%',
  width: '100%',
  border: 'none',
  cursor: 'pointer'
}

const isIndexLegit = (tileIndex) => {
  return tileIndex >= 0 && tileIndex < 8;
}

const choosePiece = (i, j, boardSize) => {
  if( j === 0 ){ // depending from the player
    if( i === 0 || i === boardSize-1 )
      return [blackRook, 'rook', false];
    else if( i === 1 || i === boardSize-2 )
      return [blackKnight, 'knight', false];
    else if( i === 2 || i === boardSize-3 )
      return [blackBishop, 'bishop', false];
    else if( i === 3 )
      return [blackKing, 'king', false];
    else if( i === 4 )
      return [blackQueen, 'queen', false];
  }
  else if( j === 1 )
    return [blackPawn, 'pawn', false];
  else if( j === boardSize-1 ){ // white pieces or black, depending from the player.
    if( i === 0 || i === boardSize-1 )
      return [whiteRook, 'rook', true];
    else if( i === 1 || i === boardSize-2 )
      return [whiteKnight, 'knight', true];
    else if( i === 2 || i === boardSize-3 )
      return [whiteBishop, 'bishop', true];
    else if( i === 3 )
      return [whiteKing, 'king', true];
    else if( i === 4 )
      return [whiteQueen, 'queen', true];
  }
  else if( j === boardSize-2)
    return [whitePawn, 'pawn', true];
  return [null, null, null];
}

const tranformValues = (string) => {
  string = string.replace(/[a-zA-Z()\s]/g, '').split(',')
  return [Number(string[0]), Number(string[1])];
}

const Piece = React.forwardRef((props, ref) => {
  const [pieceGraphics, pieceType, isWhite] = choosePiece(props.i, props.j, props.boardSize); // powinno zwracać 2 typy
  const pieceImage = React.useRef(null)
  const thisNode = React.useRef(null);
  const playMove = useMoveSound('move');
  const playCheck = useMoveSound('check');

  const handleMove = (e) => {
    // square indexes (beginning in the upper left corner)
    const [xIndex, yIndex, tileSize] = props.coordsToTile(e.clientX, e.clientY);
    
    // check whether the piece was moved out of the square.
    const [xMove, yMove] = tranformValues(e.target.style.transform);

    // setting piece in the middle of the square
    e.target.style.transform = "translate(0px, 0px)";
    
    if((Math.abs(xMove) < tileSize/2 && Math.abs(yMove) < tileSize/2) || !isIndexLegit(xIndex) || !isIndexLegit(yIndex))
      return ;

    const destinationSquare = ref.current.querySelector(`#square-from-${xIndex}-${yIndex}`);    
    
    // Removing and appeding children from the destination square
    if(destinationSquare.childElementCount > 0) {
      destinationSquare.replaceChildren(thisNode.current);
      playMove();
    }
    else {
      destinationSquare.appendChild(thisNode.current);
      playCheck();
    }
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
            e.target.style.transform = e.transform;
          }}
          onDragEnd={handleMove}
        />
        <img
          ref={pieceImage}
          src={pieceGraphics}
          style={pieceStyling}
          alt={`figure-from-square-${props.i}-${props.j}`}
        />
      </div>
    );
})

export default Piece; 