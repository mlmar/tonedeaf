import { useState, type ReactNode } from 'react';
import { SessionUnavailableError } from '~/service/AuthService';

type SpotifyReadRetryProps = {
    error: unknown;
    isFetching: boolean;
    onRetry: (options: { cancelRefetch: boolean }) => Promise<unknown>;
    fallback?: ReactNode;
};

// Keep the retry action visible while a query clears its previous error during a fetch.
export function SpotifyReadRetry({ error, isFetching, onRetry, fallback }: SpotifyReadRetryProps) {
    const [isRetrying, setIsRetrying] = useState(false);

    if (!isRetrying && !(error instanceof SessionUnavailableError)) {
        return fallback;
    }

    async function retry() {
        setIsRetrying(true);

        try {
            await onRetry({ cancelRefetch: false });
        } finally {
            setIsRetrying(false);
        }
    }

    return (
        <div className='panel' data-html2canvas-ignore>
            <p role='status'>Tonedeaf couldn’t refresh your Spotify session.</p>
            <button
                type='button'
                className='text-btn medium'
                disabled={isFetching || isRetrying}
                onClick={() => void retry()}
            >
                Try again
            </button>
        </div>
    );
}
