import { useRef } from 'react';
import html2canvas from 'html2canvas';

function isMobile(): boolean {
    return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(
        navigator.userAgent,
    );
}

export const useDownload = () => {
    const exportRef = useRef<HTMLElement>(null);

    const refreshImageURL = async (): Promise<{
        canvas: HTMLCanvasElement | null;
        blob: Blob | null;
    }> => {
        const el = exportRef?.current;
        if (!el) {
            return { canvas: null, blob: null };
        }

        const canvas = await html2canvas(el, {
            useCORS: true,
            backgroundColor: '#131313',
        });

        const blob: Blob | null = await new Promise(resolve => {
            canvas.toBlob((data: Blob | null) => {
                resolve(data);
            });
        });

        if (blob) {
            return { canvas, blob };
        }
        return { canvas, blob: null };
    };

    const shareImage = async (text: string) => {
        const { canvas, blob } = await refreshImageURL();

        if (isMobile() && navigator.canShare && blob) {
            const files = [
                new File([blob], 'tonedeaf.png', { type: blob.type }),
            ];

            const shareData = {
                files,
                text,
            };

            if (text) {
                shareData.text =
                    (text.length ? text + '\n' : '') +
                    'https://tonedeaf.vercel.app';
            }

            if (navigator.canShare(shareData)) {
                try {
                    await navigator.share(shareData);
                } catch (error) {
                    console.warn('Sharing not supported for this device.');
                    console.error(error);
                }
            }
        } else if (canvas) {
            const image = canvas
                .toDataURL('image/png')
                .replace('image/png', 'image/octet-stream');
            const a = document.createElement('a');
            a.setAttribute('download', 'tonedeaf.png');
            a.setAttribute('href', image);
            a.click();
            a.remove();
        }
    };

    const copyImage = async () => {
        const { blob } = await refreshImageURL();
        if (navigator.clipboard && blob) {
            const imageItem = new ClipboardItem({
                [blob.type]: blob,
            });
            navigator.clipboard.write([imageItem]);
        }
    };

    const shareText = async (text: string): Promise<string | null> => {
        text += '\nhttps://tonedeaf.vercel.app';
        if (isMobile() && navigator.canShare) {
            const shareData = {
                text: text,
            };
            if (navigator.canShare(shareData)) {
                try {
                    await navigator.share(shareData);
                } catch (error) {
                    console.warn('Sharing not supported for this device.');
                    console.error(error);
                }
            }
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            return text;
        }
        return null;
    };

    return { exportRef, refreshImageURL, shareImage, copyImage, shareText };
};