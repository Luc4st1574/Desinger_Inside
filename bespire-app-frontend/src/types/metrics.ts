export interface RawTask {
  id: string;
  completedAt: string;
  completionTimeHours: number;
  requiredRevision: boolean;
  clientRating?: number;
}
