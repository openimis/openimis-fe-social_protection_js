import { baseApiUrl } from '@openimis/fe-core';

export function downloadInvalidItems(upload_id) {
    var url = new URL(`${window.location.origin}${baseApiUrl}/social_protection/download_invalid_items/?upload_id=${upload_id}`);
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'invalid_items.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Export failed, reason: ", error);
      });
  }
