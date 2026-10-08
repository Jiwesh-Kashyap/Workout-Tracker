import {screen, fireEvent, render} from '@testing-library/react';
import Button from './Button';
import { expect } from 'vitest';

import { vi } from 'vitest';

test('renders the button with text', () => {
    render(<Button name="Click Me"/>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
})

test('applies the correct CSS class', () => {
    render(<Button name="Styled Button" />);
    const buttonElement = screen.getByText(/Styled Button/i);
    
    expect(buttonElement).toHaveClass('input-button');
});

test('handles click events correctly', () => {
    const handleClick = vi.fn();
    render(<Button name="Clickable" onClick={handleClick} />);
    
    const buttonElement = screen.getByText(/Clickable/i);
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
});