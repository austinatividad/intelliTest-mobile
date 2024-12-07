import React, { createContext, useState, useContext, useEffect } from "react";
import { StyleSheet, View } from 'react-native';

interface LoadingContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoadingContext = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoadingContext must be used within a LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  // useEffect(() => {
  //   if (!loading) {
  //     setText("");
  //   }
  // }, [loading]);

  return (
    <View style={styles.container}>
      <LoadingContext.Provider value={{ loading, setLoading, text, setText }}>
        {children}
      </LoadingContext.Provider>
    </View>

    

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fills the entire screen
    backgroundColor: "white", // Sets the background to white
  },
});
