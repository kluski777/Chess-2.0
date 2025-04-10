import React from 'react'
import { moveFunctions } from '../PieceContainer';
import { boardSize } from '../../Contexts/LogContext';
import { setTiles } from '../Tile';

export const usePremove = () => {
  const premoveHistory = React.useRef([]); // {finalSquares, move, promotes}
  const pieceTaken = React.useRef([]);

  const toggleSquareColor = (isPlayer, lastPremove, option) => {
    if(isPlayer) {
      setTiles[`${lastPremove.finalSquares.x}-${lastPremove.finalSquares.y}`]('', option);
      setTiles[`${lastPremove.finalSquares.x - lastPremove.move.x}-${lastPremove.finalSquares.y - lastPremove.move.y}`]('', option);
    }
  }

  const applyPremove = async (isPlayer) => {
    if(premoveHistory.current.length > 0) {
      const lastPremove = premoveHistory.current[0];
      const yCoord = isPlayer ? lastPremove.finalSquares.y - lastPremove.move.y : boardSize - 1 - lastPremove.finalSquares.y + lastPremove.move.y;
      const chosenFunction = moveFunctions.functions[`${lastPremove.finalSquares.x - lastPremove.move.x}-${yCoord}`];

      toggleSquareColor(isPlayer, lastPremove, 'default');

      if(chosenFunction && await chosenFunction(lastPremove.move.x, (isPlayer ? 1 : -1) * lastPremove.move.y, lastPremove?.promotes) ) {
        premoveHistory.current.shift();
      } else {
        // przsunąć na oryginalny square moją figurę.
        // przesunąć graficznie to nie problem gorzej ze zmianą .current.x i .current.y
        premoveHistory.current = [];
      }
    }
  }

  const addPremove = (moveObject, isPlayer) => {
    premoveHistory.current.push(moveObject);
    // zmiana położenia i current.x, current,y 
    toggleSquareColor(isPlayer, moveObject, 'premove');
  }

  return {addPremove, applyPremove};
}