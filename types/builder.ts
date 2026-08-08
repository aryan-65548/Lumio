export interface BuilderDetails {
  name: string;
  role: string;
  techStack: string;
  vibe: string;
  title: string;
}

export type ApplicationState = 'EMPTY' | 'PHOTO_SELECTED' | 'GENERATING' | 'RESULT';
