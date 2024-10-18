  import { View } from "react-native";
  import { Text } from "@/components/ui/text";
  import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
  import { Button } from "@/components/ui/button";
  import { Image } from "lucide-react-native";
  import { useRouter } from "expo-router";
  import React from "react";
  import { ScrollView } from "react-native";
  import { NotebookText } from "lucide-react-native";

  interface User {
    firstName:string;
    lastName:string;
    email: string;
  }


  interface Test {
    testName:string;
    userScore:number;
    testScore:number;

  }
  interface UserData {
    recentTests: Test[];
    recentScores: Test[];
  }


  //dummy user
  const user: User = {
    firstName: "Josh",
    lastName: "Natividad",
    email: "josh@gmail.com"
  }


  

  const test1: Test = {
    testName:"STINTSY Backpropagation Exam",
    userScore:30,
    testScore:30
  }

  const test2: Test = {
    testName:"CSOPESY Exam",
    userScore:30,
    testScore:30
  }
  const test3: Test = {
    testName:"Top 10 Japanese Food",
    userScore:80,
    testScore:100
  }
  const test4: Test = {
    testName:"Mister Donut Facts",
    userScore:-1,
    testScore:100
  }
  const test5: Test = {
    testName: "Pickup Coffee Test",
    userScore: -1,
    testScore: 10
  }

  const test6: Test = {
    testName: "Top 10 food of all time",
    userScore: -1,
    testScore: 10
  }

  const test7: Test = {
    testName: "MOBDEVE Android Concepts",
    userScore: -1,
    testScore: 30

  }

  //create a list for userTests
  const userTests: Test[] = [test4, test5, test6, test7];
  const userScores: Test[] = [test1, test2, test3,]



  const userData: UserData = {
    recentTests: userTests,
    recentScores: userScores
  }



  export default function Index() {
    const router = useRouter();
    const [firstName, setFirstName] = React.useState('');
    const { setLoading, setText } = useLoadingContext();

      React.useEffect(() => {
          if (user.firstName) {
          setFirstName(user.firstName);
          }
      }, [user.firstName]);


    const handleGenerateTest = () => {
      router.push("/dashboard/new");
    }
    return (
      <ScrollView
        style={{
          flex: 1,
        }}
      >
      <View className="p-10 pt-44 text-center items-center">
          <Text className="text-3xl">Hi, {firstName}! 👋</Text>
          <Text className="text-2xl text-gray-600">Lets get ready for our next test!</Text>
      </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}} className="w-full align-center pb-3">
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            <View className="">

              {/* TODO: Convert to a component  */}
              <Button size="lg" className="justify-center text-left" onPress={handleGenerateTest}>
                <View className="flex flex-row">
                  <NotebookText scale={30}/>

                  <View className="flex flex-col justify-center ">
                  <Text className="font-semibold">
                  Generate a Mock Test
                  </Text>
                  <Text className="font-semibold ">
                    with cutting-edge AI
                  </Text>
                  </View>
                  
                </View>
              </Button>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        </View>
        <Text className="pt-4 pl-4 font-bold text-xl mb-4">Latest Tests</Text>
        {userData.recentTests.map((test, index) => (
          // set onPress to router.push existing test
          <View key={index} className=" border rounded-xl mx-4 mb-2 p-2">
            <Text className="text-lg font-bold">{test.testName}</Text>
            <Text className="text-base">
              {/* Check if userScore is -1, if true display "NEW", otherwise display the score */}
              {test.userScore === -1 ? "NEW" : `${test.userScore}/${test.testScore}`}
            </Text>
          </View>
        ))}

      <Text className="pt-4 pl-4 font-bold text-xl mb-4">Latest Scores</Text>
        {/* TODO: CHANGE TO A FLATLIST  */}
        {userData.recentScores.map((test, index) => (
          // set onPress to router.push existing test
          <View key={index} className=" border rounded-xl mx-4 mb-2 p-2">
            <Text className="text-lg font-bold">{test.testName}</Text>
            <Text className="text-base">
              {/* Check if userScore is -1, if true display "NEW", otherwise display the score */}
              {test.userScore === -1 ? "NEW" : `${test.userScore}/${test.testScore}`}
            </Text>
          </View>
        ))}

        {/* extra view to add padding */}
      <View className="mb-28">
      </View>
      </ScrollView>
    );
  }
