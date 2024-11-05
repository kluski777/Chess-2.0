import {createContext, useContext, useState} from 'react';

export const LogContext = createContext();

const defaultValues = {
    userInfo: {
        rating: 1200,
        user: 'Anonymous_user'
    }, // username
    logInfo: '', // rest of the info about the user
    option: 'Sign Up', // info about whether to disp sign up or log in
    opponent: '',
    isUserWhite: false,
}

export const LogContextProvider = ({children}) => {
    const [logState, setState] = useState(defaultValues);

    const setLogState = (object) => {
        setState(prevState => ({...prevState, ...object}));
    }

    const setDefault = () => {
        setState(defaultValues);
    }

    const content = {
        logState: logState,
        setLogState: setLogState,
        setDefault: setDefault,
    }

    return (
        <LogContext.Provider value={content}>
            {children}
        </LogContext.Provider>
    );
}

export const useLogContext = () => useContext(LogContext);