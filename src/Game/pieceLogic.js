// Pure JS logic checking if moves are legit or aren't

// dodać tu funkcję isAttacking która pokazuje wszystkie pola na które może
// ruszyć się figura. 

export const checkIfIllegalMove = (
  pieceType, 
  isWhite, 
  startSquares, 
  finalSquares, 
  boardSize,
  whitePieces,
  blackPieces
) => {
  const move = [ finalSquares[0] - startSquares[0], finalSquares[1] - startSquares[1] ];
  const enemyPieces = isWhite ? Object.values(blackPieces) : Object.values(whitePieces);
  const alliedPieces = isWhite ? Object.values(whitePieces) : Object.values(blackPieces);

  const pawn = (isWhite) => {
    const directionOfWander = isWhite ? -1 : 1;

    const isOneSquareMoveLegit = () => {
      return (move[0] === 0 &&
        move[1] === directionOfWander &&
        !enemyPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`) &&
        !alliedPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`));
    }

    const isTakingLegit = () => {
      return (Math.abs(move[0]) === 1 &&
        move[1] === directionOfWander &&
        enemyPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`));
    }

    const is2SquareMoveLegit = () => {
      return (move[0] === 0 &&
        move[1] === directionOfWander*2 &&
        finalSquares[1] - move[1] === (isWhite ? boardSize-2 : 1) &&
        !enemyPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`) &&
        !enemyPieces.includes(`${finalSquares[0]}-${finalSquares[1] - directionOfWander}`) &&
        !alliedPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`) &&
        !alliedPieces.includes(`${finalSquares[0]}-${finalSquares[1] - directionOfWander}`)); 
    }
    
    if(isOneSquareMoveLegit() || is2SquareMoveLegit() || isTakingLegit())
      return false;
    return true;
  }

  const bishop = () => {
    if( 
      Math.abs(move[0]) === Math.abs(move[1]) && 
      !alliedPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`)
    ){
      let captured = false;
      for( let i=move[0], j=move[1]; i !== 0 && j !== 0;){
        if( alliedPieces.includes(`${startSquares[0]+i}-${startSquares[1]+j}`) )
          return true;
        else if( captured && enemyPieces.includes(`${startSquares[0]+i}-${startSquares[1]+j}`) )
          return true;
        else if( enemyPieces.includes(`${startSquares[0]+i}-${startSquares[1]+j}`) )
          captured = true;

        i>0 ? i-- : i++;
        j>0 ? j-- : j++;
      }
      return false;
    }
    return true;
  }

  const knight = () => {
    if(
      (Math.abs(move[0]) === 1 && Math.abs(move[1]) === 2) || 
      (Math.abs(move[0]) === 2 && Math.abs(move[1]) === 1)
    ){
      return false;
    }
    return true;
  }

  const rook = () => {
    if(
      (move[0] === 0 || move[1] === 0) &&
      !alliedPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`)
    ){
      let captured = false;
      for(let i=move[0], j=move[1]; i !== 0 || j !== 0; ){
        if( alliedPieces.includes(`${startSquares[0]+i}-${startSquares[1]+j}`) )
          return true;
        else if( captured && enemyPieces.includes(`${startSquares[0]+i}-${startSquares[1]+j}`) )
          return true;
        else if( enemyPieces.includes(`${startSquares[0]+i}-${startSquares[1]+j}`) )
          captured = true;

        move[1] === 0 ? (i > 0 ? i-- : i++) : (j > 0 ? j-- : j++)
      }
      return false;
    }
    return true;
  }

  const king = () => {
    if(
      ((Math.abs(move[0]) === 0 && Math.abs(move[1]) === 1) ||
      (Math.abs(move[0]) === 1 && Math.abs(move[1]) === 1) ||
      (Math.abs(move[0]) === 1 && Math.abs(move[1]) === 0)) &&
      !alliedPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`)
      // jeszcze sprawdzić czy nie jest król atakowany
    )
      return false;
    return true;
  }

  switch(pieceType){
    case 'pawn':
      return pawn(isWhite);
    case 'bishop':
      return bishop();
    case 'knight':
      return knight();
    case 'rook':
      return rook();
    case 'queen':
      return rook() && bishop();
    case 'king':
      return king();
    default:
      return true; 
  }
}