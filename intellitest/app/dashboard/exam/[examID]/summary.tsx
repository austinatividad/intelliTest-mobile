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
    return (
        <View 
        className="p-4"
        style={{
            flex: 1,
            gap: 10,
        }}>
            <Text>You made it to the end!</Text>
            <Text>Here is a summary of your answers</Text>  

            <View className="border bg-gray-100 p-4">
                <Text>Insert Question and Answer Summary Here</Text>
                {/* dummy data */}
                
            </View> 
            <Button>
                <Text>Grade Me!</Text>
            </Button>

            <Button variant="secondary">
                <Text>Review Answers</Text>
            </Button>
        </View>
    )
}