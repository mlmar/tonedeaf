import { useRef } from 'react';
import html2canvas from 'html2canvas';

export const dataToTextList = (list) => {
  return list.map((item, i) => (i+1).toString().padStart(2,0) + '. ' + item.name).join('\n');
}

export const useDownload = () => {
  const exportRef = useRef();

  const shareImage = async (text) => {
    const el = exportRef?.current;
    if(!el) return;

    const canvas = await html2canvas(el, { useCORS: true });
    if(navigator.canShare) {
      canvas.toBlob(async (blob) => {
        const files = [new File([blob], 'tonedeaf.png', { type: blob.type })]
        const shareData = {
          text: text + '\n' + 'https://tonedeaf.vercel.app',
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

  const shareText = async (text) => {
    text += '\n' + 'https://tonedeaf.vercel.app';
    if(navigator.canShare) {
      const shareData = {
        text: text
      }
      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData)
        } catch (err) {
          console.warn('Sharing not supported for this device.');
        }
      }
    } else if(navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  return [exportRef, shareImage, shareText];
}