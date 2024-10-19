import { useEffect } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { dummy } from "@/lib/dummy_data";
import { MultipleChoiceItem } from "@/components/IntelliTest/Exams/multiple-choice-item";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function QuestionPage() {
    const router = useRouter();
    const { questionNumber, examID } = useLocalSearchParams();
    const currentQuestionIndex = Number(questionNumber) - 1; // Zero-based index

    // Redirect to /summary if questionNumber exceeds the number of questions
    useEffect(() => {
        if (currentQuestionIndex >= dummy[3].examQuestions.length) {
            router.navigate(`/dashboard/exam/${examID}/summary`);
        }
    }, [currentQuestionIndex, examID, router]);

    const currentExam = dummy[3];
    const currentQuestion = currentExam.examQuestions[currentQuestionIndex];

    const handlePress = () => {
        router.navigate({
            pathname: `/dashboard/exam/${examID}`,
            params: { questionNumber: Number(questionNumber) + 1 },
        });
    };



    if (!currentQuestion) return null;

    return (
        <View className="" style={{ flex: 1 }}>
            <View className="p-4 flex flex-col gap-4">
                <Text className="text-xl font-bold">{currentQuestion.part.partName}: {currentQuestion.part.partDescription}</Text>
                <Text>Question {questionNumber}</Text>
                <View className="rounded-3xl bg-gray-100 p-4 h-auto">
                    <Text>{currentQuestion.question}</Text>
                </View>

                {/*if currentQuestion.type == multiple_choice, render each option using a map which border outline gets shown when pressed */}
                {currentQuestion.type === "multiple_choice" && (
                    <View className="flex flex-col gap-4">
                        {currentQuestion.options.map((option, index) => (
                            <MultipleChoiceItem key={index} text={option} />
                        ))}
                    </View>
                )}

                {/*if currentQuestion.type == true_false, render 2 MultipleChoiceItem*/}
                {currentQuestion.type === "true_false" && (
                    <View className="flex flex-col gap-4">
                        <MultipleChoiceItem text="True" />
                        <MultipleChoiceItem text="False" />
                    </View>
                )}                

                {/*if currentQuestion.type == identification, render a text input*/}
                {currentQuestion.type === "identification" && (
                    <View className="flex flex-col gap-4">
                        <Label nativeID={"QuestionInput"}>Answer</Label>
                        <Input />
                    </View>
                )}

                {/*if currentQuestion.type === "essay", render a textarea*/}
                {currentQuestion.type === "essay" && (
                    <View className="flex flex-col gap-4">
                        <Label nativeID={"QuestionInput"}>Answer</Label>
                    <Textarea numberOfLines={20}/>
                    </View>
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
