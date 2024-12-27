import React from 'react';
import { useMoveMarkersContext } from '../Contexts/moveMarkersContext';

export const Dot = ({i, j}) => {
    const [hovered, setHovered] = React.useState(false);
    const { updateFunction } = useMoveMarkersContext();

    const dotContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      
        transform: 'translateY(-100%)',
        position: 'absolute',
        cursor: 'pointer',
        height: '100%',
        width: '100%',
        zIndex: '3',
        backgroundColor: hovered ? 'rgba(172, 255, 72, 0.4)' : '',
        transition: 'padding 0.3s ease, background-color 0.3s ease-out',
    }

    const dotStyle = {
        width: hovered ? '50%' : '20%',
        height: hovered ? '50%' : '20%',
        backgroundColor: hovered ? 'greenyellow' : 'orange',
        borderRadius: '100%',
        transition: 'width 0.1s, height 0.1s',
    }
    
    return <div
            style={dotContainerStyle}
            onClick={() => updateFunction(i, j) }
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}
        >
            <div style={dotStyle}/>
        </div>
}