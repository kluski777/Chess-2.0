// Pure JS logic checking if moves are legit or aren't

const getKingPos = (pieces) => {
  return (Object.entries(pieces)
    .filter(([key, _]) => key.startsWith('king'))
    .map(([_, val]) => val)
    .map(val => val.split('-').map(f => Number(f))).flat()
  );
}

// export const getPossibleMoves = (
//   pieceID,
//   isWhite,
//   startPos,
//   boardSize,
//   whitePieces,
//   blackPieces,
//   moveNotation,
//   refDestinationTile,
//   result
// ) => {
//   // tu wszystko będzie szło
// }

export const checkIfIllegalMove = (
  pieceID,
  isWhite,
  startPos,
  finalPos,
  boardSize,
  whitePieces,
  blackPieces,
  moveNotation,
  refDestinationTile,
  result
) => {
  let enemyPieces = isWhite ? Object.values(blackPieces.current) : Object.values(whitePieces.current);
  let alliedPieces = isWhite ? Object.values(whitePieces.current) : Object.values(blackPieces.current);
  let justChecking = false;

  const pieceType = pieceID.replace(/[0-9]+/g, "");
  const squareChange = [ finalPos[0] - startPos[0], finalPos[1] - startPos[1] ];
  const kingPos = isWhite ? getKingPos(whitePieces.current) : getKingPos(blackPieces.current);
  const enemyKingPos = isWhite ? getKingPos(blackPieces.current) : getKingPos(whitePieces.current);

  const changePosTemporary = (pieces, pieceWasMoved) => {
    return (
      pieceWasMoved ?
      [ ...pieces.filter(value => value !== `${startPos[0]}-${startPos[1]}`),
      `${finalPos[0]}-${finalPos[1]}` ] :
      pieces.filter(value => value !== `${finalPos[0]}-${finalPos[1]}`)
    );
  }

  const isSquareAttacked = (finalSquares, filterMovedPiece = true) => {
    let enemy = isWhite ? blackPieces.current : whitePieces.current;
    if(filterMovedPiece)
      enemy = Object.fromEntries( Object.entries(enemy).filter(([, val2]) => val2 !== `${finalPos[0]}-${finalPos[1]}`) )
    
    let startSquares;
    let piece;
    let move;
    
    [enemyPieces, alliedPieces] = [changePosTemporary(alliedPieces, filterMovedPiece), enemyPieces];
    isWhite = !isWhite;
    justChecking = true;
    
    for(let key in enemy) {
      startSquares = enemy[key].split('-').map(f => Number(f));
      piece = key.replace(/\d/g, "");
      move = [finalSquares[0] - startSquares[0], finalSquares[1] - startSquares[1]];

      if( !dispatcher(move, finalSquares, startSquares, piece) )
        return true;
    }
  
    [enemyPieces, alliedPieces] = [alliedPieces, enemyPieces];
    isWhite = !isWhite;
    justChecking = false;
    return false;
  }

  const pawn = (isWhite, move, finalSquares) => {
    const directionOfWander = isWhite ? -1 : 1;

    const isOneSquareMoveLegit = () => {
      const toRet = (
        move[0] === 0 &&
        move[1] === directionOfWander &&
        !enemyPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`) &&
        !alliedPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`) &&
        (justChecking || !isSquareAttacked(kingPos))
      );
      if(!justChecking && toRet && (isWhite ? startPos[1] === 1 : startPos[1] === boardSize-2))
        result.current = {...result.current, pawn: pieceID};

      return toRet;
    }

    const isTakingLegit = () => {
      const toRet = (
        Math.abs(move[0]) === 1 &&
        move[1] === directionOfWander &&
        (justChecking || enemyPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`)) &&
        (justChecking || !isSquareAttacked(kingPos))
      );
      if(!justChecking && toRet && (isWhite ? startPos[1] === 1 : startPos[1] === boardSize-2))
        result.current = {...result.current, pawn: pieceID};

      return toRet;
    }

    const is2SquareMoveLegit = () => {
      return (
        move[0] === 0 &&
        move[1] === directionOfWander*2 &&
        finalSquares[1] - move[1] === (isWhite ? boardSize-2 : 1) &&
        !enemyPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`) &&
        !enemyPieces.includes(`${finalSquares[0]}-${finalSquares[1] - directionOfWander}`) &&
        !alliedPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`) &&
        !alliedPieces.includes(`${finalSquares[0]}-${finalSquares[1] - directionOfWander}`) &&
        (justChecking || !isSquareAttacked(kingPos))
      );
    }

    const isEnPassantLegit = () => {
      return (
        Math.abs(move[0]) === 1 &&
        move[1] === directionOfWander &&
        enemyPieces.includes(`${finalSquares[0]}-${finalSquares[1] - directionOfWander}`) &&
        !moveNotation.current.includes(`${toPieceNotation('pawn', finalSquares[0], finalSquares[1])}`) &&
        moveNotation.current.at(-1) === toPieceNotation('pawn', finalSquares[0], finalSquares[1] - directionOfWander) &&
        (justChecking || !isSquareAttacked(kingPos))
      );
    }
    
    if( isOneSquareMoveLegit() || is2SquareMoveLegit() || isTakingLegit() ) {
      return false;
    } else if( isEnPassantLegit() ) {
      filterOut( isWhite ? blackPieces : whitePieces, finalSquares[0], finalSquares[1] - directionOfWander );
      refDestinationTile
        .querySelector(`#square-from-${finalSquares[0]}-${finalSquares[1] - directionOfWander}`)
        .replaceChildren();
      return false;
    }
    return true;
  }

  const bishop = (move, finalSquares, startSquares) => {
    if(
      Math.abs(move[0]) === Math.abs(move[1]) && 
      (justChecking || !alliedPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`)) &&
      (justChecking || !isSquareAttacked(kingPos))
    ){
      const directX = -Math.sign(move[0]);
      const directY = -Math.sign(move[1]);
      let i = move[0];
      let j = move[1];

      while(Math.abs(i) !== 1 && Math.abs(j) !== 1){
        i += directX;
        j += directY;
        
        const square = `${startSquares[0] + i}-${startSquares[1] + j}`;
        if( alliedPieces.includes(square) || enemyPieces.includes(square) )
          return true;
      }
      return false;
    }
    return true;
  }

  const rook = (move, finalSquares, startSquares) => {
    if(
      (move[0] === 0 || move[1] === 0) &&
      (justChecking || !alliedPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`)) &&
      (justChecking || !isSquareAttacked(kingPos))
    ){
      const direction = Math.sign(move[0] !== 0 ? move[0] : move[1]);
      
      for(let i=direction; i !== move[1] && i !== move[0]; i += direction){
        const square = move[0] === 0 ? `${startSquares[0]}-${startSquares[1] + i}` : `${startSquares[0] + i}-${startSquares[1]}`;
        if( enemyPieces.includes(square) || alliedPieces.includes(square) )
          return true;
      }
      return false;
    }
    return true;
  }

  const knight = (move) => {
    if(
      ((Math.abs(move[0]) === 1 && Math.abs(move[1]) === 2) ||
      (Math.abs(move[0]) === 2 && Math.abs(move[1]) === 1)) &&
      (justChecking || !isSquareAttacked(kingPos))
    ){
      return false;
    }
    return true;
  }

  const king = (move, finalSquares) => {
    if(
      ((Math.abs(move[0]) === 0 && Math.abs(move[1]) === 1) ||
      (Math.abs(move[0]) === 1 && Math.abs(move[1]) === 1) ||
      (Math.abs(move[0]) === 1 && Math.abs(move[1]) === 0)) &&
      !alliedPieces.includes(`${finalSquares[0]}-${finalSquares[1]}`) &&
      (justChecking || !isSquareAttacked(finalSquares))
    )
      return false;

    else if( // castling
      Math.abs(move[0]) > 1 && 
      move[1] === 0 && 
      !result.current.check &&
      moveNotation.current.filter( (_, index) => isWhite ? index%2 === 0 : index%2 !== 0 ).filter(val => val.startsWith("K") || val.startsWith("O")).length === 0
    ){

      let rookXcoords = []; // na wypadek 960 to zbieram
      const alliedColor = isWhite ? whitePieces.current : blackPieces.current;

      for(let elem of Object.keys(alliedColor)) {
        if(elem.startsWith("rook"))
          rookXcoords.push(elem);
      }

      rookXcoords = rookXcoords.map(s => alliedColor[s]).map(s => Number(s.slice(0,1)));

      if(
        move[0] > 1 &&
        moveNotation.current.filter(s => s.startsWith("R" + String.fromCharCode(boardSize + 96))).length === 0 &&
        moveNotation.current.filter(s => s.startsWith("Rx") && s.charCodeAt(2) - 97 > kingPos[0] && s.endsWith( isWhite ? '1' : `${boardSize}`)).length === 0 &&
        moveNotation.current.filter(s => s.startsWith("R") && s.charCodeAt(1) - 97 > kingPos[0] && s.endsWith( isWhite ? '1' : `${boardSize}`)).length === 0
      ){ // short castling.
        finalPos = [boardSize-2, isWhite ? boardSize-1 : 0];
        
        for(let i=1; i <= finalPos[0] - kingPos[0]; i++){
          const xTile = startPos[0] + i;
          const yTile = startPos[1];

          if(
            enemyPieces.includes(`${xTile}-${yTile}`) ||
            alliedPieces.includes(`${xTile}-${yTile}`) ||
            isSquareAttacked([xTile, yTile], false)
          )
            return true;
        }
        moveNotation.current = [...moveNotation.current, 'O-O'];

        if(isWhite){
          whitePieces.current = {...whitePieces.current, [`rook${boardSize-1}${boardSize-1}`]: `${finalPos[0]-1}-${finalPos[1]}`};
        } else {
          blackPieces.current = {...blackPieces.current, [`rook${boardSize-1}0`]: `${finalPos[0]-1}-${finalPos[1]}`};
        }

        return false;

      } else if(
        move[0] < -1 &&
        moveNotation.current.filter(s => s.startsWith("R" + String.fromCharCode(97))).length === 0 &&
        moveNotation.current.filter(s => s.startsWith("Rx") && s.charCodeAt(2) - 97 < kingPos[0] && s.endsWith( isWhite ? '1' : `${boardSize}` )).length === 0 &&
        moveNotation.current.filter(s => s.startsWith("R") && s.charCodeAt(1) - 97 < kingPos[0] && s.endsWith( isWhite ? '1' : `${boardSize}` )).length === 0
      ) { // long castling.
        finalPos = [2, isWhite ? boardSize-1 : 0];

        for(let i=-1; i >= finalPos[0] - kingPos[0]; i--){
          const xTile = startPos[0] + i;
          const yTile = startPos[1];

          if(
            enemyPieces.includes(`${xTile}-${yTile}`) ||
            alliedPieces.includes(`${xTile}-${yTile}`) ||
            isSquareAttacked([xTile, yTile], false)
          )
            return true; // po roszadzie jest szach jakimś cudem xd
        }
        moveNotation.current = [...moveNotation.current, 'O-O-O'];

        if(isWhite)
          whitePieces.current = {...whitePieces.current, [`rook0${boardSize-1}`]: `${finalPos[0] + 1}-${finalPos[1]}`};
        else
          blackPieces.current = {...blackPieces.current, [`rook00`]: `${finalPos[0] + 1}-${finalPos[1]}`};

        return false;
      }
    }
    return true;
  }

  const dispatcher = (move = squareChange, finalSquares = finalPos, startSquares = startPos, piece = pieceType) => {
    let isIllegal = true;

    switch(piece){
      case 'pawn':
        isIllegal = pawn(isWhite, move, finalSquares);
        break;
      case 'bishop':
        isIllegal = bishop(move, finalSquares, startSquares);
        break;
      case 'knight':
        isIllegal = knight(move);
        break;
      case 'rook':
        isIllegal = rook(move, finalSquares, startSquares);
        break;
      case 'queen':
        isIllegal = rook(move, finalSquares, startSquares) && bishop(move, finalSquares, startSquares);
        break;
      case 'king':
        isIllegal = king(move, finalSquares);
        break;
      default:
    }

    if(!isIllegal && !justChecking) {
      if(isWhite)
        whitePieces.current = {...whitePieces.current, [pieceID]: `${finalPos[0]}-${finalPos[1]}`};
      else
        blackPieces.current = {...blackPieces.current, [pieceID]: `${finalPos[0]}-${finalPos[1]}`};

      isWhite = !isWhite;
      result.current = {...result.current, check: isSquareAttacked(enemyKingPos, false)};
      isWhite = !isWhite;
    }

    return isIllegal;
  }

  return dispatcher();
}

export const toPieceNotation = (pieceType, xIndex, yIndex) => {
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

export const filterOut = (pieces, finalX, finalY) => {
  pieces.current = Object.fromEntries(
    Object.entries(pieces.current)
      .filter(([, value]) => value !== `${finalX}-${finalY}`)
  )
}