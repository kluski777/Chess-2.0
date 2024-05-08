import React from 'react'
import {Box} from '@chakra-ui/react'
import {useThemeContext} from './../HandyComponents/Context'

const blackTileColor = 'rgb(100, 100, 100)';
const whiteTileClickedColor = 'rgb(255, 150, 150)';
const blackTileClickedColor = 'red';

export const Tile = ({children, i, j, ...props}) => {
  const theme = useThemeContext();
  const [tileColor, setTileColor] = React.useState((i%2 === 0 && j%2 === 0) || (i%2 === 1 && j%2 === 1) ? blackTileColor : 'white');

  React.useEffect(() => {
    if(tileColor === 'white' && !theme.isBright)
      setTileColor('gray');
    else if(tileColor === 'gray' && theme.isBright)
      setTileColor('white');
  }, [theme, tileColor]);

  return (
    <Box
      {...props}
      id={`square-from-${i}-${j}`}
      onContextMenu={ event => {
        event.preventDefault();
        if(tileColor === 'gray' || tileColor === 'white')
          setTileColor(whiteTileClickedColor);
        else if(tileColor === whiteTileClickedColor)
          setTileColor('white');
        else if(tileColor === blackTileColor)
          setTileColor(blackTileClickedColor)
        else if(tileColor === blackTileClickedColor) 
          setTileColor(blackTileColor)
      }}
      height='100%'
      width='100%'
      backgroundColor={tileColor}
      border='1px solid rgb(60, 60, 60)'
    >
      {children}
    </Box>
  );
}