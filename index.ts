export type Level = 'primaire' | 'college' | 'lycee';
export interface ClassRow { id: string; level: Level; name: string; position: number }
export interface Subject { id: string; name: string; color: string }
export interface Stats {
  exercises_done: number; today_exercises: number; lessons_seen: number;
  study_seconds: number; xp: number; streak: number; is_premium: boolean;
}
export interface Profile { id: string; first_name: string; last_name: string; class_id: string | null; classes: { name: string } | null }
