
import { NotebookText, DiamondPlus} from 'lucide-react-native';
import { View, Text, TouchableOpacity } from 'react-native';


import React from 'react'
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';






const GenerateButton: React.FC = () => {
    const router = useRouter(); 
    const handleGenerateTest = () => {
        router.push("/dashboard/new");
    };
  return (
    <View className="">
        <Button size={null} className="justify-center text-left" onPress={handleGenerateTest}>
        <View className="flex flex-row gap-4 p-8 text-green-400">
            <DiamondPlus size={48} color="#4ade80" />

            <View className="flex flex-col justify-center ">
            <Text className="font-semibold text-white">Generate a Mock Test</Text>
            <Text className="font-semibold text-gray-200">with cutting-edge AI</Text>
            </View>
        </View>
        </Button>
    </View>
  )
}

export { GenerateButton }