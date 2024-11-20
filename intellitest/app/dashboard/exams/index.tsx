import { View, FlatList, NativeSyntheticEvent } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react-native";
import { useRouter } from "expo-router";
import { ExamItem } from "@/components/IntelliTest/Dashboard/exam-item";
import React from "react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import * as sq from "@/utils/supabaseQueries";
import {Search} from "lucide-react-native";
import { dummy, ItemData } from "@/lib/dummy_data";


export default function Index() {
  const router = useRouter();

  const { setLoading, setText } = useLoadingContext();
  const [searchText, setSearchText] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<string>();
  const [exams, setExams] = React.useState<sq.Exam[] | null>(null);


  React.useEffect(() => {
    async function getExams() {
      setLoading(true);
      const exams = await sq.getExams();
      setExams(exams ?? []);
      setLoading(false);
      console.log(exams);
    }
    getExams();
  }, [router]);

  const renderItem = ({ item }: {item: sq.Exam}) => {
    return (
        <View
          style={{ alignItems: 'center'}}
          className="w-full">
            <ExamItem examName={item.examName} examStatus={item.examStatus} id={item.id} score={item.score} totalScore={item.totalScore} onPress={handlePress}/>
        </View>
    )
  }

  function handlePress(id: string) {
    console.log(id);
    router.navigate({
      pathname: "/dashboard/exam",
      params: {examId: id}
    })
  }
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      
      <View className="w-full px-4 pt-12 mb-5 ">
          <Text className="text-3xl font-semibold mb-5">My Exams</Text>
          <InputWithIcon
              nativeID="search"
              //TODO: change color to reflect theme
              icon={<Search size={20} color={"black"}/>} // Pass your icon as a prop
              onChangeText={(text) => setSearchText(text)}
              value={searchText}
              placeholder="What are you looking for?"
          />
      </View>
      {/* Dummy Data */}
      <FlatList
      //TODO: change to actual data
        data={ exams }
        renderItem={ renderItem }
        className="w-full px-4"
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
    </View>
  );
}
