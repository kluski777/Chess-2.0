import React from 'react';

export const GameContext = React.createContext();

export const gameStates = {}

export const GameContextProvider = ({children}) => {
    const playerPieces = React.useRef({
        allyPieces: [], // refy do figur sojusznika
        enemyPieces: [], // refy do figur przeciwnika
    });

    const moveHistory = React.useRef([]); // {figura: {finalSquares, move}}

    const [gameEvents, setGameEvents] = React.useState({
        isWhiteToMove: true,
        check: false,
        checkmate: false,
        stalemate: false,
        endOfTime: false,
    });

    const [wsConnection, setWsConnection] = React.useState({
        // potem się przyda do zasygnalizowania, słabego połączenia
        ping: 0,
    });

    React.useEffect(() => {
        gameStates.set = setGameEvents;
        gameStates.values = gameEvents;
    }, [gameEvents, setGameEvents])
    
    return <GameContext.Provider value={{playerPieces, gameEvents, setGameEvents, moveHistory, wsConnection, setWsConnection}}>
        {children}
    </GameContext.Provider>
}

export const useGameContext = () => React.useContext(GameContext);