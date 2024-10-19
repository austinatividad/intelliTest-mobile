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

export default function summaryPage() {
    const router = useRouter();
    return (
        <View 
        className="p-4"
        style={{
            flex: 1,
            gap: 10,
        }}>
            <Text>Good Job!</Text>
            <Text>45 / 50</Text>  
            <Text>25 out of 25 items answered</Text>  

            <View className="border bg-gray-100 p-4">
                <Text>Insert Question and Answer and Answer key Here</Text>
                {/* dummy data */}
                
            </View> 
            <Button>
                <Text>Retake Test</Text>
            </Button>

            <Button variant="secondary">
                <Text>Back to My Exams</Text>
            </Button>
        </View>
    )
}