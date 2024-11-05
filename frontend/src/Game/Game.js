import React from 'react'
import {ThemeContext} from './../HandyComponents/themeContext' // theme
import brightBackground from './../Assets/mainPage/brightGeometry.png'
import darkBackground from './../Assets/mainPage/darkGeometry.png'
import './dot.css';
import {Box} from '@chakra-ui/react'
import {Tile} from './Tile'
import Piece from './Piece'
import {possibleMovesContext} from './../HandyComponents/PossibleSquares'
import {useLogContext} from '../HandyComponents/LogContext';

class Chessboard extends React.PureComponent {
  static contextType = possibleMovesContext; // movesToPlay context

  constructor({isUserWhite, opponent, boardSize = 8}){ // tu musi pójść uogólnienie - zmiana wszystkiego tak naprawdę
    super();
    this.isUserWhite = isUserWhite;
    this.opponent = opponent;
    this.boardSize = boardSize;
    this.state = {
      windowDim: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    }
    this.widthAndHeightValue = this.state.windowDim.width > this.state.windowDim.height ? 0.75*this.state.windowDim.height : 0.75*this.state.windowDim.width;

    this.chessboardRef = React.createRef();
    this.playerPieceList = React.createRef();
    this.opponentPieceList = React.createRef();
    this.moveNotation = React.createRef();
    this.gameState = React.createRef();
  }

  componentDidMount() {
    this.playerPieceList.current = [];
    this.opponentPieceList.current = [];
    this.moveNotation.current = [];
    this.gameState.current = {
      check: false,
      checkmate: false,
      stalemate: false
    }
  }
  
  componentDidUpdate() {
    window.addEventListener('resize', this.handleResize);

    if(this.context?.list?.length > 0) {
      for(let coords of this.context.list)
        this.createDot(coords);
    }
  }

  componentWillUnmount() { 
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <ThemeContext.Consumer> 
        {theme =>
          <Box
            width='100%'
            height='100%'
            backgroundImage={theme.isBright ? brightBackground : darkBackground}
            backgroundSize={'100px'}
            backgroundColor={theme.isBright ? '#BBBBBB' : '#223322'}
          >
            <Box
              position="absolute"
              border="1px solid black"
              height="100px"
              width="100px"
              transform="translateX(50%)"
              backgroundColor='rgba(180, 180, 180, 0.7)'
              top={`calc(45% - ${this.widthAndHeightValue/2}px)`}
              left={`calc(50% + ${this.widthAndHeightValue/2 + this.widthAndHeightValue/this.boardSize}px)`}
            >
              <h1>{this.opponent?.user}</h1>
              <h1>{this.opponent?.rating}</h1>
            </Box>
            <Box
              position='absolute'
              width={this.widthAndHeightValue/this.boardSize}
              height={this.widthAndHeightValue}
              left={`calc(50% + 90px - ${this.widthAndHeightValue/2}px)`}
              transform='translate(-50%, -50%)'
              top='45%'
              key={`numbers`}
              >
              {Array(this.boardSize).fill(null).map((_, i) => (
                <h1 style={{height: `${100/this.boardSize}%`, top: '50%', color: theme.isBright ? 'black' : 'white'}} key={`vertical-note-${i}`}>{this.isUserWhite ? this.boardSize-i : i+1}</h1>
              ))}
            </Box>
            <Box
              ref={this.chessboardRef}
              display='flex'
              position='relative'
              height={this.widthAndHeightValue}
              width={this.widthAndHeightValue}
              top='45%'
              left='calc(50% + 100px)'
              transform='translate(-50%, -50%)'
              border='1px solid black'
            >
              {Array(this.boardSize).fill(null).map((_, i) => (
                <Box
                  width='100%'
                  height={`${100/this.boardSize}%`}
                  key={i}
                > 
                  {Array(this.boardSize).fill(null).map((_, j) => (
                    <React.Fragment key={`fragment-${i}-${j}`}>
                      <Tile
                        id={`square-from-${i}-${j}`}
                        whitePieces={this.playerPieceList}
                        blackPieces={this.opponentPieceList}
                        i={i}
                        j={j}
                      >
                        {(j === this.boardSize-1 || j === this.boardSize-2 || j === 0 || j === 1) &&
                          <Piece
                            pieceID={`figure-from-square-${i}-${j}`}
                            i={i}
                            j={j}
                            isUserWhite={this.isUserWhite}
                            boardSize={this.boardSize}
                            coordsToTile={this.coordsToTile}
                            ref={this.chessboardRef}
                            moveNotation={this.moveNotation}
                            whitePieces={this.playerPieceList}
                            blackPieces={this.opponentPieceList}
                            result={this.gameState}
                            clearMoveIndicators={this.clearMoveIndicators}
                          />
                        }
                      </Tile>
                      {j === this.boardSize-1 && <h1 key={`horizontal-note-${i}`} style={{color: theme.isBright ? 'black' : 'white'}}>{String.fromCharCode(i + 97)}</h1>}
                    </React.Fragment>
                  ))}
                </Box>
              ))}
            </Box>
          </Box> 
        }
      </ThemeContext.Consumer>
    );
  }
  
  handleResize = () => {
    this.setState({
      windowDim: {
        height: window.innerHeight, 
        width: window.innerWidth
      }
    });
  }
  
  coordsToTile = (x, y) => {
    const tileSize = this.widthAndHeightValue/this.boardSize;
    const x_tile = Math.floor( (x - 100 - this.state.windowDim.width/2 + this.widthAndHeightValue/2) / tileSize);
    const y_tile = Math.floor( (y - 0.45*this.state.windowDim.height + this.widthAndHeightValue/2) / tileSize);
    return ( [x_tile, y_tile, tileSize] );
  }
  
  createDot = (coords) => { // i, j - coordinates of the chessboard
    const dotContainer = document.createElement('div');
    dotContainer.id = `dot-from-${coords[0]}-${coords[1]}`; // niepotrzebne
    dotContainer.className = "dot-container";
    const dot = document.createElement('div');
    dot.className = "dot";
    dotContainer.appendChild(dot)
    this.chessboardRef.current.querySelector(`#square-from-${coords[0]}-${coords[1]}`).appendChild(dotContainer);
  }
    
  clearMoveIndicators = () => {
    if(this.context?.list?.length > 0) {
      for(let coords of this.context.list) {
        const children = Array.from( this.chessboardRef.current.querySelector(`#square-from-${coords[0]}-${coords[1]}`).children );
        for(let i in children){ // this simply does not work
          if( children[i].className === 'dot-container' )
            children[i].remove();
        }
      }
    }
  }
}

export const Game = ({...props}) => {
  const logState = useLogContext();
  
  // potem się doda różne wersje gry które bd iść razem z propsami.
  return (
    <>
      <Chessboard boardSize={8} isUserWhite={logState.logState.isUserWhite} opponent={logState.logState.opponent} />
    </>
  );
}

/* TODO 
  1. Problem przy zmianach theme'u.
  2. Brak usuwania kropek
*/