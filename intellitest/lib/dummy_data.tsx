
enum QuestionType {
    MULTIPLE_CHOICE = "multiple_choice",
    TRUE_FALSE = "true_false", 
    IDENTIFICATION = "identification",
    ESSAY = "essay"
}

enum ExamStatus {
    NOT_YET_ANSWERED = "Not Yet Answered",
    COMPLETED = "Completed"
}

//abstract class for questions
interface AQuestion {
    question: string;
    type: QuestionType;
    part: Part;
    points: number;
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
    description: string;
    points: number;
}


interface Part {
    partName: string;
    partDescription: string;
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
        //complete version
        id: "10",
        user: "Josh Natividad",
        examName: "MOBDEVE - Recycler Views and Intents",
        examStatus: ExamStatus.COMPLETED,
        created_at: "2021-10-10",
        attemptCount: 3,
        examDescription: "This is an intelliTest for MOBDEVE! I should know what these are by now.",
        examParts: [
            {
                partName: "Part 1",
                partDescription: "Recycler Views",
            },
            {
                partName: "Part 2",
                partDescription: "Intents",
            },
        ],
        examScore: 70,
        examTotalScore: 70,
        examQuestions: [
            {
                id: "q1",
                question: "What is a recycler view?",
                type: QuestionType.MULTIPLE_CHOICE,
                part: {
                    partName: "Part 1",
                    partDescription: "Recycler Views",
                },
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
                part: {
                    partName: "Part 1",
                    partDescription: "Recycler Views",
                },
                answer: false
            },
            {
                id: "q3",
                question: "What is the purpose of an intent?",
                type: QuestionType.IDENTIFICATION,
                part: {
                    partName: "Part 2",
                    partDescription: "Intents",
                },
                answer: "To start activities"
            },
            {
                id: "q4",
                question: "Explain the usage of fragments.",
                type: QuestionType.ESSAY,
                part: {
                    partName: "Part 2",
                    partDescription: "Intents",
                },
                rubric: [
                    {
                        criteria: "Content",
                        description: "The content of the answer",
                        points: 5
                    },
                    {
                        criteria: "Grammar",
                        description: "The grammar of the answer",
                        points: 5
                    }
                ],
            }
        ]
    },
    {
        id: "0",
        examName: "MOBDEVE - Data Driven Views (Dummy Data)",
        examStatus: "Completed"
    },

    {
        id: "1",
        examName: "CSOPESY - Process Scheduling (Dummy Data)",
        examStatus: "Not Yet Answered"
    },

    {
        id: "2",
        examName: "MOBDEVE - Android Development (Dummy Data)",
        examStatus: "70/70 - Attempt 1"
    },
    {
        id: "3",
        examName: "MOBDEVE - Android Development (Dummy Data)",
        examStatus: "70/70 - Attempt 1"
    },
    {
        id: "4",
        examName: "MOBDEVE - Android Development (Dummy Data)",
        examStatus: "70/70 - Attempt 1"
    },
    {
        id: "5",
        examName: "MOBDEVE - Android Development (Dummy Data)",
        examStatus: "70/70 - Attempt 1"
    },
    {
        id: "6",
        examName: "MOBDEVE - Android Development (Dummy Data)",
        examStatus: "70/70 - Attempt 1"
    },
    {
        id: "7",
        examName: "MOBDEVE - Android Development (Dummy Data)",
        examStatus: "70/70 - Attempt 1"
    },
    {
        id: "8",
        examName: "MOBDEVE - Android Development (Dummy Data)",
        examStatus: "70/70 - Attempt 1"
    },
    {
        id: "9",
        examName: "MOBDEVE - Android Development (Dummy Data)",
        examStatus: "70/70 - Attempt 1"
    },
    {
        id: "101",
        examName: "MOBDEVE - Android Development (Dummy Data)",
        examStatus: "70/70 - Attempt 1"
    },
    
];



type ItemData = {
    score: number;
    totalScore: number;
    id: string;
    examName: string;
    examStatus: string;
    attemptCount?: number;
    examDescription: string;
    examParts: Part[];
    examScore: number;
    examTotalScore: number;
    examQuestions: Question[];
};




// stores the data of the user's attempt at a test
type AttemptData = {
    examId: string;
    attemptNumber: number;
    answers: {
        questionId: string;
        answer: string | boolean;
    }[];
    score: number;
    totalScore: number;
    submitted: boolean;
}


const dummyAttempt: AttemptData = {
    examId: "10",
    attemptNumber: 1,
    answers: [
        {
            questionId: "1",
            answer: "A"
        },
        {
            questionId: "2",
            answer: false
        },
        {
            questionId: "3",
            answer: "To start activities"
        },
        {
            questionId: "4",
            answer: "Fragments are reusable user interface components that can be used to create multi-pane user interfaces."
        }
    ],
    score: 70,
    totalScore: 70,
    submitted: true
}

export {dummy, ItemData, AttemptData, dummyAttempt};