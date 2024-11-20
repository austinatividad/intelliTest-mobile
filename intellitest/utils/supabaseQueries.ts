import { supabase } from "@/lib/supabase";
import * as auth from "@/utils/auth";


export interface Exam {
    examName: string;
    examStatus: string;
    score: number;
    totalScore: number;
    id: string;
  }

  

//gets the list of exams of the user
export async function getExams() {
    const session = await auth.getSession();
    const id = session.data.session?.user.id;
    console.log(id)
    const { data, error } = await supabase
        .from('exam')
        .select('*')
        .eq('user_id', id);
    console.log("finished getting exams");
    console.log(data);
    if (error) {
        console.error('Error getting exams:', error.message);
        return;
    }
    const ExamList: Exam[] = data.map((exam: any) => {
        return {
            examName: exam.exam_name,
            examStatus: exam.status,
            score: exam.score,
            totalScore: exam.total_score,
            id: exam.id
        }
    });

    return ExamList;
}