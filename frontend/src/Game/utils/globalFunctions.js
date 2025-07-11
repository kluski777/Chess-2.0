import React from 'react'
import { useGameContext } from '../../Contexts/gameContext';
import { moveFunctions } from './ChessLogicCC';
import { boardSize } from '../../Contexts/LogContext';
import { setTiles } from '../Tile';

export const usePremove = () => {
  const {moveHistory} = useGameContext();
  const {playerPieces} = useGameContext();
  const premoveHistory = React.useRef([]); // {finalSquares, move, promotes}
  const piecesTaken = React.useRef([]); // lista figur które zostały przykryte

  const toggleSquareColor = (isPlayer, lastPremove, option) => {
    if(isPlayer) {
      setTiles[`${lastPremove.finalSquares.x}-${lastPremove.finalSquares.y}`]('', option);
      setTiles[`${lastPremove.finalSquares.x - lastPremove.move.x}-${lastPremove.finalSquares.y - lastPremove.move.y}`]('', option);
    }
  }

  const applyPremove = async (isPlayer) => { // Brakuje parukrotnego ruszenia się jedną figurą, to powinno być dodane
    if(premoveHistory.current.length > 0) {
      const lastPremove = premoveHistory.current.shift();
      const oldY = isPlayer ? lastPremove.finalSquares.y - lastPremove.move.y : boardSize - 1 - lastPremove.finalSquares.y + lastPremove.move.y;
      const oldX = lastPremove.finalSquares.x - lastPremove.move.x

      // moving piece back to its pre premove square (only if it was a player to move)
      if(isPlayer)
        moveFromTo(lastPremove.finalSquares.x, lastPremove.finalSquares.y, oldX, oldY, playerPieces)
      const chosenFunction = moveFunctions.functions[`${oldX}-${oldY}`];

      toggleSquareColor(isPlayer, lastPremove, 'default');

      debugger

      // Jeśli podczas tego premove'a zbita była figura dana to ją przywracamy do życia
      if(moveHistory.current.length + 1 === piecesTaken.current[0]?.moveNum) {
        const firstRemovedPiece = piecesTaken.current.shift();
        graphicallyRevive(firstRemovedPiece);
      }

      if(chosenFunction && await chosenFunction(lastPremove.move.x, (isPlayer ? 1 : -1) * lastPremove.move.y, lastPremove?.promotes) ) { // da sie wykonać premove
        delete lastPremove.type
      } else if(isPlayer){
        // cofamy wszystkie premovy
        for(let move of premoveHistory.current.reverse()){
          const oldX = move.finalSquares.x - move.move.x;
          const oldY = move.finalSquares.y - move.move.y;
          moveFromTo(move.finalSquares.x, move.finalSquares.y, oldX, oldY, playerPieces);
        }
        
        // przywracamy wszystkie zabrane figury do życia
        for(let piece of piecesTaken.current)
          graphicallyRevive(piece)
        
        piecesTaken.current = []
        premoveHistory.current = [];
      } else { // premove niemożliwy
        premoveHistory.current = [];
      }
    }
  }

  const addPremove = (moveObject, isPlayer) => { // tu dojdzie do rewolucji
    premoveHistory.current.push(moveObject);
    
    if(isPlayer) {
      const {x: newX, y: newY} = moveObject.finalSquares
      const [oldX, oldY] = [newX - moveObject.move.x, newY - moveObject.move.y]
      const newSquare = document.getElementById(`square-${newX}-${newY}`)
      
      if(newSquare.childElementCount){
        const pieceToBeRemoved = newSquare.firstChild
        const moveNumber = moveHistory.current.length + premoveHistory.current.length * 2
        piecesTaken.current.push({
          moveNum: moveNumber,
          object: pieceToBeRemoved,
          squareId: `square-${newX}-${newY}`
        })
        pieceToBeRemoved.remove() // tylko graficznie znika tutaj (jak jej nie zniknę to figura premove pojawia się niżej)
      }
      
      moveFromTo(oldX, oldY, newX, newY, playerPieces)
    }
    toggleSquareColor(isPlayer, moveObject, 'premove');
  }
  
  return {addPremove, applyPremove};
}

const graphicallyRevive = (premoveObject) => {
  document.getElementById(premoveObject.squareId).appendChild( premoveObject.object ); // graficzne przywrócenie figury
}

export const moveFromTo = (oldX, oldY, newX, newY, playerPieces) => {
  const newSquare = document.getElementById(`square-${newX}-${newY}`)
  const oldSquare = document.querySelector(`#square-${oldX}-${oldY}`) // square na którym stała figura
  
  const pieceToBeMoved = oldSquare.firstChild
  oldSquare.replaceChildren() // wywalenie poprzedniego miejsca figury
  newSquare.appendChild(pieceToBeMoved)
  
  moveFunctions.replaceFunction(`${oldX}-${oldY}`, `${newX}-${newY}`)

  const pieceClassRef = playerPieces.current.allyPieces.find(piece => piece.current.x === oldX && piece.current.y === oldY)
  pieceClassRef.current.x = newX
  pieceClassRef.current.y = newY // tu jest setowanie teraz wypadałoby dodać unsetowanie
}