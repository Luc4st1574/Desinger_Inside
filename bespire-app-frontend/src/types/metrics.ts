export interface RawTask {
  id: string;
  type: string;
  completedAt: string;
  completionTimeHours: number;
  requiredRevision: boolean;
  clientRating?: number;
  designer: { name: string };
  client: { name: string };
}