import TrackPlayer, { 
  usePlaybackState, 
  useProgress, 
  useTrackPlayerEvents,
  Event,
  State, 
  Capability,
  RepeatMode
} from "react-native-track-player";
import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  PanResponder
} from "react-native";

const { width } = Dimensions.get("window");

export async function setupPlayer() {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
            Capability.SeekTo,
        ],
    });
}

// Format time helper
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function MusicPlayer() {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);

  // Sample tracks
  const tracks = [
    {
      id: "1",
      title: "Sample Song 1",
      artist: "Unknown Artist",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      artwork: "https://picsum.photos/300",
    },
    {
      id: "2",
      title: "Sample Song 2",
      artist: "Unknown Artist",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      artwork: "https://picsum.photos/301",
    },
    {
      id: "3",
      title: "Sample Song 3",
      artist: "Unknown Artist",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      artwork: "https://picsum.photos/302",
    },
  ];

  // Listen to track changes
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setCurrentTrack(track);
    }
  });

  useEffect(() => {
    async function init() {
      await TrackPlayer.reset();
      await TrackPlayer.add(tracks);
      const track = await TrackPlayer.getTrack(0);
      setCurrentTrack(track);
    }
    init();
  }, []);

  const playPause = async () => {
    if (playbackState.state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
  };

  const skipToPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const seekTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  // Progress bar drag handling
  const progressBarRef = useRef<View>(null);
  const progressBarLayoutRef = useRef({ x: 0, width: 0 });
  const progressRef = useRef(progress);
  const seekToRef = useRef(seekTo);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const targetPositionRef = useRef<number | null>(null);

  // Update refs when values change
  useEffect(() => {
    progressRef.current = progress;
    
    // If we have a target position and progress has caught up, clear dragging state
    if (targetPositionRef.current !== null && !isDragging) {
      const diff = Math.abs(progress.position - targetPositionRef.current);
      if (diff < 0.5) { // Within 0.5 seconds, consider it caught up
        targetPositionRef.current = null;
      }
    }
  }, [progress, isDragging]);

  useEffect(() => {
    seekToRef.current = seekTo;
  }, []);

  // Calculate current position - use drag position if dragging or waiting for seek to complete
  const currentPosition = (isDragging || targetPositionRef.current !== null) 
    ? dragPosition 
    : progress.position;
  const currentProgressPercentage = progress.duration > 0 
    ? (currentPosition / progress.duration) * 100 
    : 0;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        targetPositionRef.current = null; // Clear any previous target
        setIsDragging(true);
        const { pageX } = evt.nativeEvent;
        const layout = progressBarLayoutRef.current;
        const currentProgress = progressRef.current;
        
        if (currentProgress.duration && currentProgress.duration > 0) {
          const containerWidth = layout.width > 0 ? layout.width : width * 0.9 - 100;
          const containerX = layout.x;
          const relativeX = pageX - containerX;
          const clampedX = Math.max(0, Math.min(relativeX, containerWidth));
          const percentage = clampedX / containerWidth;
          const newPosition = percentage * currentProgress.duration;
          const clampedPosition = Math.max(0, Math.min(newPosition, currentProgress.duration));
          setDragPosition(clampedPosition);
        }
      },
      onPanResponderMove: (evt) => {
        const { pageX } = evt.nativeEvent;
        const layout = progressBarLayoutRef.current;
        const currentProgress = progressRef.current;
        
        if (currentProgress.duration && currentProgress.duration > 0) {
          const containerWidth = layout.width > 0 ? layout.width : width * 0.9 - 100;
          const containerX = layout.x;
          const relativeX = pageX - containerX;
          const clampedX = Math.max(0, Math.min(relativeX, containerWidth));
          const percentage = clampedX / containerWidth;
          const newPosition = percentage * currentProgress.duration;
          const clampedPosition = Math.max(0, Math.min(newPosition, currentProgress.duration));
          setDragPosition(clampedPosition);
        }
      },
      onPanResponderRelease: (evt) => {
        const { pageX } = evt.nativeEvent;
        const layout = progressBarLayoutRef.current;
        const currentProgress = progressRef.current;
        const currentSeekTo = seekToRef.current;
        
        if (currentProgress.duration && currentProgress.duration > 0) {
          const containerWidth = layout.width > 0 ? layout.width : width * 0.9 - 100;
          const containerX = layout.x;
          const relativeX = pageX - containerX;
          const clampedX = Math.max(0, Math.min(relativeX, containerWidth));
          const percentage = clampedX / containerWidth;
          const newPosition = percentage * currentProgress.duration;
          const clampedPosition = Math.max(0, Math.min(newPosition, currentProgress.duration));
          
          // Store target position and keep showing drag position until progress catches up
          targetPositionRef.current = clampedPosition;
          setDragPosition(clampedPosition);
          setIsDragging(false);
          currentSeekTo(clampedPosition);
        } else {
          setIsDragging(false);
        }
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const toggleRepeat = async () => {
    const modes: RepeatMode[] = [RepeatMode.Off, RepeatMode.Track, RepeatMode.Queue];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
    await TrackPlayer.setRepeatMode(nextMode);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case RepeatMode.Track:
        return require("./assets/repeate-one.png");
      case RepeatMode.Queue:
        return require("./assets/repeate-music.png");
      default:
        return require("./assets/repeat.png");
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: currentTrack?.artwork || "https://picsum.photos/300" }} 
        style={styles.image} 
      />
      <Text style={styles.title}>{currentTrack?.title || "No Track"}</Text>
      <Text style={styles.artist}>{currentTrack?.artist || "Unknown Artist"}</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
        <View
          ref={progressBarRef}
          onLayout={(e) => {
            const { x, width } = e.nativeEvent.layout;
            progressBarLayoutRef.current = { x, width };
          }}
          style={styles.progressBarContainer}
          {...panResponder.panHandlers}
        >
          <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${currentProgressPercentage}%` }
                ]} 
              />
              <View 
                style={[
                  styles.progressBarThumb,
                  { left: `${currentProgressPercentage}%` }
                ]} 
              />
            </View>
          </View>
        </View>
        <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={skipToPrevious}
        >
          <Image 
            source={require("./assets/previous.png")} 
            style={[styles.controlIcon, styles.iconImage]} 
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.playPauseButton} 
          onPress={playPause}
        >
          <Image 
            source={playbackState.state === State.Playing 
              ? require("./assets/pause.png")
              : require("./assets/play.png")
            } 
            style={styles.playPauseIconImage} 
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={skipToNext}
        >
          <Image 
            source={require("./assets/next.png")} 
            style={[styles.controlIcon, styles.iconImage]} 
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  image: { 
    width: 250, 
    height: 250, 
    borderRadius: 125,
    marginBottom: 20,
    backgroundColor: "#333",
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  artist: { 
    color: "#999", 
    marginBottom: 30,
    fontSize: 16,
  },
  progressContainer: {
    width: width * 0.9,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  progressBarContainer: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    justifyContent: "center",
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: "#666",
    borderRadius: 2,
    position: "relative",
  },
  progressBarFill: {
    height: 4,
    backgroundColor: "#FFD700",
    borderRadius: 2,
    position: "absolute",
    left: 0,
  },
  progressBarThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFD700",
    position: "absolute",
    top: -4,
    marginLeft: -6,
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
    minWidth: 40,
    textAlign: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.9,
  },
  controlButton: {
    padding: 15,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  controlIcon: {
    width: 28,
    height: 28,
  },
  iconImage: {
    tintColor: "#fff",
  },
  activeControlImage: {
    tintColor: "#FFD700",
  },
  playPauseButton: {
    padding: 20,
    marginHorizontal: 15,
    backgroundColor: "#FFD700",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  playPauseIconImage: {
    width: 32,
    height: 32,
    tintColor: "#000",
  },
});
