import React from 'react';
import { useLogContext } from '../HandyComponents/LogContext';
import { useThemeContext } from '../HandyComponents/themeContext';
import { useGameContext } from './gameContext';

export let timeControl = null;

const InfoTab = ({height, timeFormat}) => {
    const {logState: {userInfo, opponent, isUserWhite}} = useLogContext();
    const {gameEvents, moveHistory} = useGameContext();
    const theme = useThemeContext();
    
    const minutesTime = Number(timeFormat.split(' ')[0]);
    const increment = Number(timeFormat.split(' ')[1]);

    const [userTime, setUserTime] = React.useState(minutesTime * 60 * 1000);
    const [opponentTime, setOpponentTime] = React.useState(minutesTime * 60 * 1000);

    React.useEffect(() => {
        if( isUserWhite === gameEvents.isWhiteToMove ) {
            timeControl = (delay) => setUserTime(prev => prev - delay + increment);
        } else {
            timeControl = (delay) => setOpponentTime(prev => prev - delay + increment);
        }
    }, [setOpponentTime, setUserTime, isUserWhite, gameEvents.isWhiteToMove, increment]);

    React.useEffect(() => {
        let interval = null;

        if(isUserWhite === gameEvents.isWhiteToMove && moveHistory.current.length > 0) {
            interval = setInterval(() => {
                setUserTime(userTime - 1000);
            }, 1000);
        } else if(moveHistory.current.length > 0) {
            interval = setInterval(() => {
                setOpponentTime(opponentTime - 1000);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [opponentTime, gameEvents.isWhiteToMove, isUserWhite, userTime, moveHistory]);

    const container = {
        display: 'flex',
        flexDirection: 'column',
        padding: '0 10px 0 10px',
        margin: '0 1% 0 1%',
        position: 'relative',
        width: '20%',
        maxWidth: '360px',
        minWidth: '200px',
        height: '100%'       // Ensure container takes full height
    };
    
    const tabStyle = {
        display: 'flex',
        position: 'absolute',
        flexDirection: 'column',
        border: `1px ${theme.isBright ? 'solid black' : 'dotted white'}`,
        borderRadius: '10px',
        left: '30px',         // Match container padding
        right: '30px',        // Match container padding
        padding: '10px',      // Add padding inside the tab
        boxSizing: 'border-box' // Ensure padding is included in width/height
    };
    
    const captionContainer = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: `${theme.isBright ? 'black' : 'white'}`,
        width: '100%',        // Ensure it takes full width of the tab
        alignItems: 'center', // Center items vertically
        overflow: 'hidden',   // Hide overflow if necessary
        whiteSpace: 'nowrap', // Prevent text from wrapping
        textOverflow: 'ellipsis' // Show ellipsis if text overflows
    };
    
    const playerStyle = {
        bottom: '0px',
    };
    
    const opponentStyle = {
        top: '0px',
    };
    
    const headingStyle = {
        margin: 0,            // Remove default margins
        padding: 0,           // Remove default padding
        flexShrink: 1,        // Allow text to shrink if necessary
        overflow: 'hidden',   // Hide overflow if necessary
        whiteSpace: 'nowrap', // Prevent text from wrapping
        textOverflow: 'ellipsis', // Show ellipsis if text overflows
    };

    const clock = {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: '10px',
    }

    const number = {
        width: 'calc(25% - 1px)',
    }

    const TimeToComponent = (timeState) => {
        const minutes = Math.floor( timeState / (60 * 1000) );
        const seconds = timeState - minutes * 60 * 1000;
        return ( // tak długość na 4-ish
            <div style={clock}>
                <div style={number}>
                    {Math.floor(minutes / 10)}
                </div>
                <div style={number}>
                    {minutes % 10}
                </div>
                <div style={{...number, width: '4px'}}>
                    :
                </div>
                <div style={number}>
                    {Math.floor(seconds / 10000)}
                </div>
                <div style={number}>
                    {Math.floor(seconds / 1000) % 10} 
                    {/* to będzie za długie */}
                </div>
            </div>
        )
    }

    return <div style={{...container, height: `${height}px`}}>
        <div style={{...tabStyle, ...playerStyle}}>
            <div style={captionContainer}>
                <h2 style={headingStyle}>{opponent.user}</h2>
                <h2 style={headingStyle}>{opponent.rating}</h2>
            </div>
            <div style={clock}>
                {TimeToComponent(userTime)}
            </div>
        </div>
        <div style={{...tabStyle, ...opponentStyle}}>
            <div style={clock}>
                {TimeToComponent(opponentTime)}
            </div>
            <div style={captionContainer}>
                <h2 style={headingStyle}>{userInfo.user}</h2>
                <h2 style={headingStyle}>{userInfo.rating}</h2>
            </div>    
        </div>
    </div>;
}

export default InfoTab;