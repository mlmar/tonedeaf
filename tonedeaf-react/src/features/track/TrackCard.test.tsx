import { test, expect } from 'vitest';
import { getDemoData, renderWithProviders } from '~/test/testUtils';
import { TrackCard } from '~/features/track/TrackCard';
import { Config } from '~/util/Config';
import { fireEvent } from '@testing-library/react';

const demoData = getDemoData();

/**
 * Verifies the TrackCard renders the artist card with the expected information
 */
test('Track info is rendered properly in Artist Card', async () => {
    const track = demoData.tracks[Config.TIME_FRAME_INDEX][0];
    const features = demoData.features[Config.TIME_FRAME_INDEX][0];
    let clickResponse = null;
    const screen = renderWithProviders(
        <TrackCard
            track={track}
            features={features}
            onClick={(data) => {
                clickResponse = data;
            }}
        />
    );
    const label = await screen.findByText(track.name);
    expect(label).toBeInTheDocument();

    fireEvent.click(label);
    expect(clickResponse).toBeTruthy();
    expect(clickResponse!.name).toBeTruthy();
    expect(clickResponse!.album).toBeTruthy();
});

/**
 * Verifies the TrackCard renders the artist card with the expected attributes
 */
test('Track features info is rendered properly in Artist Card', async () => {
    const track = demoData.tracks[Config.TIME_FRAME_INDEX][0];
    const features = demoData.features[Config.TIME_FRAME_INDEX][0];
    const screen = renderWithProviders(<TrackCard track={track} features={features} />);
    const showAttributes = await screen.findByText('Show Attributes');
    expect(showAttributes).toBeInTheDocument();
    fireEvent.click(showAttributes);

    for (const index in TrackCard.FEATURES_LIST) {
        const [key] = TrackCard.FEATURES_LIST[index];
        const attributeElement = await screen.findByTestId(key);
        expect(attributeElement).toBeInTheDocument();
    }
});
