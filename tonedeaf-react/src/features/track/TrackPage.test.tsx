import { test, expect } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { getDemoData, renderWithProviders } from '~/test/testUtils';
import { TrackPage } from '~/features/track/TrackPage';
import { Config } from '~/util/Config';

const demoData = getDemoData();

/**
 * Verifies the TrackPage renders the Track grid with the expected number of
 * items and that toggling the time-range control (for example from 'All Time'
 * to '6 Months') does not change the number of rendered Track items.
 */
test('Track page loads Track grid by default (1 month)', async () => {
    const screen = renderWithProviders(<TrackPage />);

    const timeFrameIndex = Config.TIME_FRAME_INDEX;
    const grid = await screen.findByTestId(`grid-${timeFrameIndex}`);
    expect(grid).toBeInTheDocument();
    expect(grid.childNodes.length).toBe(demoData.tracks[timeFrameIndex].length);
});

test('Track page loads Track grid for 6 months', async () => {
    const screen = renderWithProviders(<TrackPage />);

    const timeFrameIndex = 1;
    fireEvent.click(screen.getByText(Config.TIME_OPTIONS[timeFrameIndex]));
    const grid = await screen.findByTestId(`grid-${timeFrameIndex}`);
    expect(grid.childNodes.length).toBe(demoData.tracks[timeFrameIndex].length);
});

test('Track page loads Track grid for long term', async () => {
    const screen = renderWithProviders(<TrackPage />);

    const timeFrameIndex = 0;
    fireEvent.click(screen.getByText(Config.TIME_OPTIONS[timeFrameIndex]));
    const grid = await screen.findByTestId(`grid-${timeFrameIndex}`);
    expect(grid.childNodes.length).toBe(demoData.tracks[timeFrameIndex].length);
});

/**
 * Verifies the TrackPage properly toggles to a list view (via the 'List'
 * control) and keeps the same number of items before and after changing the
 * time-range.
 */
test('Track page loads Track list for default', async () => {
    const screen = renderWithProviders(<TrackPage />);

    const timeFrameIndex = Config.TIME_FRAME_INDEX;
    fireEvent.click(screen.getByText(Config.VIEW_OPTIONS[1]));
    fireEvent.click(screen.getByText(Config.TIME_OPTIONS[timeFrameIndex]));
    const list = await screen.findByTestId(`list-${timeFrameIndex}`);
    expect(list).toBeInTheDocument();
    expect(list.childNodes.length).toBe(demoData.tracks[timeFrameIndex].length);
});

test('Track page loads Track list for 6 months', async () => {
    const screen = renderWithProviders(<TrackPage />);

    const timeFrameIndex = 1;
    fireEvent.click(screen.getByText(Config.VIEW_OPTIONS[1]));
    fireEvent.click(screen.getByText(Config.TIME_OPTIONS[timeFrameIndex]));
    const list = await screen.findByTestId(`list-${timeFrameIndex}`);
    expect(list).toBeInTheDocument();
    expect(list.childNodes.length).toBe(demoData.tracks[timeFrameIndex].length);
});

test('Track page loads Track list for long term', async () => {
    const screen = renderWithProviders(<TrackPage />);

    const timeFrameIndex = 0;
    fireEvent.click(screen.getByText(Config.VIEW_OPTIONS[1]));
    fireEvent.click(screen.getByText(Config.TIME_OPTIONS[timeFrameIndex]));
    const list = await screen.findByTestId(`list-${timeFrameIndex}`);
    expect(list).toBeInTheDocument();
    expect(list.childNodes.length).toBe(demoData.tracks[timeFrameIndex].length);
});
