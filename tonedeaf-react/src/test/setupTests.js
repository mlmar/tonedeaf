import '@testing-library/jest-dom';
import './mocks.js';
import { beforeEach, vi } from 'vitest';
import { useTonedeafStore } from '~/hooks/useTonedeafStore.js';

// Ensure a clean store and mocked state before each test
const defaultState = { ...useTonedeafStore.getState() };
beforeEach(() => {
    vi.resetAllMocks();
    useTonedeafStore.setState(defaultState, true);
});
