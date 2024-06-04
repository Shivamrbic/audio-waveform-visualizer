import React, { useEffect, useRef, useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import {
  FinishMode,
  IWaveformRef,
  PlayerState,
  Waveform,
} from "@simform_solutions/react-native-audio-waveform";

interface RouteParams {
  file: {
    name: string;
    uri: string;
  };
}

interface Props {
  route: {
    params: RouteParams;
  };
}

export default function VisualizerScreen({ route }: Props) {
  const { file } = route.params;
  const [playerState, setPlayerState] = useState<PlayerState>(
    PlayerState.stopped
  );

  const ref = useRef<IWaveformRef>(null);

  useEffect(() => {
    return () => {
      if (ref.current) {
        ref.current?.stopPlayer();
      }
    };
  }, []);

  const handleButtonAction = () => {
    if (
      playerState === PlayerState.paused ||
      playerState === PlayerState.stopped
    ) {
      ref.current?.startPlayer({ finishMode: FinishMode.stop });
    } else {
      ref.current?.pausePlayer();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.fileName}>Playing: {file.name}</Text>
      <Waveform
        containerStyle={styles.staticWaveformView}
        mode="static"
        key={file.uri}
        ref={ref}
        path={file.uri}
        candleSpace={2}
        candleWidth={4}
        scrubColor={"white"}
        waveColor={"gray"}
        onPlayerStateChange={setPlayerState}
        onPanStateChange={(e) => console.log("onPanStateChange", e)}
        onError={(error) => {
          console.log(error, "we are in example");
        }}
      />
      <Button
        title={playerState === PlayerState.playing ? "Pause" : "Play"}
        onPress={handleButtonAction}
      />
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
  audioWaveform: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  staticWaveformView: {
    // flex: 1,
    height: 400,
    width: 300,
  },
});
