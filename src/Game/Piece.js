import React from 'react';
import Moveable from 'react-moveable';
import {useMoveSound} from './../HandyComponents/Sound';
import {usePossibleMovesContext} from './../HandyComponents/PossibleSquares'
import {checkIfIllegalMove, toPieceNotation, filterOut, getPossibleMoves, getKingPos} from './pieceLogic';
import './piece.css';

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
    toRet += pieceType[0].toUpperCase() + "";
  }

  toRet += 'x';
  toRet += String.fromCharCode(finalSquares[0] + 97);
  toRet += 8 - finalSquares[1] + '';
  return toRet;
}

const choosePiece = (props) => {
  if( props.j === 0 ){
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
  } else if( props.j === 1 )
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
  } else if( props.j === props.boardSize-2)
    return [whitePawn, 'pawn', true];
  return [null, null, null];
}

async function waitForCondition(condition, wait = 10) {
  while (condition()) {
    await new Promise( resolve => setTimeout(resolve, wait) ); // Adjust the delay as needed
  }
}

const Piece = React.forwardRef((props, ref) => {
  let [pieceLook, typeTemp, isWhite] = choosePiece(props);
  const movesToPlay = usePossibleMovesContext();
  
  const pieceType = React.useRef(typeTemp);
  const pieceImage = React.useRef(null);
  const thisNode = React.useRef(null);
  
  const [startX, setStartX] = React.useState( props.i )
  const [startY, setStartY] = React.useState( props.j )
  const [pieceGraphics, setPieceGraphics] = React.useState(pieceLook);
  const [isUpgradeOngoing, setIsUpgradeOngoing] = React.useState(false);
  const upgradeOngoingRef = React.useRef(isUpgradeOngoing);

  const playCheck = useMoveSound('check');
  const playMove = useMoveSound('move');
  const playTaking = useMoveSound('taking');
  const playCastle = useMoveSound('castle');

  React.useEffect(() => { // Initial values of white and black pieces
    if(isWhite)
      props.whitePieces.current[`${pieceType.current}${props.i}${props.j}`] = `${props.i}-${props.j}`;
    else
      props.blackPieces.current[`${pieceType.current}${props.i}${props.j}`] = `${props.i}-${props.j}`;
  }, []);
  
  // Casting to array then cutting numbers from keys and converting position in string into numbers
  const parsePieces = ( pieces, isPieceIDNeeded = false ) => Object.entries( pieces ).map(tuple => ({
    type: isPieceIDNeeded ? tuple[0] : tuple[0].replace(/\d+/g, ''), 
    position: tuple[1].split('-').map(f => Number(f))
  }));

  const updatePiecePositionsAndResult = (targetX, targetY) => {
    let enemyKingPos, alliedPieces, enemyPieces;

    if(isWhite) { // Changing non-graphical positioning
      props.whitePieces.current[`${pieceType.current}${props.i}${props.j}`] = `${targetX}-${targetY}`;
      enemyKingPos = getKingPos(props.blackPieces.current);
      alliedPieces = parsePieces( props.whitePieces.current );
      enemyPieces = props.blackPieces.current;
    } else {
      props.blackPieces.current[`${pieceType.current}${props.i}${props.j}`] = `${targetX}-${targetY}`;
      enemyKingPos = getKingPos(props.whitePieces.current);
      alliedPieces = parsePieces( props.blackPieces.current );
      enemyPieces = props.whitePieces.current;
    }

    props.result.current.check = false;

    // all attacked squares by allied pieces
    for(let piece of alliedPieces ) {
      const possibleMoves = getPossibleMoves(
        piece.type,
        isWhite,
        piece.position,
        props.boardSize,
        props.whitePieces,
        props.blackPieces,
        props.moveNotation,
        props.result,
        true
      );

      if( possibleMoves.some( squares => squares[0] === enemyKingPos[0] && squares[1] === enemyKingPos[1] )) {
        props.result.current.check = true;
        break;
      }
    }
    
    // Szach z odsłony również działa
    if( props.result.current.check ) {
      // Parse and get all possible moves for enemy pieces threatening the king
      const enemyMoves = parsePieces(enemyPieces, true)
      .map(piece => ({
        id: piece.type,
        moves: getPossibleMoves(
          piece.type.replace(/\d+/g, ''),
          !isWhite,
          piece.position,
          props.boardSize,
          props.whitePieces,
          props.blackPieces,
          props.moveNotation,
          props.result,
          false
        )
      }))
      .filter(item => item.moves.length > 0);
      
      // then check if there is attack on the king after the move
      for(let piece of enemyMoves) {
        for(let move of piece.moves) {
          let canDefend = true;

          for(let alliedPiece of alliedPieces) {
            const possibleMoves = getPossibleMoves(
              alliedPiece.type,
              isWhite,
              alliedPiece.position,
              props.boardSize,
              props.whitePieces,
              {...props.blackPieces, [piece.id]: `${move[0]}-${move[1]}`},
              props.moveNotation,
              props.result,
              true
            );
            // if still check on the king is on keep checking other moves
            if(possibleMoves.some(position => position[0] === enemyKingPos[0] && position[1] === enemyKingPos[1])) {
              canDefend = false;
            }
          }

          if(canDefend) // Jeśli jest ruch którym przeciwnik się broni to nie ma mata
            return ;
        }
      }

      props.result.current.checkmate = isWhite ? 'White' : 'Black'; // The end of the game if server answers
    } else {
      enemyPieces = parsePieces( enemyPieces );      
      props.result.current.stalemate = true;

      for(let piece of enemyPieces) { // checking if enemy can move
        const possibleMoves = getPossibleMoves(
          piece.type,
          !isWhite,
          piece.position,
          props.boardSize,
          props.whitePieces,
          props.blackPieces,
          props.moveNotation,
          props.result,
          false // possible moves to make
        );
        if( possibleMoves.length !== 0 ) {
          props.result.current.stalemate = false;
          return;
        }
      }
    }
  }

  React.useEffect(() => {
    console.log(`transform: translate((${props.result.current.pawn?.x * 100}% , ${props.result.current.pawn?.y * 100}%)`)
    upgradeOngoingRef.current = isUpgradeOngoing; // a need for ref in waitForChange (newest value) and rerender thus both state and ref are needed
  }, [isUpgradeOngoing]);



































  const executeMove = async (targetX, targetY, dotPositions = movesToPlay.list) => {
    // Clear move indicators (dots) on the board
    props.clearMoveIndicators(dotPositions);

    let destinationSquare = ref.current.querySelector(`#square-from-${targetX}-${targetY}`);
    const { pawnPromotion } = props.result.current; // if pawn is not undefined then pawn promotion is possible

    if (isPawnPromotion(startX, startY, pawnPromotion)) {
      await handlePawnPromotion(targetX, targetY, destinationSquare);
    } else if (isCastlingMove()) {
      handleCastlingMove(targetX, targetY, destinationSquare);
    } else if (isEmptySquare(destinationSquare)) {
      await handleRegularOrEnPassantMove(targetX, targetY);
    } else {
      await handlePieceTakingMove(targetX, targetY);
    }

    finalizeMove(targetX, targetY, destinationSquare);
  };

  const isPawnPromotion = (startX, startY, pawn) => {
    return pawn !== undefined && pawn[0] === startX && pawn[1] === startY;
  };

  const handlePawnPromotion = async (targetX, targetY, destinationSquare) => {
    setIsUpgradeOngoing(true);
    props.result.current.pawn = { x: targetX - startX, y: targetY - startY };

    // Wait for the state to change (promotion selection)
    await waitForCondition(() => !upgradeOngoingRef.current);
    delete props.result.current.pawn;
    await waitForCondition(() => upgradeOngoingRef.current);

    const notation = destinationSquare.childElementCount > 0
      ? pieceTakingNotation('pawn', [targetX, targetY], startX) + `=${pieceType.current.charAt(0).toUpperCase()}`
      : toPieceNotation('pawn', targetX, targetY) + `=${pieceType.current.charAt(0).toUpperCase()}`;

    props.moveNotation.current = [...props.moveNotation.current, notation];
    removePawnPiece();
    updatePiecePositionsAndResult(targetX, targetY);
  };

  const isCastlingMove = () => {
    return checkIfThisColorMoves();
  };

  const handleCastlingMove = (targetX, targetY, destinationSquare) => {
    const edge = isWhite ? props.boardSize - 1 : 0;
    updatePiecePositionsAndResult(targetX, targetY);
    props.result.current.check ? playCheck() : playCastle();

    const lastMove = props.moveNotation.current.at(-1);
    if (lastMove === 'O-O') {
      moveRook(props.boardSize - 1, edge, props.boardSize - 3, edge);
      destinationSquare = ref.current.querySelector(`#square-from-${props.boardSize - 2}-${edge}`);
    } else if (lastMove === 'O-O-O') {
      moveRook(0, edge, 3, edge);
      destinationSquare = ref.current.querySelector(`#square-from-2-${edge}`);
    }
  };

  const moveRook = (fromX, fromY, toX, toY) => {
    const rook = ref.current.querySelector(`#figure-from-square-${fromX}-${fromY}`);
    ref.current.querySelector(`#square-from-${toX}-${toY}`).appendChild(rook);
  };

  const isEmptySquare = (square) => {
    return square.childElementCount === 0 || square.children[0].childElementCount === 0;
  };

  const handleRegularOrEnPassantMove = async (targetX, targetY) => {
    const directionOfWander = isWhite ? 1 : -1;
    const [epX, epY] = props.result.current?.enPassant ?? [-1, -1];

    props.moveNotation.current = [...props.moveNotation.current, toPieceNotation(pieceType.current, targetX, targetY)];
    updatePiecePositionsAndResult(targetX, targetY);

    if (isEnPassantMove(targetX, targetY, epX, epY)) {
      await handleEnPassantMove(targetX, targetY, directionOfWander);
    } else {
      playResultingMove();
    }
  };

  const isEnPassantMove = (targetX, targetY, epX, epY) => {
    return pieceType.current === 'pawn' && epX === targetX && epY === targetY;
  };

  const handleEnPassantMove = async (targetX, targetY, directionOfWander) => {
    props.moveNotation.current[props.moveNotation.current.length - 1] = pieceTakingNotation(pieceType.current, [targetX, targetY], startX);

    const pieceDown = ref.current.querySelector(`#square-from-${targetX}-${targetY + directionOfWander}`);
    pieceDown.replaceChildren();
    filterOut((isWhite ? props.blackPieces : props.whitePieces), targetX, targetY + directionOfWander);
    playTaking();
  };

  const handlePieceTakingMove = async (targetX, targetY) => {
    props.moveNotation.current = [...props.moveNotation.current, pieceTakingNotation(pieceType.current, [targetX, targetY], startX)];
    filterOut((isWhite ? props.blackPieces : props.whitePieces), targetX, targetY);
    updatePiecePositionsAndResult(targetX, targetY);
    props.result.current.check ? playCheck() : playTaking();
  };

  const playResultingMove = () => {
    props.result.current.check ? playCheck() : playMove();
  };

  const removePawnPiece = () => {
    if (isWhite) {
      delete props.whitePieces.current[`pawn${props.i}${props.j}`];
    } else {
      delete props.blackPieces.current[`pawn${props.i}${props.j}`];
    }
  };

  const finalizeMove = (targetX, targetY, destinationSquare) => {
    destinationSquare.replaceChildren(thisNode.current);
    setStartX(targetX);
    setStartY(targetY);

    if (props.result.current.check) {
      props.moveNotation.current[props.moveNotation.current.length - 1] += '+';
    }
  };

































  const checkIfThisColorMoves = () => (isWhite && props.moveNotation.current.length%2 !== 0) || (!isWhite && props.moveNotation.current.length%2 === 0)

  const handleMove = async (e) => {
    const [targetX, targetY] = props.coordsToTile(e.clientX, e.clientY);
    
    // setting piece in the middle of the square
    e.target.style.transform = "translate(0px, 0px)";

    if(
      (startX !== targetX || startY !== targetY) && // check if piece was moved
      !checkIfThisColorMoves() && // check if good color is moved
      !checkIfIllegalMove( // check if move is legal
        `${pieceType.current}${props.i}${props.j}`,
        isWhite,
        [startX, startY],
        [targetX, targetY],
        props.boardSize,
        props.whitePieces,
        props.blackPieces,
        props.moveNotation,
        props.result
      )
    )
      executeMove(targetX, targetY);
  }

  const PieceToChoose = ({pieceChosen, newPieceGraphics}) => {
    return (
      <img
        src={newPieceGraphics}
        alt={`${isWhite ? 'white' : 'black'}-${pieceChosen}`}
        className='figureToPromoteStyle'
        onClick={() => {
            pieceType.current = pieceChosen;
            setPieceGraphics(newPieceGraphics);
            setIsUpgradeOngoing( false ); // figure already chosen
          }
        }
      />
    );
  }

  if(pieceGraphics !== null)
    return (
      <div
        className='pieceStyling'
        ref={thisNode}
        id={props.pieceID}
        key={props.pieceID}
        onClick={e => e.stopPropagation()}
        // here I should add something so that pointing will work as expected
      >
        { isUpgradeOngoing ?
        <div style={{ display: 'flex', flexDirection: 'column', transform: `translate((${props.result.current.pawn.x * 100}% , ${props.result.current.pawn.y * 100}%)`}}> 
          <PieceToChoose pieceChosen='bishop' newPieceGraphics={isWhite ? whiteBishop : blackBishop}/>
          <PieceToChoose pieceChosen='knight' newPieceGraphics={isWhite ? whiteKnight : blackKnight}/>
          <PieceToChoose pieceChosen='rook' newPieceGraphics={isWhite ? whiteRook : blackRook}/>
          <PieceToChoose pieceChosen='queen' newPieceGraphics={isWhite ? whiteQueen : blackQueen}/>
        </div> :
        <>
        {/* isInside wydaje się być fajnym propem */}
          <Moveable
            draggable={true}
            origin={false}
            target={pieceImage}
            onClick={() => {
              props.clearMoveIndicators(movesToPlay.list);

              if( !checkIfThisColorMoves() ){ // when it is the move of this color
                movesToPlay.setList( // setting all possible moves with this piece
                  getPossibleMoves(
                    pieceType.current,
                    isWhite,
                    [startX, startY],
                    props.boardSize,
                    props.whitePieces,
                    props.blackPieces,
                    props.moveNotation,
                    props.result,
                    false // not checking if square is attacked
                  )
                );

                movesToPlay.setExecuteMoveFunction( () => executeMove ); // just store the reference
                movesToPlay.setPieceID( `${pieceType.current}${props.i}${props.j}` );
              }
            }}
            onDrag={e => {
              e.target.style.transform = e.transform
            }}
            hideDefaultLines={true}
            onDragEnd={handleMove}
          />
          <img
            className="moveableStyle"
            ref={pieceImage}
            src={pieceGraphics}
            alt={`figure-from-square-${props.i}-${props.j}`}
          />
        </>
        }
      </div>
    );
})

export default Piece;