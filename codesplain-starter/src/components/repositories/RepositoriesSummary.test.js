import RepositoriesSummary from "./RepositoriesSummary";
import { render, screen } from '@testing-library/react';

test('displays the primary language of the repository', () => {
    const repository = {
        language: 'Javascript',
        stargazers_count: 5,
        forks: 30,
        open_issues: 1
    };

    render(<RepositoriesSummary repository={repository} />);

    const language = screen.getByText('Javascript');
    expect(language).toBeInTheDocument();

    for(let key in repository) {
        const element = screen.getByText(new RegExp(repository[key]));
        expect(element).toBeInTheDocument();
    }
});