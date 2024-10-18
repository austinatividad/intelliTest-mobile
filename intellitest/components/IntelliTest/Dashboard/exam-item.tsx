import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type ExamItemProps = {
  examName: string;
  examStatus: string;
  id: string; // The id for each exam
  onPress: (id: string) => void; // Function that will handle the press event and take the id as an argument
};
const ExamItem: React.FC<ExamItemProps> = ({ examName, examStatus, id, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(id)} className="w-11/12 mt-5 p-4 bg-white rounded-lg border border-gray-300">
      <View>
        <Text className="text-lg text-black font-bold">{examName}</Text>
        <Text className="text-base text-gray-500">{examStatus}</Text>
      </View>
    </TouchableOpacity>
  );
};

export { ExamItem };
