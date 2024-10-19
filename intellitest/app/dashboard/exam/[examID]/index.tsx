import { View, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ExamItem } from "@/components/IntelliTest/Dashboard/exam-item";
import React from "react";
import { InputWithIcon } from "@/components/ui/input-with-icon";

import {Search} from "lucide-react-native";

import { dummy, ItemData } from "@/lib/dummy_data";


// TODO: Fix lint errors
// TODO: breaking bug exists when going from summary to results. it redirects to results but goes back to summary after. 
//           - try implementing useEffect on the conditional redirect

export default function QuestionPage() {
    const router = useRouter();
    const { questionNumber, examID } = useLocalSearchParams();
    const { setLoading, setText } = useLoadingContext();

    const currentQuestionIndex = Number(questionNumber) - 1; // Since question numbers might be 1-based, we convert it to 0-based index

    console.log("Question Page")
    console.log(questionNumber);
    console.log(typeof questionNumber); 

    console.log("Exam ID")
    console.log(examID);
    console.log(typeof examID);

    // Ensure exam questions exist before trying to access them
    const currentExam = dummy[3];
    const totalQuestions = currentExam.examQuestions.length;

    // Redirect to /summary if questionNumber is greater than the number of questions
    if (currentQuestionIndex >= totalQuestions) {
        router.navigate("/dashboard/exam/" + examID + "/summary");
        return null; // Stop rendering the component when redirecting
    }

    const currentQuestion = currentExam.examQuestions[currentQuestionIndex];

    const handlePress = () => {
        console.log("Pressed");
        router.navigate({
            pathname: "/dashboard/exam/" + examID,
            params: { questionNumber: Number(questionNumber) + 1 }
        });
    };

    if (currentExam && currentExam.examQuestions) {
        console.log(currentQuestion.question);
        console.log(currentQuestion.type);
        console.log(currentQuestion.answer);
    } else {
        console.log("Exam questions not found");
    }

    return (
        <View 
        className="p-4"
        style={{
            flex: 1,
        }}>
            <Text>Question Page</Text>
            <Text>Question Number: {questionNumber}</Text>
            <Text>Exam ID: {examID}</Text>
            <Text>Type: {currentQuestion.type}</Text>
            <Text>Question: {currentQuestion.question}</Text>

            <Button onPress={handlePress}>
                <Text>Next</Text>
            </Button>
        </View>
    );
}
