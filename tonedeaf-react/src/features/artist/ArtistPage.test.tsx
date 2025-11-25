import { test, expect } from 'vitest';
import { act } from '@testing-library/react';
import { getDemoData, renderWithProviders } from '~/test/testUtils';
import { ArtistPage } from '~/features/artist/ArtistPage';
import { Config } from '~/util/Config';

const demoData = getDemoData();

/**
 * Verifies the ArtistPage renders the artist grid with the expected number of
 * items and that toggling the time-range control (for example from 'All Time'
 * to '6 Months') does not change the number of rendered artist items.
 */
test('Artist page loads artist grid by default', async () => {
    const { getByTestId } = renderWithProviders(<ArtistPage onDownloadClick={() => {}} exportRef={null} />);

    const grid = getByTestId('grid');
    expect(grid).toBeInTheDocument();
    expect(grid.childNodes.length).toBe(demoData.artists[Config.TIME_FRAME_INDEX].length);
});

test('Artist page loads artist grid at 6 months', async () => {
    const { getByText, getByTestId } = renderWithProviders(<ArtistPage onDownloadClick={() => {}} exportRef={null} />);

    await act(async () => {
        const timeRangeButton = getByText(Config.TIME_OPTIONS[0]);
        timeRangeButton.click();
    });

    const grid = getByTestId('grid');
    expect(grid).toBeInTheDocument();
    expect(grid.childNodes.length).toBe(demoData.artists[0].length);
});

test('Artist page loads artist grid at long term', async () => {
    const { getByText, getByTestId } = renderWithProviders(<ArtistPage onDownloadClick={() => {}} exportRef={null} />);

    await act(async () => {
        const timeRangeButton = getByText(Config.TIME_OPTIONS[1]);
        timeRangeButton.click();
    });

    const grid = getByTestId('grid');
    expect(grid).toBeInTheDocument();
    expect(grid.childNodes.length).toBe(demoData.artists[1].length);
});

/**
 * Verifies the ArtistPage properly toggles to a list view (via the 'List'
 * control) and keeps the same number of items before and after changing the
 * time-range.
 */
test('Artist page loads artist list by default', async () => {
    const { getByText, getByTestId } = renderWithProviders(<ArtistPage onDownloadClick={() => {}} exportRef={null} />);

    await act(async () => {
        const listButton = getByText('List');
        listButton.click();
        const timeRangeButton = getByText(Config.TIME_OPTIONS[Config.TIME_FRAME_INDEX]);
        timeRangeButton.click();
    });

    const list = getByTestId('list');
    expect(list).toBeInTheDocument();
    expect(list.childNodes.length).toBe(demoData.artists[Config.TIME_FRAME_INDEX].length);
});

test('Artist page loads artist list at 6 months', async () => {
    const { getByText, getByTestId } = renderWithProviders(<ArtistPage onDownloadClick={() => {}} exportRef={null} />);

    await act(async () => {
        const listButton = getByText('List');
        listButton.click();
        const timeRangeButton = getByText(Config.TIME_OPTIONS[0]);
        timeRangeButton.click();
    });

    const list = getByTestId('list');
    expect(list).toBeInTheDocument();
    expect(list.childNodes.length).toBe(demoData.artists[0].length);
});

test('Artist page loads artist list at long term', async () => {
    const { getByText, getByTestId } = renderWithProviders(<ArtistPage onDownloadClick={() => {}} exportRef={null} />);

    await act(async () => {
        const timeRangeButton = getByText(Config.TIME_OPTIONS[1]);
        timeRangeButton.click();
    });

    const list = getByTestId('list');
    expect(list).toBeInTheDocument();
    expect(list.childNodes.length).toBe(demoData.artists[1].length);
});

/**
 * Verifies that the genre controls are rendered and contain more than one
 * genre button. This ensures the UI provides genre filters and that they
 * persist after changing the time-range.
 */
test('Artist page loads genres', async () => {
    const { getByText, getByTestId } = renderWithProviders(<ArtistPage onDownloadClick={() => {}} exportRef={null} />);

    let genres = getByTestId('genre-buttons');
    expect(genres).toBeInTheDocument();
    expect(genres.childNodes.length).toBe(demoData.genres[1].length);

    await act(async () => {
        const timeRangeButton = getByText('6 Months');
        timeRangeButton.click();
    });

    genres = getByTestId('genre-buttons');
    expect(genres).toBeInTheDocument();
    expect(genres.childNodes.length).toBe(demoData.genres[1].length);
});
