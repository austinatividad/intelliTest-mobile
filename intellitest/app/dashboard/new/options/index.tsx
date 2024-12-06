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
import { createBucket, insertExam, uploadImagesToBucket } from "@/utils/supabaseQueries";
import ExtractBase64Images from "@/utils/pdfUtil";

import { generateExam } from "@/utils/promptList";

import { extractImageBase64Values } from "@/utils/imageUtil";

import { ExamSchema } from "@/utils/types";
import { z } from "zod";

export default function Index() {
  const router = useRouter();
  const { setLoading, setText } = useLoadingContext();
  const [examName, setExamName] = useState(""); // State to track exam name input
  const [bucketName, setBucketName] = useState("");
  const [shouldContinue, setShouldContinue] = useState(false);

  const [startExtraction, setStartExtraction] = useState(false); // Controls when extraction starts
  const [extractedIMGfromPDF, setExtractedIMGfromPDF] = useState([]); // Stores extracted images

  const [exam, setExam] = useState<z.infer<typeof ExamSchema> | undefined>(undefined);
  const [examId, setExamId] = useState("");

  const examInputContent : ExamInputContent = JSON.parse(useLocalSearchParams<{ examInputContent: string }>().examInputContent); // Get the exam input content from the URL

  // Check if the Continue button should be visible
  const isButtonVisible = examName.trim().length > 0;

  const imageDocuments = examInputContent.documents.filter(document => document.fileType === fileTypes.image);
  const textDocuments = examInputContent.documents.filter(document => document.fileType === fileTypes.text);
  const textDocumentURL = textDocuments.map(doc => doc.uri)
  const imageDocArr = imageDocuments
  // const createSupabaseBucket = async () => {
  //   try {
  //     const data = await createBucket();
  //     setBucketName(data.name);
  //   } catch (error) {
  //     console.error(`Bucket Creation Failed: ${error}`)
  //   } 
  // };

  const handleContinue = () => {
    // Add logic to handle the continue button press (e.g., navigation)

    setLoading(true);
    setShouldContinue(true);
    setText("Generating Exam");

    // router.push({
    //     pathname: "/dashboard/exam",
    //     params: { examId: "10" },
    // });
  };

  //TODO: make a useEffect for making generating an exam prompt, adding results to supabase, and redirecting to examId generated.
  useEffect(() => {
    if (shouldContinue) {
      setText("Creating Exam...");
  
      async function generateExamGPT() {
        console.log("Input Text");
        console.log(examInputContent.inputText);
        try {
          const exam = await generateExam(
            examInputContent.inputText,
            extractImageBase64Values(imageDocuments)
          );

          exam.exam_name = examName;
          
          console.log(exam);
          setExam(exam); // Set the exam directly
        } catch (error: any) {
          console.error("Error generating exam:", error);
          setText("Error generating the exam. Please try again.");
        }
      }
  
      generateExamGPT();
    }
  }, [shouldContinue]);

  useEffect(() => {
    if (exam) {
      setText("Uploading Exam to Database...");

      async function uploadExam() {
        if (exam == undefined) return;
        try {
          var result = await insertExam(exam);
          if (result) {
            console.log(`Exam ID: ${result}`);
            setExamId(result);
          } else {
  
            //TODO: ERROR HANDLING HERE
            setText("ERROR UPLOADING TO DATABASE");
          }
        } catch (error:any) {
          console.log(error);
          setLoading(false);
        }

      }

      uploadExam();
    }
  }, [exam]);

  useEffect(() => {
    if (examId) {
      setText("Redirecting to Exam...");
      router.push({
          pathname: "/dashboard/exam",
          params: { examId: examId },
      });

    } 
  }, [examId])
  // useEffect(() => {
  //   if (imageDocuments.length > 0 && shouldContinue) {
  //     setText("Creating Bucket...");
  //     //createSupabaseBucket();
  //   }

  // }, [shouldContinue]);

  // useEffect(() => {
  //   if (bucketName != "") {
  //     setText("Uploading Imagees...")
  //     uploadImagesToBucket(bucketName, imageDocuments)
  //     setText("Upload Images done!");
  //   }

  // }, [bucketName]);

  // useEffect(() => {
  //   if (textDocuments.length > 0) {
  //     textDocuments.map(async (file) => {
  //       setText("Converting PDFs to Images...")
  //       const b64Array = await convertPDFtoImageBase64(file.uri);

  //     })
  //   }
  // }, [])

  const handleImagesExtracted = (extractedImages: any) => {
    setText('Extracting Images');
    setExtractedIMGfromPDF(extractedImages); // Save extracted images to state
    setStartExtraction(false); // Reset extraction flag after completion
    console.log('Extracted Images:', extractedImages);
  };
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

    {startExtraction && (
      <ExtractBase64Images
        pdfUrls={textDocumentURL}
        onImagesExtracted={(images) => {
          console.log('All PDFs Processed:');
          console.log(images); // Logs all extracted images
          }
        }

/>
    )}
</View>
  );
}
