import React, {useState, useEffect, useRef} from 'react';
import './logForm.css';
import {Login} from './LogIn.js';
import {SignUp} from './Signup.js';
import {useThemeContext} from '../HandyComponents/themeContext.js';
import { useLogContext } from '../HandyComponents/LogContext.js'

const notFoundUserPrefix  = 'What'
const notFoundEmailPrefix = 'Your'

const formStyle = {
    margin: '0px',
    width: '50%',
    transform: 'translateX(100px)',
}

export const LoggingContainer = () => {
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [created, setCreated] = useState(false);

    const logHeight = useRef(0);
    const formRef = useRef(null);
    const signUpRef = useRef(null);

    // change of the LogConext causes rerender but why?
    const LogContext = useLogContext();
    const theme = useThemeContext();

    useEffect(() => {
        logHeight.current = formRef.current?.clientHeight;
    }, [LogContext.logState.option]);

    useEffect(() => {
        if(created) {
            setTimeout(() => {
                LogContext.setLogState({option: 'Log In'});
                setCreated(false);
            }, 2000);
        } else if(LogContext.logState.logInfo?.startsWith(notFoundUserPrefix) || LogContext.logState.logInfo?.startsWith(notFoundEmailPrefix)) {
            setTimeout(() => {
                LogContext.setLogState({logInfo: ''})
            }, 2000)
        } else if(LogContext.logState.logInfo === 'User found') {
            // animacja, logowania byłaby w pytke
            setTimeout(() => {
                window.location.href = '/'; // userInfo user goes on the wall, can play games
            }, 500);
        }
    }, [LogContext.logState.logInfo, created]);

    return (
        <div className="login-container" style={{height: window.innerHeight, backgroundColor: theme.isBright ? 'rgb(160, 170, 160)' : '#0a0e27'}}>
            {LogContext.logState.logInfo?.startsWith(notFoundUserPrefix) || LogContext.logState.logInfo?.startsWith(notFoundEmailPrefix) && 
                <div
                    className="existing-user-info"
                    style={{height: `${signUpRef.current?.clientHeight}px`, top: `${signUpRef.current?.getClientRects()[0].top}px`}}
                >
                    <h3> {LogContext.logState.logInfo} </h3>
                </div>
            }
            <div className="response-box">
                <button
                    style={{backgroundColor: theme.isBright ? 'rgb(0, 115, 175)' : 'rgb(0, 55, 115)', color: theme.isBright ? 'black' : 'wheat', opacity: LogContext.logState.option === 'Log In' ? '1' : '0.5'}}
                    onClick={() => LogContext.setLogState({option: 'Log In'})}
                >
                    Log in
                </button>
                <button
                    ref={signUpRef}
                    style={{backgroundColor: theme.isBright ? 'rgb(209, 165, 10)' : 'rgb(150, 110, 0)', color: 'black', opacity: LogContext.logState.option === 'Sign Up' ? '1' : '0.5'}}
                    onClick={() => LogContext.setLogState({option: 'Sign Up'})}
                >
                    Sign up
                </button>
            </div>
            { created === true ?
                <div
                    style={{height: `${logHeight.current}px`}}
                    className="form-class sign-up-success animate-class"
                > User created successfully </div>
                :
                <div style={formStyle} ref={formRef}>
                    {LogContext.logState.option === 'Sign Up' ?
                        <SignUp
                            theme={theme}
                            setLogState={LogContext.setLogState}
                            setCreated={setCreated}
                            user={{value: user, set: setUser}}
                            email={{value: email, set: setEmail}}
                            password={{value: password, set: setPassword}}
                            confirmation={{value: confirmPassword, set: setConfirmPassword}}
                        />
                        :
                        <Login
                            theme={theme}
                            setLogState={LogContext.setLogState}
                            user={{value: user, set: setUser}}
                            password={{value: password, set: setPassword}}
                        />
                    }
                </div>
            }
        </div>
    );
}