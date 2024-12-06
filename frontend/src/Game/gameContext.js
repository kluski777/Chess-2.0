import React from 'react';

export const GameContext = React.createContext();

export const GameContextProvider = ({children}) => {
    const playerPieces = React.useRef({
        allyPieces: [], // refy do figur sojusznika
        enemyPieces: [], // refy do figur przeciwnika
    });

    const moveHistory = React.useRef([]); // {figura: {finalSquares, move}}
    // regular variable - pretty keep in mind

    const [gameEvents, setGameEvents] = React.useState({
        check: false,
        checkmate: false,
        stalemate: false,
    });

    const [wsConnection, setWsConnection] = React.useState({
        ping: 0,
    })
    
    return <GameContext.Provider value={{playerPieces, gameEvents, setGameEvents, moveHistory, wsConnection, setWsConnection}}>
        {children}
    </GameContext.Provider>
}

export const useGameContext = () => React.useContext(GameContext);