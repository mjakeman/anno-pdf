import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest'
import DashboardTable from './components/app/dashboard/DashboardTable';
import '@testing-library/jest-dom'
import About from './components/public/pages/About';
import Login from './components/public/pages/Login';
import { BrowserRouter } from 'react-router-dom';

describe('App', () => {
    it('Jest equivalent test', () => {
        console.log("Test");
        expect(true).toBe(true);
    });

    it('Login page renders', () => {
        render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
        );
        expect(screen.getByText('Email:')).toBeInTheDocument();
        expect(screen.getByText('Password:')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Login'));

    });

    it('Dark mode toggle test', () =>{
        render(<App />);
        expect(screen.getByText('Toggle Dark Mode: LIGHT')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Toggle Dark Mode: LIGHT'));
        expect(screen.getByText('Toggle Dark Mode: DARK')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Toggle Dark Mode: DARK'));
        expect(screen.getByText('Toggle Dark Mode: LIGHT')).toBeInTheDocument();
    })

});


