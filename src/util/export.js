import { baseApiUrl, openBlob } from '@openimis/fe-core';

export function downloadInvalidItems(upload_id) {
    var url = new URL(`${window.location.origin}${baseApiUrl}/social_protection/download_invalid_items?upload_id=${upload_id}`);
    return  (dispatch) => {
      fetch(url)
      .then(response => {
        return  response.blob()})
      .then(blob => openBlob(blob, "invalid_items.csv", "csv"))                 
      .catch((error) => {
        console.error("Export failed, reason: ", error);
    })
  };
}
