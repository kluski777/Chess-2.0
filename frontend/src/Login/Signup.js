import React, {useState} from 'react'
import './logForm.css'

export const SignUp = ({theme, setLogState, setCreated, user, email, password, confirmation}) => {
    const userValidation = () => Boolean(user.value)
    const emailValidation = () => email.value?.includes('@') ?? false
    const passValidation = () => Boolean(password.value)
    const confirmValidation = () => Boolean(confirmation.value) && confirmation.value === password.value
    
    const [submitAnimate, setSubmitAnimate] = useState(0);
    const [userAnimation, setUserAnimation] = useState(true);
    const [emailAnimation, setEmailAnimation] = useState(true);
    const [passwordAnimation, setPasswordAnimation] = useState(true);
    const [confirmationAnimation, setConfirmationAnimation] = useState(true);
    
    React.useEffect(() => {
        setUserAnimation( userValidation() )
        setEmailAnimation( emailValidation() )
        setPasswordAnimation( passValidation() )
        setConfirmationAnimation( confirmValidation() )
    }, [])

    const submit = async (event) => {
        event.preventDefault();
        
        try {
            if (email.value.includes('@') && password.value === confirmation.value && !user.value.includes('@')) { // email validation
                const response = await fetch(`http://localhost:5500/set-user`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user: user.value,
                        email: email.value,
                        password: password.value
                    })
                });
    
                // Check if the response is okay
                if (!response.ok) {
                    console.log(`Server responded with status: ${response.status}`);
                    // Optionally, handle specific status codes like 400 here
                    return ;
                }

                const data = await response.json();

                if(data?.message === 'User created successfully')
                    setCreated(true);
                else
                    setLogState({logInfo: data?.message});
            } else {
                console.log("Invalid email or passwords do not match.");
            }
        } catch (error) {
            console.log(`The following error was caught in the submit function: ${error}`);
        }
    };
    // if submit was successful then login context is changed and user goes to the 
    // original site

    return (
        <form 
            style={{backgroundColor: theme.isBright ? 'rgb(209, 165, 10)' : 'rgb(150, 110, 0)'}}
            className='form-class'
            onSubmit={(event) => submit(event)}
        >
            <br/>
            <div className={`gradient ${!userAnimation ? 'gradient-animation-infinite' : 'gradient-animation-finite'}`}>
                <input
                    type="text"
                    id="sign-up-name"
                    name="sign-up-name"
                    className={theme.isBright ? 'sign-up-bright-theme' : 'sign-up-dark-theme'}
                    placeholder='Username'
                    value={user.value}
                    onClick={() => setUserAnimation(false)}
                    onBlur={() => setUserAnimation( userValidation() )}
                    onChange={(event) => user.set(event.target.value)}
                />
            </div>
            <br/>
            <div className={`gradient ${!emailAnimation ? 'gradient-animation-infinite' : 'gradient-animation-finite'}`}>
                <input
                    type="text"
                    id="sign-up-email"
                    name="sign-up-email"
                    className={theme.isBright ? 'sign-up-bright-theme' : 'sign-up-dark-theme'}
                    placeholder='Email'
                    value={email.value}
                    onClick={() => setEmailAnimation(false)}
                    onBlur={() => setEmailAnimation( emailValidation() )}
                    onChange={(event) => email.set(event.target.value)}
                />
            </div>
            <br/>
            <div className={`gradient ${!passwordAnimation ? 'gradient-animation-infinite' : 'gradient-animation-finite'}`}>
                <input
                    type="password"
                    id="sign-up-password"
                    className={theme.isBright ? 'sign-up-bright-theme' : 'sign-up-dark-theme'}
                    placeholder='Password'
                    value={password.value}
                    onClick={() => setPasswordAnimation(false)}
                    onBlur={() => setPasswordAnimation( passValidation() )}
                    onChange={(event) => password.set(event.target.value)}
                />
            </div>
            <br/>
            <div className={`gradient ${!confirmationAnimation ? 'gradient-animation-infinite' : 'gradient-animation-finite'}`}>
                <input
                    type="password"
                    id="confirmation"
                    placeholder='Password confirmation'
                    className={theme.isBright ? 'sign-up-bright-theme' : 'sign-up-dark-theme'}
                    value={confirmation.value}
                    onClick={() => setConfirmationAnimation(false)}
                    onBlur={() => setConfirmationAnimation( confirmValidation() )}
                    onChange={(event) => confirmation.set(event.target.value) }
                />
            </div>
            <br/>
            <button
                onMouseEnter={() => setTimeout(setSubmitAnimate(prevValue => prevValue + 1), 200)}
                onMouseLeave={() => setSubmitAnimate(prevValue => prevValue + 1)}
                className={submitAnimate > 0 ? (submitAnimate%2 === 1 ? 'getBiggerAnimation' : 'getSmallerAnimation'): ''}
            > Submit </button> <br/>
        </form>
    );
}