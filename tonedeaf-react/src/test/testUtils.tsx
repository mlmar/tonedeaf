import React from 'react';
import { render, type RenderResult } from '@testing-library/react';
import { TonedeafQueryClientProvider } from '~/contexts/TonedeafQueryClientProvider';
import demoData from '../../../tonedeaf-express/demo/DemoData.json';

/**
 * Simple render wrapper for components under test.
 * Wraps components with React Query provider so components using React Query
 * work in tests without bootstrapping the whole app.
 */
export function renderWithProviders(ui: React.ReactElement): RenderResult {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <TonedeafQueryClientProvider>{children}</TonedeafQueryClientProvider>
    );
    return render(ui, { wrapper: Wrapper });
}

export function getDemoData() {
    return demoData;
}
