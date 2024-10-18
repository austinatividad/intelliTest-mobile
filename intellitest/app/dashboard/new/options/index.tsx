import { View, Text } from "react-native";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Index() {
  const router = useRouter();
  const { setLoading, setText } = useLoadingContext();
  const [examName, setExamName] = useState(""); // State to track exam name input

  // Check if the Continue button should be visible
  const isButtonVisible = examName.trim().length > 0;

  const handleContinue = () => {
    // Add logic to handle the continue button press (e.g., navigation)
    router.push({
        pathname: "/dashboard/exam",
        params: { examId: "10" },
    });
  };

  return (
    <View style={{ flex: 1 }}>
    <View className="p-4">
      <View>
        <Text className="text-3xl font-bold">Just a few more steps!</Text>

        <Text className="flex w-full justify-left text-left pb-2 text-xl">
          We're just finalizing the information we need to create your new test 😊
        </Text>
      </View>

      <Label nativeID="examName" className="flex w-full justify-left text-left pb-2">
        Exam Name
      </Label>
      <View className="pb-7">
        <Input
          className="w-full"
          nativeID="examName"
          value={examName}
          onChangeText={setExamName} // Track the exam name input
        />
      </View>

      {/* Grade Level */}
      <Label nativeID="gradeLevel" className="flex w-full justify-left text-left pb-2">
        Grade Level
      </Label>
      <View className="pb-7">
        <Input className="w-full" nativeID="gradeLevel" />
      </View>

      {/* Additional Notes */}
      <Label nativeID="additionalNotes" className="flex w-full justify-left text-left pb-2">
        Additional Notes
      </Label>
      <View className="pb-7">
        <Textarea className="w-full" nativeID="additionalNotes" />
      </View>
      
    </View>
    {/* Conditionally render the Generate Test button */}
    {isButtonVisible && (
        <View
        className="w-full"
        style={{
            bottom: 0,
            position: "absolute",
            padding: 10,
        }}
        >
        <Button variant={null} className="bg-black" onPress={handleContinue}>
            <Text className="text-white">Continue</Text>
        </Button>
        </View>
    )}
    {!isButtonVisible && (
        <View
        className="w-full"
        style={{
            bottom: 0,
            position: "absolute",
            padding: 10,
        }}
        >
        <Button variant="ghost" className="bg-gray-200">
            <Text className="text-white">Generate Test</Text>
        </Button>
        </View>
    )}
</View>
  );
}
