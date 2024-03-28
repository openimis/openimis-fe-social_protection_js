import { baseApiUrl } from '@openimis/fe-core';

function downloadFile(url, filename) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Download failed, reason: ', error);
    });
}

export function downloadInvalidItems(uploadId) {
  const baseUrl = `${window.location.origin}${baseApiUrl}/social_protection/download_invalid_items/`;
  const queryParams = new URLSearchParams({ upload_id: uploadId });
  const url = `${baseUrl}?${queryParams.toString()}`;
  downloadFile(url, 'invalid_items.csv');
}

export function downloadBeneficiaryUploadFile(benefitPlanId, filename) {
  const baseUrl = `${window.location.origin}${baseApiUrl}/social_protection/download_beneficiary_upload_file/`;
  const queryParams = new URLSearchParams({ benefit_plan_id: benefitPlanId, filename });
  const url = `${baseUrl}?${queryParams.toString()}`;
  downloadFile(url, filename);
}
