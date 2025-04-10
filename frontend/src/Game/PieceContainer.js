import { useMoveMarkersContext } from '../Contexts/moveMarkersContext';
import { useState, useRef, useEffect } from 'react';
import { useGameContext } from '../Contexts/gameContext';
import { useLogContext } from '../Contexts/LogContext';
import { PieceOn } from './PieceOn';
import { setTiles } from './Tile';
import Moveable from 'react-moveable';
import isEqual from 'fast-deep-equal';
import './piece.css';

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

const PieceContainer = ({i, j, tileSize, premove, connection}) => {
  const { setUpdateFunction, markerPositions, setMarkerPositions } = useMoveMarkersContext();
  const { playerPieces, gameEvents, setGameEvents, moveHistory } = useGameContext();
  const { logState: {isUserWhite} } = useLogContext();
  const {addPremove, applyPremove} = premove;
  const [isReady, setIsReady] = useState(false); // necesarry to fix bugs
  const pieceClass = useRef(null);
  const imageRef = useRef(null);
  const ownRef = useRef(null);

  const isKingChecked = (allySide, enemySide) => {
    const enemyKing = playerPieces.current[enemySide].find(p => p.current.type === 'King');

    if( playerPieces.current[allySide].some( p => p.current.attack().some(([x, y]) => x === enemyKing.current.x && y === enemyKing.current.y)) ) {
      setGameEvents(prev => ({...prev, check: true}));
      enemyKing.current.updateCheck(true);
      return true;
    } else if(gameEvents.check) {
      setGameEvents(prev => ({...prev, check: false}));
      enemyKing.current.updateCheck(false);
    }
    return false;
  }

  const moveFunction = async (moveX, moveY, promotes = '') => {
    let condition = promotes ? await pieceClass?.current.canMove(moveX, moveY, false, promotes) : await pieceClass?.current.canMove(moveX, moveY);

    if ( !condition ) // move illegal 
      return false;

    const oldSquare = document.querySelector(`#square-${pieceClass.current.x}-${pieceClass.current.y}`);

    // w przypadku premove'a tego to ja nie chce
    pieceClass.current.x += moveX;
    pieceClass.current.y += moveY;

    const newSquare = document.querySelector(`#square-${pieceClass.current.x}-${pieceClass.current.y}`)
    const allySide  = pieceClass.current.isPlayer ? 'allyPieces' : 'enemyPieces';
    const enemySide = pieceClass.current.isPlayer ? 'enemyPieces' : 'allyPieces';
    
    // Removing enemy piece if taking is on
    if(newSquare.childElementCount) {
      playerPieces.current[enemySide] = playerPieces.current[enemySide].filter(p => p.current.x !== pieceClass.current.x || p.current.y !== pieceClass.current.y);
    }

    // change grapgical position of a piece
    if(oldSquare.childElementCount) {
      oldSquare.removeChild(ownRef.current);
      newSquare.replaceChildren(ownRef.current);
    }
    
    // update moveHistory with the newest move
    moveHistory.current.push({[pieceClass.current.type]: {finalSquares: {x: pieceClass.current.x, y: pieceClass.current.y}, move: {x: moveX, y: moveY} }});
    
    // check whether it's the end of the game - checks every single move which is quite inefficient
    const isEndOfTheGame = await Promise
      .all(playerPieces.current[enemySide].map(async p => await p.current.possibleMoves() ))
      .then(moves => moves.every(moveArray => moveArray.length === 0));
      
    setGameEvents(prev => ({...prev, isWhiteToMove: !prev.isWhiteToMove}));

    // checking check, checkamte, stalemate
    if( isKingChecked(allySide, enemySide) ) // check
      if( isEndOfTheGame ) // checkmate
        setGameEvents(prev => ({...prev, checkmate: true}));
    else if(isEndOfTheGame) // stalemate
      setGameEvents(prev => ({...prev, stalemate: true}));
    
    moveFunctions.replaceFunction(
      `${pieceClass.current.x - moveX}-${pieceClass.current.y - moveY}`, 
      `${pieceClass.current.x}-${pieceClass.current.y}`,
    );

    setMarkerPositions([]);
    
    return true; // move possible, piece will be moved
  }

  const makeMove = async (moveX, moveY) => { 
    if(gameEvents.isWhiteToMove === pieceClass.current.props.isWhite && gameEvents.isWhiteToMove === isUserWhite  && await moveFunction(moveX, moveY)) { // player move
      if(pieceClass.current.state.promotes !== 'Pawn' && pieceClass.current.state.promotes !== 'promotes') {
        connection.send({type: 'move', body: moveHistory.current.at(-1), promotes: pieceClass.current.state.promotes})
      } else {
        connection.send({type: 'move', body: moveHistory.current.at(-1)});
      }

      await applyPremove(false);
    } else if(gameEvents.isWhiteToMove !== isUserWhite ) {
      const condition = pieceClass.current.type === 'Pawn' ? 
        await pieceClass.current.canMove(moveX, moveY, false, undefined, true) : 
        await pieceClass.current.canMove(moveX, moveY, true);      

      if(condition) {
         let moveObject = {
          finalSquares: {
            x: pieceClass.current.x + moveX,
            y: pieceClass.current.y + moveY,
          },
          move: {
            x: moveX,
            y: moveY,
          },
          ...(pieceClass.current.type === 'Pawn' && 
            pieceClass.current.state.promotes && 
            {promotes: pieceClass.current.state.promotes})
        };

        connection.send({type: 'premove', body: moveObject});

        addPremove(moveObject, true);
        // graficzny ruch
      }
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
    if(imageRef.current)
      setIsReady(true);
  }, []);

    useEffect(() => {
      moveFunctions.functions[`${i}-${j}`] = moveFunction; // setting function on same label as piece position.
    }, [i, j]);

  return (
    <div
      id={`piece-${i}-${j}`}
      className="moveable-container"
      onContextMenu={e => setTiles[`${pieceClass.current.x}-${pieceClass.current.y}`](e)}
      ref={ownRef}
    >
      {isReady &&
        <Moveable
          draggable={true}
          origin={false}
          target={imageRef}
          onDrag={e => {
            const prev = e.target.style.transform.split(' ');
            e.target.style.transform = prev[0] + " " + prev[1] + " " + e.transform;
          }}
          onDragStart={e => {
            const elementRect = e.target.getBoundingClientRect();
            const [xCent, yCent] = [elementRect.left + elementRect.right, elementRect.top + elementRect.bottom].map(el => el/2);
            e.target.style.transform = `translate(${e.clientX - xCent}px,${e.clientY - yCent}px)`
            pieceClass.current.clicked();
          }}
          onDragEnd={ async e => {
            pieceClass.current.unclicked();
            
            // onDragStart shift
            const [dxStart, dyStart,] = e.target.style.transform.match(/-?\d+\.?\d*/g).map(str => parseFloat(str)); 
            
            // No transform piece in the center of the square
            imageRef.current.style.transform = '';
            
            if(!e?.lastEvent?.left)
              return; // it's not a drag move, just a click
            
            // piece shift - calculating move
            const [moveX, moveY] = [e.lastEvent.left + dxStart, e.lastEvent.top + dyStart].map(value => Math.round(value/tileSize));
            
            makeMove(moveX, moveY);
          }}
          onClick={setMarkers}
          hideDefaultLines={true}
        />
      }
      <PieceOn
        i={i}
        j={j}
        ref={imageRef}
        pointer={pieceClass}
      />
    </div>
  )
}

export default PieceContainer;