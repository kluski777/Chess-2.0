import React from 'react'
import {Box, Table} from '@chakra-ui/react'

const Chessboard = ({size = 8}) => {
  // Liczby pójdą do zmiany, nie 8 tylko to co idzie z propsa
  return (
    [...Array(8).map((_, i) => {
      [...Array(8)].map((_, j) => {
        if((i%2 === 0 && j%2 === 0) || (i%2 === 1 && j%2 === 1))
          return <Box id={`${i}-${j}`} backgroundColor='black'/>
        else
          return <Box id={`${i}-${j}`} backgroundColor='white'/>
      })
    })]
  );
}

export const Game = ({...props}) => {
  // potem się doda różne wersje gry które bd iść razem z propsami.

  return (
    <Table
      width='75%'
      border='1px dashed red'
    >
      <Chessboard/>
    </Table>
  );
}