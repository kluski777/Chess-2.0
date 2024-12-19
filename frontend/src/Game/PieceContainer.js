import { useLogContext } from '../HandyComponents/LogContext';
import { beginPositions } from './rules/beginningPositions';
import { useGameContext } from './gameContext';
import Moveable from 'react-moveable';
import { boardSize } from '../HandyComponents/LogContext';
import { useState, useRef, useEffect, forwardRef } from 'react';
import './piece.css';

import { Knight } from './Pieces/Knight';
import { Bishop } from './Pieces/Bishop';
import { Queen } from './Pieces/Queen';
import { King } from './Pieces/King';
import { Rook } from './Pieces/Rook';
import { Pawn } from './Pieces/Pawn';

const PieceComponents = {
  Pawn,
  Knight,
  Bishop,
  Rook,
  Queen,
  King
};

// da sie to zrobić jakoś ładnie i szybko?
const PieceOn = forwardRef(({i, j, pointer, pieceType, isWhite: isPieceWhite}, ref) => {
  const gameContext = useGameContext();
  const {logState} = useLogContext();

  const isWhite = isPieceWhite ?? ((logState.isUserWhite && j > boardSize/2) || (!logState.isUserWhite && j < boardSize/2));
  const piece = pieceType ?? beginPositions['variant a'][j][i];

  const commonProps = {
    isWhite: isWhite,
    pointer: ref,
    ref: pointer,
    i: pointer?.current?.x ?? i,
    j: pointer?.current?.y ?? j, 
    isPlayer: pointer?.current?.isPlayer ?? j > boardSize/2
  }

  useEffect(() => {
    const arrayKey = j > boardSize/2 ? 'allyPieces' : 'enemyPieces';
    // Check if ref already exists before pushing, it's done because of react strict mode
    if (!gameContext.playerPieces.current[arrayKey].includes(pointer)) {
      gameContext.playerPieces.current[arrayKey].push(pointer);
      
      return () => {
        gameContext.playerPieces.current[arrayKey] = gameContext.playerPieces.current[arrayKey]
          .filter(ref => ref !== pointer); // it's for react strict purposes only.
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const PieceComponent = PieceComponents[piece];
  return <PieceComponent {...commonProps}/>
});

export const moveFunctions = {
  functions: {},
  replaceFunction: function(keyBefore, keyAfter) {
    if(this.functions[keyBefore]) {
      const func = this.functions[keyBefore];
      this.functions[keyAfter] = func;
      delete this.functions[keyBefore];
    }
  }
};

export const eventBus = {
  listeners: new Map(),
  emit(id, newProps) {
    if (this.listeners.has(id)) {
      this.listeners.get(id)(newProps);
    }
  },
  subscribe(id, setProps) {
    this.listeners.set(id, setProps);
    return () => this.listeners.delete(id);
  }
}

const PieceContainer = ({i, j, tileSize, connection}) => {
  const {playerPieces, gameEvents, setGameEvents, moveHistory} = useGameContext();
  const imageRef = useRef(null);
  const ownRef = useRef(null);
  const pieceClass = useRef(null);
  const [piece, setPiece] = useState({ // Only for pawn it should be present
    isPieceWhite: undefined,
    type: undefined,
  });

  const isKingChecked = (allySide, enemySide) => { // so dirty
    const [[enemyKingX, enemyKingY]] = playerPieces.current[enemySide].filter(p => p.current.type === 'King').map(obj => [obj.current.x, obj.current.y]); // get the king
          
    if( playerPieces.current[allySide].some( p => p.current.attack().some(([x, y]) => x === enemyKingX && y === enemyKingY)) ) {
      setGameEvents(prev => ({...prev, check: true}));
      playerPieces.current[enemySide].find(p => p.current.type === 'King').current.updateCheck(true);
      return true;
    } else if(gameEvents.check) {
      setGameEvents(prev => ({...prev, check: false}));
      playerPieces.current[enemySide].find(p => p.current.type === 'King').current.updateCheck(false);
    }
    return false;
  }

  const moveFunction = async (moveX, moveY) => {
    if ( await pieceClass?.current.canMove(moveX, moveY) ) { // check if the move is legal
      const oldSquare = document.querySelector(`#square-${pieceClass.current.x}-${pieceClass.current.y}`);
      
      pieceClass.current.x += moveX;
      pieceClass.current.y += moveY;
      
      const newSquare = document.querySelector(`#square-${pieceClass.current.x}-${pieceClass.current.y}`)
      const allySide  = pieceClass.current.isPlayer ? 'allyPieces' : 'enemyPieces';
      const enemySide = pieceClass.current.isPlayer ? 'enemyPieces' : 'allyPieces';
      
      // Removing enemy piece if taking is on
      if(newSquare.childElementCount) {
        playerPieces.current[enemySide] = playerPieces.current[enemySide].filter(p => p.current.x !== pieceClass.current.x || p.current.y !== pieceClass.current.y)
      }

      // change grapgical position of a piece
      if(oldSquare.childElementCount) {
        oldSquare.removeChild(ownRef.current);
        newSquare.replaceChildren(ownRef.current);
      }
      
      moveHistory.current.push({[pieceClass.current.type]: {finalSquares: {x: pieceClass.current.x, y: pieceClass.current.y}, move: {x: moveX, y: moveY} }});
      
      const isEndOfTheGame = await Promise
        .all(playerPieces.current[enemySide].map(async p => await p.current.possibleMoves() ))
        .then(moves => moves.every(moveArray => moveArray.length === 0));

      if( isKingChecked(allySide, enemySide) ) // czy szach?
        if( isEndOfTheGame ) // czy mat?
          setGameEvents(prev => ({...prev, checkmate: true}));
      else if(isEndOfTheGame) // czy pat?
        setGameEvents(prev => ({...prev, stalemate: true}));

      moveFunctions.replaceFunction( // z całą pewnością działa, zostało sprawdzone
        `${pieceClass.current.x - moveX}-${pieceClass.current.y - moveY}`, 
        `${pieceClass.current.x}-${pieceClass.current.y}`
      );

      return true;
    }
    return false;
  }

  useEffect(() => {
    return eventBus.subscribe(`setStates-${i}-${j}`, setPiece);
  }, [i, j]);

  useEffect(() => {
    moveFunctions.functions[`${i}-${j}`] = moveFunction;
  }, [i, j]);
  
  return (
    <div
    id={`piece-${i}-${j}`}
    className="moveable-container"
    onClick={e => e.stopPropagation()}
      ref={ownRef}
    >
      <Moveable
        draggable={true}
        origin={false}
        target={imageRef}
        onDrag={e => {
          e.target.style.transform = e.transform
        }}
        onDragStart={_ => {
          pieceClass.current.clicked();
        }}
        onDragEnd={ async e => {
          pieceClass.current.unclicked();
          imageRef.current.style.transform = ''
          
          // przerzut z pixeli na wartości
          const [moveX, moveY] = [e?.lastEvent?.left, e?.lastEvent?.top].map(value => Math.round(value/tileSize));
          
          if(await moveFunction(moveX, moveY)) {
            setGameEvents(prev => ({...prev, isWhiteToMove: !prev.isWhiteToMove}));
            connection.send({type: 'move', body: moveHistory.current.at(-1)});
          }
        }}
        hideDefaultLines={true}
      />
      <PieceOn
        i={i}
        j={j}
        ref={imageRef}
        pointer={pieceClass}
        isPieceWhite={piece.isPieceWhite}
        pieceType={piece.type}
      />
    </div>
  )
}

export default PieceContainer;