import React, { useEffect, useRef, useState } from "react";
import { Button, Text, View, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";

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
    const length = 50; // Number of bars in the waveform
    const waveform = [];
    for (let i = 0; i < length; i++) {
      waveform.push(Math.random() * 100);
    }
    return waveform;
  };

  useEffect(() => {
    loadSound();
  }, []);

  const colors = [
    "#ff0000",
    "#ff7f00",
    "#ffff00",
    "#7fff00",
    "#00ff00",
    "#00ff7f",
    "#00ffff",
    "#007fff",
    "#0000ff",
    "#7f00ff",
    "#ff00ff",
    "#ff007f",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.fileName}>Playing: {file.name}</Text>
      {waveform.length > 0 && (
        <Svg
          height="200"
          width="100%"
          viewBox="0 0 100 100"
          style={styles.visualizer}
        >
          <Defs>
            <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {colors.map((color, index) => (
                <Stop
                  key={index}
                  offset={`${(index / colors.length) * 100}%`}
                  stopColor={color}
                  stopOpacity="1"
                />
              ))}
            </LinearGradient>
          </Defs>
          {waveform.map((height, index) => (
            <Rect
              key={index}
              x={index * 2}
              y={50 - height / 2}
              width="1"
              height={height}
              fill="url(#gradient)"
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
    backgroundColor: "#000",
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
