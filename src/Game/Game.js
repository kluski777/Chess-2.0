import React from 'react'
import {Box} from '@chakra-ui/react'
import {Tile} from './Tile'
import Piece from './Piece'

const Chessboard = ({boardSize = 8}) => {
  const [windowDim, setWindowDim] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  const chessboardRef = React.useRef(null);
  const whitePieceList = React.useRef([]);
  const blackPieceList = React.useRef([]);
  const moveNotation = React.useRef([]);
  const gameState = React.useRef({
    check: false,
    checkmate: false,
    stalemate: false
  });
  
  const widthAndHeightValue = windowDim.width > windowDim.height ? 0.75*windowDim.height : 0.75*windowDim.width;
  const coordsToTile = (x, y) => {
    const tileSize = widthAndHeightValue/boardSize;
    const x_tile = Math.floor( (x - 100 - windowDim.width/2 + widthAndHeightValue/2) / tileSize);
    const y_tile = Math.floor( (y - 0.45*windowDim.height + widthAndHeightValue/2) / tileSize);
    return ( [x_tile, y_tile, tileSize] );
  }

  React.useEffect(() => {    
    const handleResize = () => {
      setWindowDim({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Box
        position='absolute'
        width={widthAndHeightValue/boardSize}
        height={widthAndHeightValue}
        left={`calc(50% + 90px - ${widthAndHeightValue/2}px)`}
        transform='translate(-50%, -50%)'
        top='45%'
        key={`numbers`}
      >
        {Array(boardSize).fill(null).map((_, i) => (
          <h1 style={{height: `${100/boardSize}%`, top: '50%'}} key={`vertical-note-${i}`}>{boardSize - i}</h1>
        ))}
      </Box>
      <Box
        ref={chessboardRef}
        display='flex'
        position='relative' 
        height={widthAndHeightValue}
        width={widthAndHeightValue}
        top='45%'
        left='calc(50% + 100px)'
        transform='translate(-50%, -50%)'
        border='1px solid black'
      >
        {Array(boardSize).fill(null).map((_, i) => (
          <Box
            width='100%'
            height={`${100/boardSize}%`}
            key={i}
          > 
            {Array(boardSize).fill(null).map((_, j) => (
              <React.Fragment key={`fragment-${i}-${j}`}>
                <Tile
                  id={`square-from-${i}-${j}`}
                  key={`square-from-${i}-${j}`}
                  i={i}
                  j={j}
                >
                  {(j === boardSize-1 || j === boardSize-2 || j === 0 || j === 1) &&
                  <Piece
                    pieceID={`figure-from-square-${i}-${j}`}
                    i={i}
                    j={j}
                    boardSize={boardSize}
                    coordsToTile={coordsToTile}
                    ref={chessboardRef}
                    moveNotation={moveNotation}
                    whitePieces={whitePieceList}
                    blackPieces={blackPieceList}
                    result={gameState}
                  />
                  }
                </Tile>
                {j === boardSize-1 && <h1 key={`horizontal-note-${i}`}>{String.fromCharCode(i + 97)}</h1>}
              </React.Fragment>
            ))}
          </Box>
        ))}
      </Box>
    </>
  );
}

export const Game = ({...props}) => {
  // potem się doda różne wersje gry które bd iść razem z propsami.
  return (
    <>
      <Chessboard boardSize={8}/>
    </>
  );
}

/* TODO 
  1. Szach.
  2. Mat.
  3. Pat.
  4. Przy zmianie theme'u powinny zostawać czerwone square'y.
*/