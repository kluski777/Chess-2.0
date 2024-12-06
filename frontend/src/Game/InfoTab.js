import React from 'react';
import { useLogContext } from '../HandyComponents/LogContext';
import { useThemeContext } from '../HandyComponents/themeContext';


const InfoTab = ({height}) => {
    const {logState: {userInfo, opponent}} = useLogContext();
    const theme = useThemeContext();

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

    return <div style={{...container, height: `${height}px`}}>
        <div style={{...tabStyle, ...playerStyle}}>
            <div style={captionContainer}>
                <h2 style={headingStyle}>{opponent.user}</h2>
                <h2 style={headingStyle}>{opponent.rating}</h2>
            </div>
        </div>
        <div style={{...tabStyle, ...opponentStyle}}>
            <div style={captionContainer}>
                <h2 style={headingStyle}>{userInfo.user}</h2>
                <h2 style={headingStyle}>{userInfo.rating}</h2>
            </div>    
        </div>
    </div>;
}

export default InfoTab;