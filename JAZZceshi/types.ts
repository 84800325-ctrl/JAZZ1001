export enum AppView {
  SETUP = 'SETUP',
  CAMERA = 'CAMERA',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT'
}

export interface AnalysisResult {
  title: string;
  description: string;
}
