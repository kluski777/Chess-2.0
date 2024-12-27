import { useMoveMarkersContext } from '../Contexts/moveMarkersContext';
import { useState, useRef, useEffect, forwardRef } from 'react';
import { beginPositions } from './rules/beginningPositions';
import { useGameContext } from '../Contexts/gameContext';
import { useLogContext } from '../Contexts/LogContext';
import { boardSize } from '../Contexts/LogContext';
import Moveable from 'react-moveable';
import isEqual from 'fast-deep-equal';
import './piece.css';

import { Knight } from './Pieces/Knight';
import { Bishop } from './Pieces/Bishop';
import { Queen } from './Pieces/Queen';
import { King } from './Pieces/King';
import { Rook } from './Pieces/Rook';
import { Pawn } from './Pieces/Pawn';

const defaultPieceObject = {
  isPieceWhite: undefined,
  type: undefined,
}

const PieceComponents = {
  Pawn,
  Knight,
  Bishop,
  Rook,
  Queen,
  King
};

// da sie to zrobić jakoś ładnie i szybko?
const PieceOn = forwardRef(({i, j, pointer, pieceInfo}, ref) => {
  const gameContext = useGameContext();
  const {logState} = useLogContext();
  const isWhite = pieceInfo.isPieceWhite ?? ((logState.isUserWhite && j > boardSize/2) || (!logState.isUserWhite && j < boardSize/2));
  const piece = pieceInfo.type ?? beginPositions['variant a'][j][i];

  const commonProps = {
    isWhite: isWhite,
    pointer: ref,
    i: pieceInfo?.posX ?? i,
    j: pieceInfo?.posY ?? j, 
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
  }, [j, pointer]);

  const PieceComponent = PieceComponents[piece];
  return <PieceComponent {...commonProps} ref={pointer}/>
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
  const { setUpdateFunction, markerPositions, setMarkerPositions } = useMoveMarkersContext();
  const { playerPieces, gameEvents, setGameEvents, moveHistory } = useGameContext();
  const { logState: {isUserWhite} } = useLogContext();
  const imageRef = useRef(null);
  const ownRef = useRef(null);
  const pieceClass = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [piece, setPiece] = useState(defaultPieceObject);

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

  const moveFunction = async (moveX, moveY, promotes = '') => {
    let condition = promotes ? await pieceClass?.current.canMove(moveX, moveY, false, promotes) : await pieceClass?.current.canMove(moveX, moveY);

    if ( condition ) { // check if the move is legal
      const oldSquare = document.querySelector(`#square-${pieceClass.current.x}-${pieceClass.current.y}`);

      // w przypadku premove'a tego to ja nie chce
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
      
      // update moveHistory with the newest move
      moveHistory.current.push({[pieceClass.current.type]: {finalSquares: {x: pieceClass.current.x, y: pieceClass.current.y}, move: {x: moveX, y: moveY} }});
      
      // check whether it's the end of the game
      const isEndOfTheGame = await Promise
        .all(playerPieces.current[enemySide].map(async p => await p.current.possibleMoves() ))
        .then(moves => moves.every(moveArray => moveArray.length === 0));

      // checking check, checkamte, stalemate
      if( isKingChecked(allySide, enemySide) ) // check
        if( isEndOfTheGame ) // checkmate
          setGameEvents(prev => ({...prev, checkmate: true}));
      else if(isEndOfTheGame) // stalemate
        setGameEvents(prev => ({...prev, stalemate: true}));

      // relace position of the moveFunction
      moveFunctions.replaceFunction(
        `${pieceClass.current.x - moveX}-${pieceClass.current.y - moveY}`, 
        `${pieceClass.current.x}-${pieceClass.current.y}`,
      );
      
      setMarkerPositions([]);
      
      return true; // move possible, piece will be moved
    }
    return false; // move forbidden
  }

  const makeMove = async (moveX, moveY) => { 
    if(gameEvents.isWhiteToMove === pieceClass.current.props.isWhite && gameEvents.isWhiteToMove === isUserWhite  && await moveFunction(moveX, moveY)) { // player move
      setGameEvents(prev => ({...prev, isWhiteToMove: !prev.isWhiteToMove}));
      if(pieceClass.current.state.promotes !== 'Pawn' && pieceClass.current.state.promotes !== 'promotes') {
        connection.send({type: 'move', body: moveHistory.current.at(-1), promotes: pieceClass.current.state.promotes})
      } else {
        connection.send({type: 'move', body: moveHistory.current.at(-1)});
      }
    } else if(gameEvents.isWhiteToMove !== isUserWhite && (moveX || moveY)) { // premove
      // premove TODO
    }
  }

  const finishClickMove = (squareX, squareY) => {
    const [moveX, moveY] = [squareX - pieceClass.current.x, squareY - pieceClass.current.y];
    makeMove(moveX, moveY);
  }

  const setMarkers = async () => {
    const possibleMoves = await pieceClass.current.possibleMoves();

    if( isEqual(possibleMoves, markerPositions) ) {
      setMarkerPositions([]);
    } else {
      setMarkerPositions(possibleMoves);
      setUpdateFunction(() => finishClickMove);
    }
  }

  useEffect(() => {
    return eventBus.subscribe(`setStates-${i}-${j}`, (newProps) => {
      setPiece(newProps);
      console.trace(`State from the square ${i}-${j} was updated to `, newProps);
    });
  }, [i, j]);

  useEffect(() => {
    moveFunctions.functions[`${i}-${j}`] = moveFunction;
  }, [i, j]);

  useEffect(() => {
    if(imageRef.current) {
      setIsReady(true);
    }
  }, []);

  return (
    <div
      id={`piece-${i}-${j}`}
      className="moveable-container"
      onClick={e => e.stopPropagation()}
      ref={ownRef}
    >
      {isReady &&
        <Moveable
          draggable={true}
          origin={false}
          dragTarget={imageRef}
          target={imageRef}
          onDrag={e => e.target.style.transform = e.transform}
          onDragStart={_ => pieceClass.current.clicked()}
          onDragEnd={ async e => {
            pieceClass.current.unclicked();
            imageRef.current.style.transform = '';
            
            if(!e?.lastEvent?.left) return; // it's not a drag move, just a click

            // przerzut z pixeli na wartości
            const [moveX, moveY] = [e?.lastEvent?.left, e?.lastEvent?.top].map(value => Math.round(value/tileSize));
            
            makeMove(moveX, moveY);
          }}
          onClick={setMarkers}
          hideDefaultLines={true}
        />
      }
      <PieceOn
        i={i} // i and j are wrong when promoting to a queen
        j={j}
        ref={imageRef}
        pointer={pieceClass}
        pieceInfo={piece}
      />
    </div>
  )
}

export default PieceContainer;