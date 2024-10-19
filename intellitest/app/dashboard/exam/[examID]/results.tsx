import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/ui/button";
import React from "react";
import { dummy } from "@/lib/dummy_data";

export default function summaryPage() {
    const router = useRouter();
    const { examID } = useLocalSearchParams();

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

    return (
        <View
            className="p-4"
            style={{
                flex: 1,
                gap: 10,
            }}
        >
            <Text>Good Job!</Text>
            <Text>45 / 50</Text>
            <Text>25 out of 25 items answered</Text>

            <View className="border bg-gray-100 p-4">
                <Text>Insert Question and Answer and Answer key Here</Text>
                {/* dummy data */}
            </View>

            {/* Retake Test Button */}
            <Button onPress={handleRetakeButton}>
                <Text>Retake Test</Text>
            </Button>

            {/* Back to My Exams Button */}
            <Button variant="secondary" onPress={handleDashboardButton}>
                <Text>Back to My Exams</Text>
            </Button>
        </View>
    );
}
