import { View, FlatList, ScrollView} from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ExamItem } from "@/components/IntelliTest/Dashboard/exam-item";
import React, { useEffect, useState } from "react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import {Search} from "lucide-react-native";


import { dummy, ItemData } from "@/lib/dummy_data";

interface answer {
    question_id: string;
    question: string;
    answer: string;
}

export default function summaryPage() {
    const router = useRouter();
    const { examID } = useLocalSearchParams();
    const { answers } = useLocalSearchParams();
    const [parsedAnswers, setParsedAnswers] = useState([]);

    useEffect(() => {
        console.log("Answers:")
        console.log(answers)
    }, [answers]);


    useEffect(() => {
        // Parse the answers JSON string
        if (answers) {
            try {
                const parsed = JSON.parse(answers);
                setParsedAnswers(parsed);
                console.log("Parsed Answers:", parsed);
            } catch (error) {
                console.error("Error parsing answers:", error);
            }
        }
    }, [answers]);
    
    const onGradeMe = () => {
        console.log("Grading...")
        router.navigate(
            {
                pathname: "/dashboard/exam/" + examID + "/results",
                params: { answers: answers }
            }
        )
    }
    const currentExam = dummy[3];

    return (
        <ScrollView 
        className="p-4"
        style={{
            flex: 1,
        }}>
            <Text className="justify-center text-center text-3xl font-bold mt-5">You made it to the end!</Text>
            <Text className="justify-center text-center mb-10">Here is a summary of your answers</Text>  

            

            <View className="rounded-3xl bg-gray-100 p-6 gap-4 mb-10">
                {parsedAnswers.map((answer: answer, index) => (
                    <View key={index} className="flex flex-col pl-2 py-4 bg-white rounded-2xl mb-4">
                        <Text className="px-4 text-gray-500">Question {index + 1}</Text>
                        <Text className="px-4">{answer.question}</Text>

                        <Text className="px-4 text-gray-500">Your Answer</Text>
                        <Text className="px-4">{answer.answer}</Text>
                    </View>
                ))}
            </View> 
            
            <Button onPress={onGradeMe} className="mb-4">
                <Text>Grade Me!</Text>
            </Button>

            <View className="mb-10"></View>
        </ScrollView>
    )
}
