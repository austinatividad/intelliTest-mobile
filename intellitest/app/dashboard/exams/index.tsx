import { View, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react-native";
import { useRouter } from "expo-router";
import { ExamItem } from "@/components/IntelliTest/Dashboard/exam-item";
import React from "react";
import { InputWithIcon } from "@/components/ui/input-with-icon";

import {Search} from "lucide-react-native";

const DUMMY_DATA = [
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
    {
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed",
    },
]

export default function Index() {
  const router = useRouter();

  const { setLoading, setText } = useLoadingContext();
  const [searchText, setSearchText] = React.useState('');
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >

        <View className="w-11/12">
            <InputWithIcon
                nativeID="search"
                //TODO: change color to reflect theme
                icon={<Search size={20} color={"black"}/>} // Pass your icon as a prop
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
                placeholder="Search"
            />
        </View>
      {/* Dummy Data */}
      <FlatList
        data={DUMMY_DATA}
        renderItem={({item}) =>         
                <View style={{ alignItems: 'center'}}>
                    <ExamItem examName={item.examName} examStatus={item.examStatus} />
                </View>
        }
        className="w-full"
      >

      </FlatList>



    </View>
  );
}
