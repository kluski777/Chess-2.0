import React from 'react';
import {render, waitFor, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import { LoggingContainer } from '../Login/LoggingContainer';
import { ThemeContextProvider } from '../HandyComponents/themeContext';

const generateRandomString = (length) => 
    Math.random().toString(36).substring(2, 2 + Math.floor(Math.random() * length));

const testUser = {
    user: generateRandomString(20),
    email: `${generateRandomString(15)}@example.com`,
    password: generateRandomString(20)
};

const renderComponent = () => 
    render(
        <ThemeContextProvider>
            <LoggingContainer/>
        </ThemeContextProvider>
    );

const fillSignUpForm = async () => {
    await userEvent.type(screen.getByPlaceholderText('Username'), testUser.user);
    await userEvent.type(screen.getByPlaceholderText('Email'), testUser.email);
    await userEvent.type(screen.getByPlaceholderText('Password'), testUser.password);
    await userEvent.type(screen.getByPlaceholderText('Password confirmation'), testUser.password);
};

const submitForm = () => userEvent.click(screen.getByText('Submit'));
const changeToSignUpMethod = async () => userEvent.click(screen.getByText('Sign up'));

describe('Checking front-end backend connection', () => {
    test('Backend is called from sign-up', async () => {
        renderComponent();
        
        await changeToSignUpMethod();
        await fillSignUpForm();
        await submitForm();

        // Check if fetch was called
        expect(fetch).toHaveBeenCalledWith('http://localhost:5500/set-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: testUser.user,
                email: testUser.email,
                password: testUser.password,
            }),
        });
    });

    test('Checking both submit and server response', async () => {
        renderComponent();
        
        await changeToSignUpMethod(); // testing for sign-up
        await fillSignUpForm();
        await submitForm();

        waitFor(() => expect(screen.getByText('User created successfully')).toBeInTheDocument)
    })
});