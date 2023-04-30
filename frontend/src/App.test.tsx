import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest'
import DashboardTable from './components/app/dashboard/DashboardTable';
import '@testing-library/jest-dom'
import About from './components/public/pages/About';

describe('App', () => {
    it('Jest equivalent test', () => {
        console.log("Test");
        expect(true).toBe(true);
    });

    it('About page renders', () => {
        render(<About />);
        expect(screen.getByText('About Us')).toBeInTheDocument();
        // Checks CSS rules dont hide the element
        expect(screen.getByText('About Us')).toBeVisible();
    });

});


