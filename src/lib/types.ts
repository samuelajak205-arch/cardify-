export interface Subject {
  name: string;
  progress: number;
  grade: string;
}

export interface TeacherComment {
  teacher: string;
  comment: string;
  date: string;
}

export interface StudentStats {
  average: number;
  rank: string;
}
