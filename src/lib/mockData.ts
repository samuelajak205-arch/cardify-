import { Subject, TeacherComment, StudentStats } from './types';

export const mockSubjects: Subject[] = [
  { name: 'Mathematics', progress: 85, grade: 'A' },
  { name: 'English', progress: 75, grade: 'B+' },
  { name: 'Science', progress: 90, grade: 'A' },
  { name: 'Social Studies', progress: 65, grade: 'B' },
];

export const mockComments: TeacherComment[] = [
  { teacher: 'Mr. Kato', comment: 'Excellent improvement in Math lately!', date: '2 days ago' },
  { teacher: 'Ms. Sarah', comment: 'Keep up with the reading assignments.', date: '1 week ago' },
];

export const mockStats: StudentStats & { attendance: number; feeBalance: number } = {
  average: 78.75,
  rank: '5th/40',
  attendance: 94,
  feeBalance: 150000,
};
