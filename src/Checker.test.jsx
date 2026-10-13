import { vi, expect, test } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";
import Checker from "./Checker";

import { ResetContext } from "./ResetContext";

function renderWithContext(ui, contextValue){
    return render(
        <ResetContext.Provider value={contextValue}>
            {ui}
        </ResetContext.Provider>
    );
}

test('render checkboxes using context', () => {
    const handleComplete = vi.fn();
    const contextValue = {globalReset: false, setGlobalReset: vi.fn()}

    renderWithContext(<Checker sets={3} onComplete={handleComplete}/>, contextValue);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    //should not call handleComplete function until we check every checkbox
    expect(handleComplete).not.toHaveBeenCalled();

    fireEvent.click(checkboxes[2]);
    expect(handleComplete).toHaveBeenCalledTimes(1);
})