import {screen, fireEvent, render} from '@testing-library/react';
import { expect } from 'vitest';
import { vi } from 'vitest';

import Header from './Header';

//render check
test('render check', () => {
    render(<Header dayName="Pull Day"/>);
    
    const headerElement = screen.getByText(/pull day plan/i);
    expect(headerElement).toBeInTheDocument();
});

//correct id
test('check for id', () => {
    render(<Header dayName="Pull Day"/>);
    
    const h2Element = screen.getByText(/pull day plan/i);
    expect(h2Element.parentElement).toHaveAttribute('id','heading');
})
