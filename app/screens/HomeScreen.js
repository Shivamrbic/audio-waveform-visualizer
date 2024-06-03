import React, { useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function HomeScreen({ navigation }) {
  const [file, setFile] = useState(null);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    console.log("result", result);
    if (result.assets?.length > 0) {
      if (result.assets[0].uri.endsWith(".mp3")) {
        setFile(result.assets[0]);
      } else {
        Alert.alert("Invalid File Type", "Please select an mp3 file.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an audio file" onPress={pickDocument} />
      {file && (
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>Selected File: {file.name}</Text>
          <Button
            title="Go to Visualizer"
            onPress={() => navigation.navigate("Visualizer", { file })}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  fileInfo: {
    marginTop: 20,
    alignItems: "center",
  },
  fileName: {
    fontSize: 16,
    marginBottom: 10,
  },
});
