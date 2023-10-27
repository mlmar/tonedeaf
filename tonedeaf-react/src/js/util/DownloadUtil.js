import { useRef } from 'react';
import html2canvas from 'html2canvas';

const isMobile = typeof window.orientation !== "undefined";

export const dataToTextList = (list) => {
  return list.map((item, i) => {
    let artistName = item?.artists?.map((artist) => artist.name).join(", ");
    artistName = artistName ? ' - ' + artistName : '';
    return (i+1).toString().padStart(2,0) + '. ' + item.name + artistName
  }).join('\n');
}

export const useDownload = () => {
  const exportRef = useRef();

  const shareImage = async (text) => {
    const el = exportRef?.current;
    if(!el) return;
    const canvas = await html2canvas(el, { 
      useCORS: true,
      letterRendering: true
    });
    if(isMobile && navigator.canShare) {
      canvas.toBlob(async (blob) => {
        const files = [new File([blob], 'tonedeaf.png', { type: blob.type })]
        const shareData = {
          files
        }
        if(text) {
          shareData.text = (text.length ? text + '\n' : '') + 'https://tonedeaf.vercel.app';
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

  const downloadImage = async () => {
    await shareImage(null);
  }

  const shareText = async (text, callback) => {
    text += '\nhttps://tonedeaf.vercel.app';
    if(isMobile && navigator.canShare) {
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
      if(callback) {
        callback(text);
      }
    }
  }

  return { exportRef, shareImage, downloadImage, shareText }
}