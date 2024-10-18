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
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Text>This is a test page</Text>
      <Text>Exam ID: {examId} </Text>
      <Text>Exam Name: {exam?.examName} </Text>
      <Text>Exam Status: {exam?.examStatus} </Text>
      <Text></Text>
    </View>
  );
}
