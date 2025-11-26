import { test, expect } from 'vitest';
import { getDemoData, renderWithProviders } from '~/test/testUtils';
import { ArtistCard } from '~/features/artist/ArtistCard';
import { Config } from '~/util/Config';
import { fireEvent } from '@testing-library/react';

const demoData = getDemoData();

/**
 * Verifies the ArtistCard renders the artist card with the expected information
 */
test('Artist info is rendered properly in Artist Card', async () => {
    const artist = demoData.artists[Config.TIME_FRAME_INDEX][0];
    let clickResponse = null;
    const screen = renderWithProviders(
        <ArtistCard
            artist={artist}
            onClick={(data) => {
                clickResponse = data;
            }}
        />
    );
    const label = await screen.findByText(artist.name);
    expect(label).toBeInTheDocument();

    fireEvent.click(label);
    expect(clickResponse).toBeTruthy();
    expect(clickResponse!.images).toBeTruthy();
    expect(clickResponse!.name).toBeTruthy();
    expect(clickResponse!.id).toBeTruthy();
    expect(clickResponse!.type).toBeTruthy();

    const genres = await screen.findByText(artist.genres.join(', '));
    expect(genres).toBeInTheDocument();
});
