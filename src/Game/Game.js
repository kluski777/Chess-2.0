import React from 'react'
import {Box} from '@chakra-ui/react'
import {Tile} from './Tile'
import Piece from './Piece'
import {useMoveSound} from './../HandyComponents/Sound';

const Chessboard = ({boardSize = 8}) => { // taking boardsize bc there can be many chess styles, options to play
  const [windowDim, setWindowDim] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  const whitePieceList = React.useRef([]);
  const blackPieceList = React.useRef([]);
  
  const gameState = React.useRef({
    check: false,
    checkmate: false,
    stalemate: false
  }); // means check, checkmate and so on.
  const playBeginSound = useMoveSound('gameStart');
  const chessboardRef = React.useRef(null);
  const moveNotation = React.useRef([]);
  
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
    
    playBeginSound();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
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
          <Tile
              id={`square-from-${i}-${j}`}
              key={`square-from-${i}-${j}`}
              i={i}
              j={j}
            >
              <Piece
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
            </Tile>
          ))}
        </Box>
      ))}
    </Box>
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
  4. Przy zmianie themu powinny zostawać czerwone square'y.
*/