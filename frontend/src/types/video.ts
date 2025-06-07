export interface VideoFile {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  createdAt: string;
  path: string;
}

export interface ParsedVideoInfo {
  company: string;
  vehicle: string;
  action: string;
}

export interface VideoActionType {
  value: string;
  label: string;
  color?: string;
}