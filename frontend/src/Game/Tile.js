import React, {useState, useEffect, useRef} from 'react';
import {Box} from '@chakra-ui/react';
import {useThemeContext} from './../HandyComponents/themeContext';
import {usePossibleMovesContext} from './../HandyComponents/PossibleSquares'

const blackBrightColor = 'rgb(60, 60, 120)';
const blackDarkColor = 'rgb(40, 40, 90)'
// const blackLeftClickedColor = 'rgb(70, 120, 70)';
const blackRightClickedColor = 'rgb(240, 60, 60)';

const whiteBrightColor = 'white';
const whiteDarkColor = 'gray';
// const whiteLeftClickedColor = 'rgb(255, 150, 150)';
const whiteRightClickedColor = 'red';


export const Tile = ({i, j, children, whitePieces, blackPieces, ...props}) => {
  const moveList = usePossibleMovesContext();
  const thisElementRef = useRef(null);
  const theme = useThemeContext();
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
        onContextMenu={ event => {
          event.preventDefault();

          if(tileColor === whiteDarkColor || tileColor === whiteBrightColor)
            setTileColor(whiteRightClickedColor);
          else if(tileColor === whiteRightClickedColor)
            setTileColor(theme.isBright ? whiteBrightColor : whiteDarkColor);
          else if(tileColor === blackBrightColor || tileColor === blackDarkColor)
            setTileColor(blackRightClickedColor);
          else if(tileColor === blackRightClickedColor)
            setTileColor(theme.isBright ? blackBrightColor : blackDarkColor);
        }}
        onClick={ event => {
          event.preventDefault();
          const childList = Array.from( thisElementRef.current.children ).filter(element => element.id.startsWith( 'dot' ));

          if(childList.length > 0 && moveList.list.some(f => f[0] === i && f[1] === j)) {
            moveList.executeMoveFunction(i, j, moveList.list); // without moveList.list executeMove would have obsolete value
          }
        }}
        height='100%'
        width='100%'
        position='relative'
        backgroundColor={tileColor}
        border='1px solid rgb(60, 60, 60)'
      >
        {children}
      </Box>
  );
};