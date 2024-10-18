
enum QuestionType {
    MULTIPLE_CHOICE = "multiple_choice",
    TRUE_FALSE = "true_false", 
    IDENTIFICATION = "identification",
    ESSAY = "essay"
}

//abstract class for questions
interface AQuestion {
    question: string;
    type: QuestionType;
    part: number; //part 1, part 2, etc.
}


//multiple choice question
interface MultipleChoiceQuestion extends AQuestion {
    type: QuestionType.MULTIPLE_CHOICE;
    answer: string;
    options: string[];
}

//true or false question
interface TrueFalseQuestion extends AQuestion {
    type: QuestionType.TRUE_FALSE;
    answer: boolean;
}

//identification question
interface IdentificationQuestion extends AQuestion {
    type: QuestionType.IDENTIFICATION;
    answer: string;
}


interface Rubric {
    criteria: string;
    points: number;
}



//essay question
interface EssayQuestion extends AQuestion {
    type: QuestionType.ESSAY;
    rubric: Rubric[];
    answer: string; //free response
}

type Question = MultipleChoiceQuestion | TrueFalseQuestion | IdentificationQuestion | EssayQuestion;


const dummy = [
    {
        id: "0",
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed"
    },

    {
        id: "1",
        examName: "CSOPESY - Process Scheduling",
        examStatus: "Not Yet Answered"
    },

    {
        id: "2",
        examName: "MOBDEVE - Android Development",
        examStatus: "70/70 - Attempt 1"
    },
    {
        //complete version
        id: "10",
        examName: "MOBDEVE - Recycler Views and Intents",
        examStatus: "Completed",
        examDescription: "This is a test exam for MOBDEVE",
        examParts: ["Part 1", "Part 2"],
        examScore: 70,
        examTotalScore: 70,
        examQuestions: [
            {
                id: "q1",
                question: "What is a recycler view?",
                type: QuestionType.MULTIPLE_CHOICE,
                part: 1,
                options: [
                    "A: A view that recycles views", 
                    "B: A view that recycles data", 
                    "C: A view that recycles intents", 
                    "D: A view that recycles activities"
                ],
                answer: "A"
            },
            {
                id: "q2",
                question: "Is RecyclerView a layout?",
                type: QuestionType.TRUE_FALSE,
                part: 1,
                answer: false
            },
            {
                id: "q3",
                question: "What is the purpose of an intent?",
                type: QuestionType.IDENTIFICATION,
                part: 2,
                answer: "To start activities"
            },
            {
                id: "q4",
                question: "Explain the usage of fragments.",
                type: QuestionType.ESSAY,
                part: 2,
                rubric: {
                    clarity: "Clear explanation of fragment usage",
                    depth: "Detailed analysis of fragment life cycle"
                }
            }
        ]
    }
];



type ItemData = {
    id: string;
    examName: string;
    examStatus: string;
    examDescription: string;
    examParts: string[];
    examScore: number;
    examTotalScore: number;
    examQuestions: Question[];

};
export {dummy, ItemData};