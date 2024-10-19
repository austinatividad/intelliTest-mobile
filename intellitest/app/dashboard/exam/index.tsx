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


export default function Index() {
  const router = useRouter();

  const { setLoading, setText } = useLoadingContext();
  const [searchText, setSearchText] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<string>();

  const { examId }  = useLocalSearchParams();

  const exam = dummy.find((item) => item.id == examId)
  if (exam == undefined)
  {
    //TODO: redirect to 404
    //? Probably not needed for a mobile app
  }

  const handlePress = () => {
    console.log("Pressed")
    router.navigate({
      pathname: "/dashboard/exam/" + examId ,
      params: {questionNumber: 1}

    })
  }
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View className="p-4">
        <Text className="text-3xl font-bold">{exam?.examName}</Text>
        <Text className="text-xl font-semi-bold text-gray-500 mb-4">{exam?.examDescription}</Text>
        <Text className="text-2xl font-semibold mb-4">{exam?.examStatus}</Text>

        {/* Exam Parts */}
        <Text className="text-3xl font-bold">Parts</Text>

        
        <Text className="text-xl font-semi-bold text-gray-500 mb-4">This test has {exam?.examParts?.length ?? 0} parts:</Text>
        {/* map examParts, list */}
        {exam?.examParts?.map((part, index) => {
          return (
            <View key={index} className="mb-4 pl-8">
              <Text className="text-2xl font-semibold">{part.partName}</Text>
              <Text className="text-xl font-semibold text-gray-500">{part.partDescription}</Text>
            </View>
          )
        } )}

        <View className="rounded bg-gray-100 p-4 ">
          {/* My Score */}
          <Text className="text-3xl font-bold">My Score</Text>
          {/* Attempt # */}
          <Text className="text-xl font-semi-bold text-gray-500 mb-4">Attempt {exam?.attemptCount}</Text>
          {/* Score */}
          <Text className="text-xl text-center font-semi-bold text-gray-500 mb-4">You scored {exam?.examScore ?? 0} out of {exam?.examTotalScore ?? 0} points</Text>
        </View>
         
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
