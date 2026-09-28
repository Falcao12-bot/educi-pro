import { supabase } from './supabase';
import type { ClassRow, Stats, Subject } from '../types';

const ok = <T,>(r: { data: T | null; error: { message: string } | null }): T => {
  if (r.error) throw new Error(r.error.message);
  return r.data as T;
};

export const getClasses = async () =>
  ok(await supabase.from('classes').select('id,level,name,position').order('position')) as ClassRow[];

export const getSubjects = async () =>
  ok(await supabase.from('subjects').select('id,name,color').order('name')) as Subject[];

export async function getChapterCounts(classId: string) {
  const rows = ok(await supabase.from('chapters').select('subject_id').eq('class_id', classId)) as { subject_id: string }[];
  const map: Record<string, number> = {};
  rows.forEach((r) => (map[r.subject_id] = (map[r.subject_id] ?? 0) + 1));
  return map;
}

export async function getChaptersWithLessons(classId: string, subjectId: string) {
  const chapters = ok(await supabase.from('chapters').select('id,title,position')
    .eq('class_id', classId).eq('subject_id', subjectId).order('position')) as { id: string; title: string }[];
  if (!chapters.length) return [];
  const lessons = ok(await supabase.from('lessons').select('id,title,chapter_id,is_premium,duration_min')
    .in('chapter_id', chapters.map((c) => c.id)).eq('status', 'published').order('created_at')) as any[];
  return chapters.map((c) => ({ title: c.title, data: lessons.filter((l) => l.chapter_id === c.id) }));
}

export const getLesson = async (id: string) =>
  ok(await supabase.from('lessons').select('id,title,summary,objectives,content_html,duration_min,difficulty').eq('id', id).single()) as any;

export const recordLessonView = (lessonId: string) => supabase.from('lesson_views').insert({ lesson_id: lessonId });
export const recordStudy = (seconds: number) =>
  seconds >= 5 ? supabase.from('study_sessions').insert({ seconds: Math.min(Math.round(seconds), 14400) }) : Promise.resolve();

export async function getExercises(classId: string) {
  return ok(await supabase.from('exercises')
    .select('id,title,difficulty,points,type,chapters!inner(class_id,title)')
    .eq('chapters.class_id', classId).eq('status', 'published').order('created_at', { ascending: false }).limit(50)) as any[];
}
export const getExercise = async (id: string) =>
  ok(await supabase.from('exercises').select('id,title,type,instruction,question,options,points').eq('id', id).single()) as any;

export const submitAnswer = async (id: string, answer: string) =>
  ok(await supabase.rpc('submit_answer', { p_exercise: id, p_answer: answer })) as
    { correct: boolean; correct_answer: string; explanation: string | null; points: number };

export const getExams = async (type: string) =>
  ok(await supabase.from('exams').select('id,title,year,serie,subject,duration_min,pdf_url,correction_url')
    .eq('exam_type', type).eq('status', 'published').order('year', { ascending: false }).limit(50)) as any[];

export const getStats = async () => ok(await supabase.rpc('my_stats')) as Stats;

export async function askAI(messages: { role: string; content: string }[], lessonId?: string) {
  const { data, error } = await supabase.functions.invoke('ai-tutor', { body: { messages, lessonId } });
  if (error) throw new Error("L'assistant est indisponible pour le moment.");
  return (data as { reply: string }).reply;
}
