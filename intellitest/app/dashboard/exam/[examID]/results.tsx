import { ScrollView, View, Modal, Pressable, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { dummy } from "@/lib/dummy_data";
import ExplanationModal from "@/components/explanationModal";
import FeedbackModal from "@/components/ui/feedbackModal";
import { BackHandler } from "react-native";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import * as sb from "@/utils/supabaseQueries";
import { EssayReviewSchema } from "@/utils/types";

export default function summaryPage() {
    const router = useRouter();
    const { examID, attemptID } = useLocalSearchParams();
    const [modalVisible, setModalVisible] = useState(false);
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [explanationText, setExplanationText] = useState("");
    const [feedbackText, setFeedbackText] = useState("");
    const { setLoading, setText } = useLoadingContext();
    const [results, setResults] = useState();
    const sleep = ms => new Promise(r => setTimeout(r, ms))

    useEffect(() => {
        const backAction = () => {
            router.replace({
                pathname: `/dashboard/exams`,
            });
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);
    
    useEffect(() => {
        console.log("Exam ID:", examID);
        console.log("Attempt ID:", attemptID);
        const TestTimeout = async () => {
            await sleep(2000);
        }
        setLoading(true);
        setText("Gathering Results... 😊");
        TestTimeout();
        
        // fetch attempt from sb
        const fetchAttempt = async () => {
            if (typeof attemptID === 'string' && typeof examID === 'string') {
                const attempt = await sb.getAttempt(attemptID, examID);
                setResults(attempt); // Set the fetched attempt to results state
                
            } else {
                console.error("Invalid attemptID or examID");
            }
        };

        fetchAttempt();
        setLoading(false);

    }, [attemptID, examID]);
    // Function to retake the exam, redirects to the first question
    const handleRetakeButton = () => {
        router.navigate({
            pathname: `/dashboard/exam/${examID}`, // Navigate to the first question
            params: { questionNumber: 1 },
        });
    };


    // Function to go back to the "My Exams" dashboard
    const handleDashboardButton = () => {
        router.navigate({
            pathname: `/dashboard/exams`, // Navigate back to "My Exams" page
        });
    };

    // Function to show the modal with a specific explanation
    const viewModal = (text: string) => {
        setExplanationText(text);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };


    const viewFeedback = (rubric: any, review: any) => {
        console.log("-------------------------------------------------------")
        console.log(JSON.stringify(rubric, null, 2))
        console.log("-------------------------------------------------------")
        console.log("-------------------------------------------------------")
        console.log(JSON.stringify(review, null, 2))
        console.log("-------------------------------------------------------")
        var updatedRubrics = [...rubric];

        updatedRubrics.forEach((criteria: any) => {
            console.log(criteria)
            const match = review.find((item => criteria.id === item.rubric_id))

            //append match to rubric

            if (match) {
                criteria["feedback"] = match;
            }

        });

        console.log("-------------------------------------------------------")
        console.log(JSON.stringify(updatedRubrics, null, 2))
        console.log("-------------------------------------------------------")
        
        const result_text = formatRubric(updatedRubrics);

        Alert.alert(
            "Feedback",
            result_text,
            [
                {
                    text: "Close",
                    onPress: () => console.log("Close Pressed"),
                    style: "cancel"
                }
            ],
            { cancelable: true }
        );
        


    }

    const closeFeedback = () => {
        // setFeedbackVisible(false);
    }

    const formatRubric = (rubric: any[]) => {
        /**
         * Format:
         * {Criteria} - ({attained_points}/{Points} points)\n
         * {Feedback}\n
         */
        console.log("-------------------------------------------------------")
        console.log("LAST STEP")
        console.log(JSON.stringify(rubric, null, 2))
        console.log("-------------------------------------------------------")
        var formattedText = "";

        rubric.forEach((criteria: any) => {
            formattedText += `${criteria.criteria} - (${criteria.feedback.attained_score}/${criteria.points} points)\n${criteria.feedback.rubric_comment}\n\n`;
        });

        return formattedText;
    }
    

    return (
        <ScrollView
            className="p-4"
            style={{
                flex: 1,
            }}
        >
            {/* Check if results are loaded */}
            {results ? (
                <>
                    <ExplanationModal 
                        visible={modalVisible} 
                        onClose={closeModal} 
                        explanationText={explanationText}
                    />
    
                    <FeedbackModal
                        visible={feedbackVisible}
                        onClose={closeFeedback}
                        feedbackText={feedbackText}
                    />
    
                    <Text className="justify-center text-center mt-5 text-2xl text-gray-600"> Good Job! </Text>  
                    <Text className="justify-center text-center mt-5 text-5xl text-black font-bold">
                        {`${results.score} out of ${results.exam.total_score}`}
                    </Text>
                    <Text className="justify-center text-center mt-5 text-2xl text-gray-600 pb-5"> Keep it up! </Text>  
                    
                    <View className="rounded-3xl bg-gray-100 p-6 gap-4 mb-10">
                        {/* for loop the results.answer */}
                        {results.answer.map((item, index) => (
                            <View key={index + 1} className={`flex flex-col p-2 py-4 bg-white rounded-2xl border ${item.question.multiple_choice.length > 0 ? (item.answer === item.question.multiple_choice.find(choice => choice.is_correct === true).option_text ? 'border-green-400' : 'border-red-400') : 'border-white'}`}>
                                <View className="flex flex-col">
                                    <Text className="text-md text-gray-600 pb-4">Question {index + 1} ({item.question.points} points)</Text>

                                    {/* actual contents */}
                                    <Text className="text-lg font-bold pb-22">{item.question.question}</Text>
                                    <Text>Your Answer</Text>
                                    <Text className="pb-4">{item.answer}</Text>
                                    
                                    {item.question.multiple_choice.length > 0 && (
                                        <>
                                            <Text>Correct Answer</Text>
                                            <Text>{item.question.multiple_choice.find(choice => choice.is_correct === true).option_text}</Text>
                                        </>
                                    )}
                                </View>
                                {item.question.rubric.length > 0 && (
                                    <View className="flex flex-col">
                                        <Button onPress={() => viewFeedback(item.question.rubric, results.essay_review)} variant="secondary">
                                            <Text>View Feedback</Text>
                                        </Button>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
    
                    {/* Retake Test Button */}
                    <Button onPress={handleRetakeButton} className="mb-4">
                        <Text>Retake Test</Text>
                    </Button>
    
                    {/* Back to My Exams Button */}
                    <Button variant="secondary" onPress={handleDashboardButton} className="mb-8">
                        <Text>Back to My Exams</Text>
                    </Button>
                </>
            ) : (
                <Text className="justify-center text-center mt-5 text-2xl text-gray-600">Loading...</Text>
            )}
        </ScrollView>
    );
}
