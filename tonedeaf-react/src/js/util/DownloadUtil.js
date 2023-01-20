import { useRef } from 'react';
import html2canvas from 'html2canvas';

export const useDownload = (text) => {
  const exportRef = useRef();

  const shareImage = async () => {
    const el = exportRef?.current;
    if(!el) return;

    const canvas = await html2canvas(el, { useCORS: true });
    if(navigator.canShare) {
      canvas.toBlob(async (blob) => {
        const files = [new File([blob], 'tonedeaf.png', { type: blob.type })]
        const shareData = {
          text: '',
          title: 'tonedeaf',
          files,
        }
        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData)
          } catch (err) {
            console.warn('Sharing not supported for this device.');
          }
        } 
      });
    } else {
      const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      const a = document.createElement('a')
      a.setAttribute('download', 'tonedeaf.png')
      a.setAttribute('href', image)
      a.click()
      a.remove();
      canvas.remove();
    }
  }

  return [exportRef, shareImage];
}