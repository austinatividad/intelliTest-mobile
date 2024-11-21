// exam.tsx
import { useEffect } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
// import { dummy } from "@/lib/dummy_data";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { MultipleChoiceItem } from "@/components/IntelliTest/Exams/multiple-choice-item";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RubricModal from "@/components/ui/rubricModal";
import React, { useState, useCallback } from "react";
import * as sq from "@/utils/supabaseQueries";
import { set } from "date-fns";


interface answer {
    question_id: string;
    answer: string;
}


export default function QuestionPage() {
    const router = useRouter();
    const { setLoading, setText } = useLoadingContext();
    const { questionNumber, examID } = useLocalSearchParams();
    const currentQuestionIndex = Number(questionNumber) - 1; // Zero-based index
    const [showRubric, setShowRubric] = useState(false);
    const [rubricText, setRubricText] = useState("");
    const [exam, setExam] = useState<sq.Exam | null>(null);
    const examIdParam = useLocalSearchParams()["examID"];
    const examId = Array.isArray(examIdParam) ? examIdParam[0] : examIdParam;
    const [questions, setQuestions] = useState<sq.Question[]>([]);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null); // Track the selected option index
    const [answers, setAnswers] = useState<answer[]>([]);
    const [essayAnswer, setEssayAnswer] = useState<string>("");

    const handleOptionSelect = (index: number) => {
        setSelectedOptionIndex(index); // Update the selected option
        console.log(index)
        console.log(currentQuestion.multiple_choice[index].option_text)
    };

    const addAnswer = (newAnswer: answer) => {
        setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
        console.log(newAnswer)
    };

    useEffect(() => {
        async function getExam() {
            console.log("Getting exam")
            console.log(examId)
            setLoading(true);
            const exam = await sq.getExam(examId);
            //throw error if exam is null
            if (!exam) {
                setText("Exam not found");
                setLoading(false);
                return;
            }
            setExam(exam);
            
            console.log(exam)
            //temporary variable to append to questions
            let temp = []
            for (let i = 0; i < exam.part.length; i++) {
                // question is a list of objects, append to questions list
                for (let j = 0; j < exam.part[i].question.length; j++) {
                    temp.push(exam.part[i].question[j])
                    //append the part name and part description to the question object
                    temp[temp.length-1].part = exam.part[i]
                    console.log(exam.part[i].question[j])
                    
                }
            }
            setQuestions(temp)
            setLoading(false);
        }
        getExam();
    }, [router]);

    // Redirect to /summary if questionNumber exceeds the number of questions
    useEffect(() => {
        console.log("checking answers")
        console.log(answers)
        if (questions.length > 0 && currentQuestionIndex >= questions.length) {
            console.log("Redirecting to summary")
            console.log(questions.length)
            //TODO: pass answers to summary page
            router.navigate(
                {
                    pathname: `/dashboard/exam/${examID}/summary`,
                    params: { answers: JSON.stringify(answers) },

                });
        }
    }, [currentQuestionIndex, examID, router, questions, answers]);

    const currentQuestion = questions[currentQuestionIndex];

    const handlePress = useCallback(() => {
        if (!currentQuestion) {
            console.error("currentQuestion is undefined");
            return;
        }

        //add answer to answers
        if (currentQuestion.type === "multiple_choice") {
            if (selectedOptionIndex === null) {
                console.error("No option selected");
                return;
            }
            addAnswer({
                question_id: currentQuestion.id,
                answer: currentQuestion.multiple_choice[selectedOptionIndex].option_text,
            });
        } else if (currentQuestion.type === "essay") {
            addAnswer({
                question_id: currentQuestion.id,
                answer: essayAnswer,
            });
        }

        setSelectedOptionIndex(null); // Reset selected option
        router.navigate({
            pathname: `/dashboard/exam/${examID}`,
            params: { questionNumber: Number(questionNumber) + 1 },
        });
    },[currentQuestion, selectedOptionIndex, questionNumber, examID, router, essayAnswer]);

    const handleRubricPress = useCallback((text) => {
        setRubricText(text);
        setShowRubric(true);
    }, []);

    const handleRubricClose = useCallback(() => {
        setShowRubric(false);
    }, []);

    if (!currentQuestion) return null;

    return (
        <View className="pt-9" style={{ flex: 1 }}>
            <View className="p-4 flex flex-col gap-4">
                <Text className="text-xl font-bold">{currentQuestion.part.part_name}: {currentQuestion.part.part_description}</Text>
                <Text>Question {questionNumber}</Text>
                <View className="rounded-3xl bg-gray-100 p-4 h-auto">
                    <Text>{currentQuestion.question}</Text>
                </View>

                {/* Render multiple choice options */}
                {currentQuestion.type === "multiple_choice" && (
                    <View className="flex flex-col gap-4">
                        {currentQuestion.multiple_choice.map((option, index) => (
                            <MultipleChoiceItem
                                key={index}
                                text={option.option_text}
                                isSelected={selectedOptionIndex === index} // Pass whether this item is selected
                                onSelect={() => handleOptionSelect(index)} // Handle selection
                            />
                        ))}
                    </View>
                )}

                {/* Render identification input */}
                {currentQuestion.type === "identification" && (
                    <View className="flex flex-col gap-4">
                        <Label nativeID={"QuestionInput"}>Answer</Label>
                        <Input />
                    </View>
                )}

                {/* Render essay with rubric modal */}
                {currentQuestion.type === "essay" && (
                    <>
                        <RubricModal
                            visible={showRubric}
                            onClose={handleRubricClose}
                            criteria={rubricText}
                        />

                        <View className="flex flex-col gap-4">
                            <Label nativeID={"QuestionInput"}>Answer</Label>
                            <Textarea onChangeText={setEssayAnswer} />
                            <Button className="w-1/2" variant="secondary" onPress={() => handleRubricPress(`${currentQuestion.rubric[0].criteria}\n\n${currentQuestion.rubric[0].description}`)}>
                                <Text>Rubrics</Text>
                            </Button>
                        </View>
                    </>
                )}
            </View>

            <View className="absolute bottom-0 w-full p-4">
                <Button onPress={handlePress} className="w-full">
                    <Text className="text-white">Next</Text>
                </Button>
            </View>
        </View>
    );
}
