import '@testing-library/jest-dom';
import './mocks.js';
import { beforeEach, vi } from 'vitest';

// Ensure a clean store and mocked state before each test
beforeEach(() => {
    vi.resetAllMocks();
});
