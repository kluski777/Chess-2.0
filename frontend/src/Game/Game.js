import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { ThemeContext } from './../HandyComponents/themeContext';
import brightBackground from './../Assets/mainPage/brightGeometry.png'; // background image
import darkBackground from './../Assets/mainPage/darkGeometry.png'; // background image
import './dot.css';
import { boardSize } from '../HandyComponents/LogContext';
import { beginPositions } from './rules/beginningPositions';
import { Box } from '@chakra-ui/react';
import { Tile } from './Tile';
import { Resizable } from 'react-resizable';
import PieceContainer from './PieceContainer';
import { LogContext } from '../HandyComponents/LogContext';
import InfoTab from './InfoTab';
import { WebSocketClient } from '../HandyComponents/wsFront';

class Chessboard extends React.PureComponent {
  static contextType = LogContext;

  constructor(){ // tu musi pójść uogólnienie - zmiana wszystkiego tak naprawdę
    super();
    this.state = {
      windowDim: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
      widthAndHeightValue: 0,
    };

    this.ws = null;

    this.state.widthAndHeightValue = this.state.windowDim.width > this.state.windowDim.height ? 0.75*this.state.windowDim.height : 0.75*this.state.windowDim.width;

    this.chessboardRef = React.createRef();
  }

  onResize = (e, {size}) => {
    this.setState({widthAndHeightValue: size.width});
  }
  
  componentDidUpdate() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const ws = new WebSocketClient(`ws://localhost:5500/Game?username=${this.context.logState.userInfo.user}&opponent=${this.context.logState.opponent.user}`, boardSize);
    ws.connect();
    const {widthAndHeightValue} = this.state;

    return (
      <ThemeContext.Consumer> 
        {theme =>
          <Box
            width='100%'
            height='100%'
            display='flex'
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
            backgroundImage={theme.isBright ? brightBackground : darkBackground}
            backgroundSize='100px'
            backgroundColor={theme.isBright ? '#BBBBBB' : '#223322'}
          >
            <Box
              display='flex'
              ref={this.chessboardRef}
              flexDirection='row'
            >
              <Box
                position='relative'
                width={widthAndHeightValue/boardSize}
                height={widthAndHeightValue}
                textAlign='right'
                padding='0 10px 0 10px'
              >
                {Array(boardSize).fill(null).map((_, i) => (
                  <h1 style={{height: `${100/boardSize}%`, top: '50%', color: theme.isBright ? 'black' : 'white'}} key={`vertical-note-${i}`}>{this.context.logState.isUserWhite ? boardSize-i : i+1}</h1>
                ))}
              </Box>
              <Resizable
                onResize={this.onResize}
                height={widthAndHeightValue}
                width={widthAndHeightValue}
                handle={
                  <div style={{display: 'flex'}}>
                    <FontAwesomeIcon icon={faUpRightFromSquare} style={{transform: 'translateY(-100%)', cursor: 'ne-resize', color: (theme.isBright ? 'black' : 'white')}}/>
                  </div>
                }
                minConstraints={[200, 200]}
                maxConstraints={[
                  Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9),
                  Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9)
                ]}
              >
                <div
                  style={{
                    width: widthAndHeightValue,
                    height: widthAndHeightValue,
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  {Array(boardSize).fill(null).map((_, i) => (
                      <Box
                        width='100%'
                        height={`${100/boardSize}%`}
                        key={`${i}th column`}
                      >
                        {Array(boardSize).fill(null).map((_, j) => (
                          <React.Fragment key={`fragment-${j}`}>
                            <Tile
                              id={`square-${i}-${j}`}
                              key={`square-${i}-${j}`}
                              i={i}
                              j={j}
                            >
                              {beginPositions['variant a'][j][i] && 
                                <PieceContainer
                                  key={`piece-${i}-${j}`}
                                  i={i}
                                  j={j}
                                  tileSize={widthAndHeightValue/boardSize}
                                  connection={ws}
                                />
                              }
                            </Tile>
                            {j === boardSize-1 && <h1 key={`horizontal-note-${i}`} style={{color: theme.isBright ? 'black' : 'white'}}>{String.fromCharCode(i + 97)}</h1>}
                          </React.Fragment>
                        ))}
                      </Box>
                    ))}
                </div>
              </Resizable>
            </Box>
            <InfoTab height={widthAndHeightValue}/>
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
}

export const Game = ({...props}) => {
  
  // potem się doda różne wersje gry które bd iść razem z propsami.
  return (
    <>
      <Chessboard/>
    </>
  );
}