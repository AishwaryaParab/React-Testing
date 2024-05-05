import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import HomeRoute from './HomeRoute';

import { createServer } from '../test/server';

createServer([
    {
        path: '/api/repositories',
        method: 'get',
        res: (req, res, ctx) => {
            const language = req.url.searchParams.get('q').split("language:")[1];
            return {
                items: [
                    {id: 1, full_name: `${language}_one`},
                    {id: 2, full_name: `${language}_two`}
                ]
            }
        }
    }
])

test('renders two links for each language', async () => {
    render(
      <MemoryRouter>
        <HomeRoute />
      </MemoryRouter>
    );

    // Loop over each language
    const languages = [
        'javascript',
        'typescript',
        'rust',
        'go',
        'python',
        'java'
    ]

    for(let lng of languages) {
        // For each language, make sure we see two links
        const links = await screen.findAllByRole('link', { name: new RegExp(`${lng}_`) });
        expect(links).toHaveLength(2);

        // Assert that the links have the appropriate full_name
        expect(links[0]).toHaveTextContent(`${lng}_one`);
        expect(links[1]).toHaveTextContent(`${lng}_two`);

        expect(links[0]).toHaveAttribute('href', `/repositories/${lng}_one`);
        expect(links[1]).toHaveAttribute('href', `/repositories/${lng}_two`);
    }
});