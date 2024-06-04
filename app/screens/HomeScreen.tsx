import React, { useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";

interface File {
  uri: string;
  name: string;
}

interface Props {
  navigation: any;
}
type DocumentPickerAsset = {
  name: string;
  size?: number | undefined;
  uri: string;
  mimeType?: string | undefined;
  lastModified?: number | undefined;
  file?: globalThis.File | undefined;
};

export default function HomeScreen({ navigation }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const pickDocument = async () => {
    const result: DocumentPicker.DocumentPickerResult | null = await DocumentPicker.getDocumentAsync(
      {}
    );
    if (result.assets && result.assets?.length > 0) {
      const assets: DocumentPickerAsset | null = result.assets[0];
      console.log("result", result);

      if (assets.uri.endsWith(".mp3")) {
        setFile(assets);
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
