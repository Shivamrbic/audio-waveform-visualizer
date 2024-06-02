import React, { useEffect, useRef, useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { Svg, Polyline } from "react-native-svg";

export default function VisualizerScreen({ route }) {
  const { file } = route.params;
  const sound = useRef(new Audio.Sound());
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveform, setWaveform] = useState([]);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    return () => {
      sound.current.unloadAsync();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateWaveform();
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const playPauseAudio = async () => {
    if (isPlaying) {
      await sound.current.pauseAsync();
    } else {
      await sound.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const loadSound = async () => {
    try {
      await sound.current.loadAsync({ uri: file.uri });
      sound.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsPlaying(false);
      setPosition(0);
      sound.current.setPositionAsync(0);
    } else if (status.isPlaying) {
      setPosition(status.positionMillis);
    }
  };

  const updateWaveform = async () => {
    if (isPlaying) {
      const status = await sound.current.getStatusAsync();
      const waveformPoints = generateWaveform(status);
      setWaveform(waveformPoints);
    }
  };

  const generateWaveform = (status) => {
    const length = 50; // Number of points in the waveform
    const waveform = [];
    for (let i = 0; i < length; i++) {
      waveform.push({ x: i * 2, y: Math.random() * 50 });
    }
    return waveform;
  };

  useEffect(() => {
    loadSound();
  }, []);

  const colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#00ffff",
    "#ff00ff",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.fileName}>Playing: {file.name}</Text>
      {waveform.length > 0 && (
        <Svg
          height="200"
          width="100%"
          viewBox="0 0 100 50"
          style={styles.visualizer}
        >
          {waveform.map((point, index) => (
            <Polyline
              key={index}
              points={`${point.x},50 ${point.x},${50 - point.y}`}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth="2"
            />
          ))}
        </Svg>
      )}
      <Button title={isPlaying ? "Pause" : "Play"} onPress={playPauseAudio} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#121212",
  },
  fileName: {
    fontSize: 16,
    color: "white",
    marginBottom: 20,
  },
  visualizer: {
    height: 200,
    width: "100%",
    marginBottom: 20,
  },
});
