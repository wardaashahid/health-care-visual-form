export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export interface FamilyHistory {
  heartDisease: boolean;
  diabetes: boolean;
  hypertension: boolean;
  cancer: boolean;
  asthma: boolean;
  obesity: boolean;
  stroke: boolean;
  alzheimer: boolean;
  osteoporosis: boolean;
  kidneyDisease: boolean;
}

export interface DailyMetric {
  id: string;
  date: string;
  steps: number;
  heartRate: number;
  calories: number;
  sleepHours: number;
  waterLiters: number;
  weight: number;
  mood: string; // happy, sad, stressed, neutral, angry
  symptoms: string[];
}

export interface UserProfile {
  name: string;
  age: number;
  height: number; // meters
  gender: Gender;
  chronicDiseases: string;
  familyHistory: FamilyHistory;
}

export interface AppState {
  profile: UserProfile;
  metrics: DailyMetric[]; // Array of history
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
