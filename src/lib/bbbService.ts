export type BBBConfig = {
  baseUrl: string;
  apiSecret: string;
  salt: string;
};

export const DEFAULT_BBB_CONFIG: BBBConfig = {
  baseUrl: "https://bbb.example.com/bigbluebutton/api",
  apiSecret: "CHANGE_ME",
  salt: "CHANGE_ME",
};

function generateChecksum(config: BBBConfig, queryString: string): string {
  // در پیاده‌سازی واقعی از crypto.createHmac استفاده کن
  // اینجا Mock است
  return btoa(queryString + config.apiSecret);
}

export function buildJoinUrl(
  config: BBBConfig,
  meetingId: string,
  fullName: string,
  role: "moderator" | "attendee" = "attendee",
  password?: string
): string {
  const encodedName = encodeURIComponent(fullName);
  const params = `meetingID=${meetingId}&fullName=${encodedName}&role=${role}`;
  const checksum = generateChecksum(config, params);
  return `${config.baseUrl}/join?${params}&checksum=${checksum}`;
}

export function buildCreateMeetingUrl(
  config: BBBConfig,
  meetingId: string,
  meetingName: string,
  moderatorPW: string,
  attendeePW: string,
  duration = 60
): string {
  const params = `name=${encodeURIComponent(meetingName)}&meetingID=${meetingId}&moderatorPW=${moderatorPW}&attendeePW=${attendeePW}&duration=${duration}&autoStartRecording=true`;
  const checksum = generateChecksum(config, params);
  return `${config.baseUrl}/create?${params}&checksum=${checksum}`;
}

// Mock برای تست بدون سرور
export function mockBBBJoinLink(courseCode: string, classId: string): string {
  const meetingId = `lms_${courseCode}_${classId}`;
  return `https://bbb.example.com/html5client/join?meetingID=${meetingId}&demo=true`;
}
