import React from 'react'
import {Box} from '@chakra-ui/react'
import {Tile} from './Tile'
import Piece from './Piece'

const Chessboard = ({boardSize = 8}) => { // taking boardsize bc there can be many chess styles, options to play
  const [windowDim, setWindowDim] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  const [moveNotation, setMoveNotation] = React.useState([]);
  const [whitePieceList, setWhitePieceList] = React.useState(null);
  const [blackPieceList, setBlackPieceList] = React.useState(null);
  const chessboardRef = React.useRef(null);
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
                setMoveNotation={setMoveNotation}
                whitePieces={{whitePieceList, setWhitePieceList}}
                blackPieces={{blackPieceList, setBlackPieceList}}
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
  1. Żeby były legalne.
  2. Przy zmianie themu powinny zostawać czerwone square'y.
*/