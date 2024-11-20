import { View, Text } from "react-native";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Document, ExamInputContent, fileTypes } from "@/utils/types";
import { supabase } from "@/lib/supabase";
import { createBucket, uploadImagesToBucket } from "@/utils/supabaseQueries";

export default function Index() {
  const router = useRouter();
  const { setLoading, setText } = useLoadingContext();
  const [examName, setExamName] = useState(""); // State to track exam name input
  const [bucketName, setBucketName] = useState("");
  const [shouldContinue, setShouldContinue] = useState(false);
  const examInputContent : ExamInputContent = JSON.parse(useLocalSearchParams<{ examInputContent: string }>().examInputContent); // Get the exam input content from the URL

  // Check if the Continue button should be visible
  const isButtonVisible = examName.trim().length > 0;

  const imageDocuments = examInputContent.documents.filter(document => document.fileType === fileTypes.image);
  const textDocuments = examInputContent.documents.filter(document => document.fileType === fileTypes.text);

  const createSupabaseBucket = async () => {
    try {
      const data = await createBucket();
      setBucketName(data.name);
    } catch (error) {
      console.error(`Bucket Creation Failed: ${error}`)
    } 
  };

  const handleContinue = () => {
    // Add logic to handle the continue button press (e.g., navigation)

    setLoading(true);
    setShouldContinue(true);


    // router.push({
    //     pathname: "/dashboard/exam",
    //     params: { examId: "10" },
    // });
  };

  useEffect(() => {
    if (imageDocuments.length > 0 && shouldContinue) {
      setText("Creating Bucket...");
      createSupabaseBucket();
    }

  }, [shouldContinue]);

  useEffect(() => {
    if (bucketName != "") {
      setText("Uploading Imagees...")
      uploadImagesToBucket(bucketName, imageDocuments)
      setText("Upload Images done!");
    }

  }, [bucketName]);


  return (
    <View style={{ flex: 1 }}>
    <View className="p-4 pt-9">
      <View>
        <Text className="text-3xl font-bold">Just a few more steps!</Text>

        <Text className="flex w-full justify-left text-left pb-2 text-xl text-gray-500">
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
      <Label nativeID="gradeLevel" className="flex w-full justify-left text-left">
        Grade Level
      </Label>
      <Text className="pb-2 text-gray-500">adjusts difficulty based on your level</Text>
      <View className="pb-7">
        <Input className="w-full" nativeID="gradeLevel" />
        
      </View>

      {/* Additional Notes */}
      <Label nativeID="additionalNotes" className="flex w-full justify-left text-left">
        Additional Instructions
      </Label>
      <Text className="pb-2 text-gray-500">how you want your test to be structured and answered</Text>
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
