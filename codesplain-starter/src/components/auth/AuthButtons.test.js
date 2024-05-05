import { screen, render } from '@testing-library/react';
import { MemoryRouter  } from 'react-router-dom';
import AuthButtons from './AuthButtons';
import { createServer } from '../../test/server';
import { SWRConfig } from 'swr';

async function renderComponent() {
    render(
        <SWRConfig value={{ provider: () => new Map()}}>
            <MemoryRouter>
                <AuthButtons />
            </MemoryRouter>
        </SWRConfig>
    )

    // to remove the act warning
    await screen.findAllByRole('link');
}

describe('when user is not signed in', () => {
    createServer([
        {
            path: '/api/user',
            res: () => {
                return { user: null }
            }
        }
    ])
    
    test('sign in and sign up buttons are visible', async () => {
        await renderComponent();

        const signInButton = screen.getByRole('link', {name: /sign in/i});
        const signUpButton = screen.getByRole('link', {name: /sign up/i});

        expect(signInButton).toBeInTheDocument();
        expect(signInButton).toHaveAttribute('href', '/signin');

        expect(signUpButton).toBeInTheDocument();
        expect(signUpButton).toHaveAttribute('href', '/signup');
    });
    
    test('sign out button is not visible', async () => {
        await renderComponent();

        const signOutButton = screen.queryByRole('link', {name: /sign out/i});
        expect(signOutButton).not.toBeInTheDocument();
    });
});

describe('when user is signed in', () => {
    createServer([
        {
            path: '/api/user',
            res: () => {
                return { user: {id: 1, email: 'aish@gmail.com'} }
            }
        }
    ])
    
    test('sign in and sign up buttons are not visible', async () => {
        await renderComponent();

        const signInButton = screen.queryByRole('link', {name: /sign in/i});
        const signUpButton = screen.queryByRole('link', {name: /sign up/i});

        expect(signInButton).not.toBeInTheDocument();
        expect(signUpButton).not.toBeInTheDocument();
    });
    
    test('sign out button is visible', async () => {
        await renderComponent();

        const signOutButton = screen.getByRole('link', {name: /sign out/i});

        expect(signOutButton).toBeInTheDocument();
        expect(signOutButton).toHaveAttribute('href', '/signout');
    });
});