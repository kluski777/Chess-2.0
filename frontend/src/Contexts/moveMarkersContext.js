import React from 'react';

const MoveMarkersContext = React.createContext();

export const MoveMarkersContextProvider = ({children}) => {
    const [markerPositions, setMarkerPositions] = React.useState([]); // powinno wystarczyć wsm
    const [updateFunction, setUpdateFunction] = React.useState(undefined);

    const content = { // oryginalny square by się przydał
        markerPositions, 
        setMarkerPositions,
        updateFunction,
        setUpdateFunction,
    }

    return <MoveMarkersContext.Provider value={content}>
        {children}
    </MoveMarkersContext.Provider>
}

export const useMoveMarkersContext = () => React.useContext(MoveMarkersContext);