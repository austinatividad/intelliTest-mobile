import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type ExamItemProps = {
  examName: string;
  examStatus: string;
  onPress?: () => void; // Optional onPress handler
};

const ExamItem: React.FC<ExamItemProps> = ({ examName, examStatus, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="w-11/12 mt-5 p-4 bg-white rounded-lg border border-gray-300">
      <View>
        <Text className="text-lg text-black font-bold">{examName}</Text>
        <Text className="text-base text-gray-500">{examStatus}</Text>
      </View>
    </TouchableOpacity>
  );
};

export { ExamItem };
