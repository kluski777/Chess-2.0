import React, {useState, useEffect, useRef} from 'react';
import { Box } from '@chakra-ui/react';
import { useThemeContext } from '../Contexts/themeContext';
import { useMoveMarkersContext } from '../Contexts/moveMarkersContext';
import { Dot } from './Dot';

const squareStyle = {
  height: '100%',
  width: '100%',
  aspectRatio: '1/1',
}

const blackBrightColor = 'rgb(60, 60, 120)';
const blackDarkColor = 'rgb(40, 40, 90)';
// const blackLeftClickedColor = 'rgb(70, 120, 70)';
// const blackRightClickedColor = 'rgb(240, 60, 60)';

const whiteBrightColor = 'white';
const whiteDarkColor = 'gray';
// const whiteLeftClickedColor = 'rgb(255, 150, 150)';
// const whiteRightClickedColor = 'red';

export const Tile = ({i, j, children, ...props}) => {
  const thisElementRef = useRef(null);
  const theme = useThemeContext();
  const { markerPositions } = useMoveMarkersContext();
  const [tileColor, setTileColor] = useState((i%2 === 0 && j%2 === 0) || (i%2 === 1 && j%2 === 1) ? blackBrightColor : whiteBrightColor);
  
  useEffect(() => {
    if(tileColor === blackBrightColor && !theme.isBright){
      setTileColor(blackDarkColor);
    } else if(tileColor === blackDarkColor && theme.isBright){
      setTileColor(blackBrightColor);
    }
    if(tileColor === whiteBrightColor && !theme.isBright){
      setTileColor(whiteDarkColor);
    } else if(tileColor === whiteDarkColor && theme.isBright){
      setTileColor(whiteBrightColor);
    }
  }, [theme, tileColor]);

  return (
    <Box
      {...props}
      ref={thisElementRef}
      height='100%'
      width='100%'
      position='relative'
      backgroundColor={tileColor}
      border='1px solid rgb(0, 0, 0)'
    >
      <div style={squareStyle} id={`square-${i}-${j}`} key={`square-${i}-${j}`}>
        {children}
      </div>
      {markerPositions.some(([x, y]) => x === i && y === j) && <Dot i={i} j={j}/>}
    </Box>
  );
};