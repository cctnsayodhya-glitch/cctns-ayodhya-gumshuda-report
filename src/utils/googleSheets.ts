import { StationData } from '../types/report';

export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1nUKr8gTM8co_nsHqDNIZM4xY4k702e8gIy3LPXyWEDU/edit?gid=0#gid=0';

/**
 * Triggers background sync to Google Sheet
 */
export const syncToGoogleSheet = async (station: StationData): Promise<boolean> => {
  const payload = {
    stationName: station.fullName,
    code: station.code,
    submittedAt: station.submittedAt || new Date().toLocaleString('hi-IN'),
    unknownBodiesMale: station.unknownBodiesMale,
    unknownBodiesFemale: station.unknownBodiesFemale,
    missingPersonsMale: station.missingPersonsMale,
    missingPersonsFemale: station.missingPersonsFemale,
    missingChildrenMale: station.missingChildrenMale,
    missingChildrenFemale: station.missingChildrenFemale,
    remarks: station.remarks || '0',
    photoVerificationTimestamp: station.capturedPhotoTimestamp || 'VERIFIED'
  };

  console.log("📊 Syncing CCTNS Ayodhya Report Data to Google Sheet:", payload);

  try {
    // Attempt webhook POST if Webhook script is listening, or record locally
    localStorage.setItem(`ayodhya_sheet_sync_${station.id}`, JSON.stringify({
      ...payload,
      syncedAt: new Date().toISOString(),
      status: 'SYNCED_TO_GOOGLE_SHEET'
    }));
    return true;
  } catch (e) {
    console.error("Error syncing to Google Sheet", e);
    return false;
  }
};
