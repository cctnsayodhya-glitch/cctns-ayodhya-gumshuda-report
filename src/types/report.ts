export interface StationData {
  id: string;
  name: string; // e.g. "कोत०नगर", "गोसाईंगंज", "कैंट"
  fullName: string; // e.g. "थाना कोतवाली नगर"
  code: string;
  zone: string; // "अयोध्या"
  district: string; // "थाना [Name] जनपद अयोध्या"
  submitted: boolean;
  submittedAt?: string; // Timestamp
  submittedBy?: string; // Inspector / Officer name
  
  // Table fields matching Image 1
  unknownBodiesMale: number; // अज्ञात शव पुरुष
  unknownBodiesFemale: number; // अज्ञात शव महिला
  
  missingPersonsMale: number; // गुमशुदा व्यक्ति पुरुष
  missingPersonsFemale: number; // गुमशुदा व्यक्ति महिला
  
  missingChildrenMale: number; // गुमशुदा बच्चों की संख्या पुरुष
  missingChildrenFemale: number; // गुमशुदा बच्चों की संख्या महिला
  
  remarks: string; // शेष विवरण (e.g. "निल", "0")

  // Duty Photo Verification
  capturedPhoto?: string; // Base64 data URL
  capturedPhotoTimestamp?: string; // Photo capture time
}

export type UserRole = 'ADMIN' | 'PS_USER';

export interface AuthSession {
  role: UserRole;
  stationId?: string; // Populated for PS_USER
  stationName?: string;
}

export interface DateRange {
  fromDate: string; // e.g., "15.07.2026"
  toDate: string;   // e.g., "31.07.2026"
  letterDate: string; // e.g., "01.08.2026"
  letterNo: string;   // e.g., "सी०गु०पा०/2026"
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  recipientPhone: string;
  message: string;
  type: 'SMS' | 'WHATSAPP' | 'SYSTEM_ALERT';
  status: 'SENT' | 'DELIVERED';
}

