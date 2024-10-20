import React from 'react'
import {useThemeContext} from './../HandyComponents/Context'
import './dot.css';
import {Box} from '@chakra-ui/react'
import {Tile} from './Tile'
import Piece from './Piece'
import {usePossibleMovesContext} from './../HandyComponents/PossibleSquares'


const Chessboard = ({boardSize = 8}) => {
  const theme = useThemeContext();
  const movesToPlay = usePossibleMovesContext();
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

  const createDot = (coords) => { // i, j - coordinates of the chessboard
    const dotContainer = document.createElement('div');
    dotContainer.id = `dot-from-${coords[0]}-${coords[1]}`; // niepotrzebne
    dotContainer.className = "dot-container";
    const dot = document.createElement('div');
    dot.className = "dot";
    dotContainer.appendChild(dot)
    chessboardRef.current.querySelector(`#square-from-${coords[0]}-${coords[1]}`).appendChild(dotContainer);
  }
    
  const clearMoveIndicators = (movesList) => {
    if(movesList?.length > 0) {
      for(let coords of movesList) {
        const children = Array.from( chessboardRef.current.querySelector(`#square-from-${coords[0]}-${coords[1]}`).children );
        for(let i in children){
          if( children[i].className === 'dot-container' )
            children[i].remove();
        }
      }
    }
  }

  React.useEffect(() => {
    if(movesToPlay?.list?.length > 0) {
      for(let coords of movesToPlay.list) // jakim cudem tu się pojawia 32 dzieciaków
        createDot(coords);
    } 
  }, [movesToPlay.list]);

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
          <h1 style={{height: `${100/boardSize}%`, top: '50%', color: theme.isBright ? 'black' : 'white'}} key={`vertical-note-${i}`}>{boardSize - i}</h1>
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
                  ref={chessboardRef}
                  id={`square-from-${i}-${j}`}
                  key={`square-from-${i}-${j}`}
                  whitePieces={whitePieceList}
                  blackPieces={blackPieceList}
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
                    clearMoveIndicators={clearMoveIndicators}
                  />
                  }
                </Tile>
                {j === boardSize-1 && <h1 key={`horizontal-note-${i}`} style={{color: theme.isBright ? 'black' : 'white'}}>{String.fromCharCode(i + 97)}</h1>}
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