import React from 'react'

export const possibleMovesContext = React.createContext();

export const PossibleMovesProvider = ({children}) => {
  const [list, setList] = React.useState(undefined);
  const [executeMoveFunction, setExecuteMoveFunction] = React.useState(() => () => {});
  const [pieceID, setPieceID] = React.useState(undefined);
  const content = {list, setList, executeMoveFunction, setExecuteMoveFunction, pieceID, setPieceID};

  return <possibleMovesContext.Provider value={content}>
      {children}
    </possibleMovesContext.Provider>
}

export const usePossibleMovesContext = () => React.useContext(possibleMovesContext);