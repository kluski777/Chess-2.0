import React, {useState, useEffect, useRef} from 'react';
import { Box } from '@chakra-ui/react';
import { useMoveMarkersContext } from '../Contexts/moveMarkersContext';
import { useGameContext } from '../Contexts/gameContext';
import { useThemeContext } from '../Contexts/themeContext';
import isEqual from 'fast-deep-equal';
import { Dot } from './Dot';

export const setTiles = {}

export const Tile = ({i, j, children, ...props}) => {
  const [tileColor, setTileColor] = useState('default');
  const { markerPositions } = useMoveMarkersContext();
  const thisElementRef = useRef(null);
  const theme = useThemeContext();
  const {gameEvents: {isWhiteToMove}, moveHistory} = useGameContext();

  const colors = {
    white: {
      default: theme.isBright ? '#2D5A27' : '#1A3816',
      red: theme.isBright ? '#FF0000' : '#990000',
      moved: theme.isBright ? '#4CAF50' : '#388E3C',
      premove: theme.isBright ? '#4651AA' : '#202080',
    },
    black: {
      default: theme.isBright ? '#CCE6CF' : '#A9C484',
      red: theme.isBright ? '#FF0000' : '#990000',
      moved: theme.isBright ? '#8BC34A' : '#689F38',
      premove: theme.isBright ? '#4651AA' : '#202080',
    }
  };

  const squareStyle = {
    height: '100%',
    width: '100%',
    aspectRatio: '1/1',
    backgroundColor: colors[(i + j) % 2 === 0 ? 'white' : 'black'][tileColor],
  };

  const rightClick = (e, customArg = '') => {
    if( !customArg ) {
      e?.preventDefault();
      e?.stopPropagation(); // Need so that only one square gets highlighted
      setTileColor(color => color === 'red' ? 'default' : 'red');
    } else {
      setTileColor(customArg);
    }
  }

  useEffect(() => {
    if( isEqual( Object.values(moveHistory.current.at(-1) ?? {})[0]?.finalSquares, {x: i, y: j}) ) {
      setTileColor('moved');
    } else {
      setTileColor('default');
    }
  }, [isWhiteToMove, moveHistory, i, j]);

  useEffect(() => {
    setTiles[`${i}-${j}`] = rightClick;
  }, [i, j]);

  return (
    <Box
      {...props}
      ref={thisElementRef}
      height='100%'
      width='100%'
      position='relative'
      backgroundColor={tileColor}
      border='1px solid rgb(0, 0, 0)'
      onContextMenu={rightClick}
    >
      <div style={squareStyle} id={`square-${i}-${j}`} key={`square-${i}-${j}`}>
        {children}
      </div>
      {markerPositions.some(([x, y]) => x === i && y === j) && <Dot i={i} j={j}/>}
    </Box>
  );
};