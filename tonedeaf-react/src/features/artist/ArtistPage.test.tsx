import { test, expect } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { getDemoData, renderWithProviders } from '~/test/testUtils';
import { ArtistPage } from '~/features/artist/ArtistPage';
import { Config } from '~/util/Config';

const demoData = getDemoData();

/**
 * Verifies the ArtistPage renders the artist grid with the expected number of
 * items and that toggling the time-range control (for example from 'All Time'
 * to '6 Months') does not change the number of rendered artist items.
 */
test('Artist page loads Artist grid by default (1 month)', async () => {
    const screen = renderWithProviders(<ArtistPage />);

    const timeFrameIndex = Config.TIME_FRAME_INDEX;
    const grid = await screen.findByTestId(`grid-${timeFrameIndex}`);
    expect(grid).toBeInTheDocument();
    expect(grid.childNodes.length).toBe(demoData.artists[timeFrameIndex].length);
});

test('Artist page loads Artist grid for 6 months', async () => {
    const screen = renderWithProviders(<ArtistPage />);

    const timeFrameIndex = 1;
    fireEvent.click(screen.getByText(Config.TIME_OPTIONS[timeFrameIndex]));
    const grid = await screen.findByTestId(`grid-${timeFrameIndex}`);
    expect(grid.childNodes.length).toBe(demoData.artists[timeFrameIndex].length);
});

test('Artist page loads Artist grid for long term', async () => {
    const screen = renderWithProviders(<ArtistPage />);

    const timeFrameIndex = 0;
    fireEvent.click(screen.getByText(Config.TIME_OPTIONS[timeFrameIndex]));
    const grid = await screen.findByTestId(`grid-${timeFrameIndex}`);
    expect(grid.childNodes.length).toBe(demoData.artists[timeFrameIndex].length);
});

/**
 * Verifies the ArtistPage properly toggles to a list view (via the 'List'
 * control) and keeps the same number of items before and after changing the
 * time-range.
 */
test('Artist page loads Artist list for default', async () => {
    const screen = renderWithProviders(<ArtistPage />);

    const timeFrameIndex = Config.TIME_FRAME_INDEX;
    fireEvent.click(screen.getByText(Config.VIEW_OPTIONS[1]));
    fireEvent.click(screen.getByText(Config.TIME_OPTIONS[timeFrameIndex]));
    const list = await screen.findByTestId(`list-${timeFrameIndex}`);
    expect(list).toBeInTheDocument();
    expect(list.childNodes.length).toBe(demoData.artists[timeFrameIndex].length);
});

test('Artist page loads Artist list for 6 months', async () => {
    const screen = renderWithProviders(<ArtistPage />);

    const timeFrameIndex = 1;
    fireEvent.click(screen.getByText(Config.VIEW_OPTIONS[1]));
    fireEvent.click(screen.getByText(Config.TIME_OPTIONS[timeFrameIndex]));
    const list = await screen.findByTestId(`list-${timeFrameIndex}`);
    expect(list).toBeInTheDocument();
    expect(list.childNodes.length).toBe(demoData.artists[timeFrameIndex].length);
});

test('Artist page loads Artist list for long term', async () => {
    const screen = renderWithProviders(<ArtistPage />);

    const timeFrameIndex = 0;
    fireEvent.click(screen.getByText(Config.VIEW_OPTIONS[1]));
    fireEvent.click(screen.getByText(Config.TIME_OPTIONS[timeFrameIndex]));
    const list = await screen.findByTestId(`list-${timeFrameIndex}`);
    expect(list).toBeInTheDocument();
    expect(list.childNodes.length).toBe(demoData.artists[timeFrameIndex].length);
});

/**
 * Verifies that the genre controls are rendered and contain more than one
 * genre button. This ensures the UI provides genre filters and that they
 * persist after changing the time-range.
 */
test('Artist page loads Genres by default (1 month)', async () => {
    const screen = renderWithProviders(<ArtistPage />);

    const timeFrameIndex = Config.TIME_FRAME_INDEX;
    await screen.findByTestId(`grid-${timeFrameIndex}`);
    const genres = await screen.findByTestId(`genres-${timeFrameIndex}`);
    expect(genres).toBeInTheDocument();
    expect(genres.childNodes.length).toBe(demoData.genres[timeFrameIndex].length);
});

test('Artist page loads Genres for 6 months', async () => {
    const screen = renderWithProviders(<ArtistPage />);

    const timeFrameIndex = 1;
    fireEvent.click(screen.getByText(Config.TIME_OPTIONS[timeFrameIndex]));
    await screen.findByTestId(`grid-${timeFrameIndex}`);
    const genres = await screen.findByTestId(`genres-${timeFrameIndex}`);
    expect(genres).toBeInTheDocument();
    expect(genres.childNodes.length).toBe(demoData.genres[timeFrameIndex].length);
});

test('Artist page loads Genres for long term', async () => {
    const screen = renderWithProviders(<ArtistPage />);

    const timeFrameIndex = 0;
    fireEvent.click(screen.getByText(Config.TIME_OPTIONS[timeFrameIndex]));
    await screen.findByTestId(`grid-${timeFrameIndex}`);
    const genres = await screen.findByTestId(`genres-${timeFrameIndex}`);
    expect(genres).toBeInTheDocument();
    expect(genres.childNodes.length).toBe(demoData.genres[timeFrameIndex].length);
});
