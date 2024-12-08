import { View, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ExamItem } from "@/components/IntelliTest/Dashboard/exam-item";
import React, { useEffect } from "react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { BackHandler } from "react-native";

import {Search} from "lucide-react-native";

import { dummy, ItemData } from "@/lib/dummy_data";
import * as sq from "@/utils/supabaseQueries";


export default function Index() {
  const router = useRouter();

  const { setLoading, setText } = useLoadingContext();
  const [searchText, setSearchText] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<string>();
  const [exam, setExam] = React.useState<sq.Exam | null>(null);
  const examIdParam = useLocalSearchParams()["examId"];
  const examId = Array.isArray(examIdParam) ? examIdParam[0] : examIdParam;

  useEffect(() => {
    async function getExam() {
      setLoading(true);
      const exam = await sq.getExam(examId);
      //throw error if exam is null
      if (!exam) {
        setText("Exam not found");
        setLoading(false);
        return;
      }
      setExam(exam);
      setLoading(false);
      console.log(exam)
    }
    getExam();
  }, [router]);

  const handlePress = () => {
    console.log("Pressed")
    router.navigate({
      pathname: "/dashboard/exam/" + examId ,
      params: {questionNumber: 1}

    })
  }


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

  const handleAttemptView = async () => {
    console.log("Pressed")

    const attemptID = await sq.getLatestAttemptID(examId)

    router.navigate({
      pathname: "/dashboard/exam/" + examId + "/results",
      params: {attemptID: attemptID.id}
    })
  }
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View className="p-4 pt-9">
        <Text className="text-3xl font-bold">{exam?.exam_name}</Text>
        <Text className="text-xl font-semi-bold text-gray-500 mb-4">{exam?.exam_description}</Text>
        <Text className="text-2xl font-semibold mb-4">{exam?.status}</Text>

        {/* Exam Parts */}
        {exam && (
          <>
            <Text className="text-3xl font-bold">Parts</Text>
            <Text className="text-xl font-semi-bold text-gray-500 mb-4">This test has {exam?.part?.length ?? 0} parts:</Text>
          </>
        )}
        
        {/* map examParts, list */}
        {exam?.part?.map((part, index) => {
          return (
            <View key={index} className="mb-4 pl-8">
              <Text className="text-2xl font-semibold">{part.part_name}</Text>
              <Text className="text-xl font-semibold text-gray-500">{part.part_description}</Text>
            </View>
          )
        } )}

        {exam?.status === "Completed" && (
          <View className="rounded bg-gray-100 p-4 ">
            {/* My Score */}
            <Text className="text-xl font-bold">My Latest Score</Text>
            {/* Attempt # */}
            <Text className="text-xl font-semi-bold text-gray-500 mb-4">Attempt {exam?.attempt_count}</Text>
            {/* Score */}
            <Text className="text-xl text-center font-semi-bold text-gray-500 mb-4">You scored {exam?.score ?? 0} out of {exam?.total_score ?? 0} points</Text>

            {/* view attempt button */}
            <Button variant="outline" className="mb-4" onPress={handleAttemptView}>
              <Text>View Latest Attempt</Text>
            </Button>
          </View>
        )}
         
      </View>

      <View
        className="w-full"
        style={{
            bottom: 0,
            position: "absolute",
            padding: 10,
        }}
        >
    <Button variant="default" className="mb-4" onPress={handlePress}>
            <Text className="text-white">Ready? Take the test!</Text>
        </Button>
        </View>
    </View>
  );
}
