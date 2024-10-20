import {createContext, useContext, useState, useMemo} from 'react';

export const LogContext = createContext();

export const LogContextProvider = ({children}) => {
    const [logState, setState] = useState({
        userInfo: {}, // username
        logInfo: '', // rest of the info about the user
        option: 'Sign Up', // info about whether to disp sign up or log in
    })

    const setLogState = (object) => {
        setState(prevState => ({...prevState, ...object}))
    }

    const content = {
        logState: logState,
        setLogState: setLogState
    } // tf does the useMemo change tf

    return (
        <LogContext.Provider value={content}>
            {children}
        </LogContext.Provider>
    )
}

export const useLogContext = () => useContext(LogContext)