import { supabase } from './supabase';

export type CourseRow = {
  id: string;
  code: string;
  title: string;
  units: number;
  capacity: number;
  registered: number;
  department: string;
  level: string;
  prereq?: string;
  semester: string;
};

export async function fetchCourses(semester?: string) {
  let query = supabase.from('courses').select('*');
  if (semester) query = query.eq('semester', semester);
  const { data, error } = await query;
  if (error) throw error;
  return data as CourseRow[];
}

export async function createCourse(course: Omit<CourseRow, 'id'>) {
  const { data, error } = await supabase.from('courses').insert(course).select().single();
  if (error) throw error;
  return data;
}
