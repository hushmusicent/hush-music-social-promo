export interface Account {
  id: string;
  name: string;
  handle: string;
  note?: string;
}

export interface PostMedia {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
}

export interface Post {
  id: number;
  account: string;
  author: string;
  text: string;
  hashtags: string;
  status:
    | 'Scheduled Posts'
    | 'Published'
    | 'Drafts'
    | 'Ideas'
    | 'Awaiting Approval'
    | 'Not Approved'
    | 'Expired Approval'
    | 'Failed';
  date: string;
  time: string;
  category: string;
  media: string[];
  thread: string[];
  paused: boolean;
  ytTitle?: string;
  ytVisibility?: string;
  ytType?: string;
  ytKids?: string;
  ytThumbName?: string;
  ytTags?: string;
  threadsTopic?: string;
  threadsSpoilerImg?: boolean;
  threadsSpoilerText?: boolean;
  fbPost?: boolean;
  fbStory?: boolean;
  fbAI?: boolean;
  igPost?: boolean;
  igReel?: boolean;
  igStory?: boolean;
  igAI?: boolean;
  ttDisclose?: boolean;
  ttAI?: boolean;
  ttSound?: boolean;
  scStory?: boolean;
  scSpotlight?: boolean;
  repeat?: string;
  endDate?: string;
  stopAfter?: number | '';
}

export interface MediaGalleryItem {
  id?: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface BioLink {
  title: string;
  url: string;
}

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type Timeslots = Partial<Record<DayOfWeek, string>>;
