import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
  Pressable,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.8;
const SIDE_SPACING = width * 0.1;
const ITEM_MARGIN = 5;

export default function VideoPlayer() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      {/* HERO */}
      <HeroBanner />

      {/* MID RAIL */}
      <MidRailBanner />

      {/* SECTIONS */}
      <AnimeRail title="Top Hits" />
      <AnimeRail title="New Episodes Releases" />
      <AnimeRail title="Best of All Times" />
    </ScrollView>
  );
}

/* ================= HERO ================= */

function HeroBanner() {
  const animeNames = ["One Punch Man", "Dandadan", "Attack on Titan"];
  const imageArray = [
    "https://qqcdnpictest.mxplay.com/pic/1910b42303739c5d7dd52ffb9e6fefba/en/16x9/1600x900/test_pic1746016971303.jpg",
    "https://people.com/thmb/LaPCKkXHIQBY3cc23z64O14BhVo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/dandadan-characters-1-071825-807ccc66d6d945c78d711b664a70266f.jpg",
    "https://m.media-amazon.com/images/S/pv-target-images/c4a482851a80ece7b6c052de1a9109a11dfa7714e58a6b60184bc2b59ecd7e21._SX1080_FMjpg_.jpg",
  ];

  return (
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
      {imageArray.map((item, index) => (
        <View key={index} style={styles.heroItem}>
          <Image source={{ uri: item }} style={styles.heroImage} />
          <View style={styles.overlay}>
            <Text style={styles.heroTitle}>{animeNames[index]}</Text>
            <Pressable style={styles.playButton}>
              <Text style={styles.playText}>▶ Play</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

/* ================= MID RAIL (INFINITE) ================= */

function MidRailBanner() {
  const images = [
    "https://qqcdnpictest.mxplay.com/pic/1910b42303739c5d7dd52ffb9e6fefba/en/16x9/1600x900/test_pic1746016971303.jpg",
    "https://people.com/thmb/LaPCKkXHIQBY3cc23z64O14BhVo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/dandadan-characters-1-071825-807ccc66d6d945c78d711b664a70266f.jpg",
    "https://m.media-amazon.com/images/S/pv-target-images/c4a482851a80ece7b6c052de1a9109a11dfa7714e58a6b60184bc2b59ecd7e21._SX1080_FMjpg_.jpg",
  ];

  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const loopData = [...images, ...images, ...images];
  const startIndex = images.length;
  
  // Item width + margins (5px on each side = 10px total)
  const ITEM_SPACING = ITEM_WIDTH + (ITEM_MARGIN * 2);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        x: SIDE_SPACING + startIndex * ITEM_SPACING,
        animated: false,
      });
    }, 100);
  }, [startIndex, ITEM_SPACING, SIDE_SPACING]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    // Account for left spacer when calculating index
    const adjustedOffset = Math.max(0, offsetX - SIDE_SPACING);
    const currentIndex = Math.round(adjustedOffset / ITEM_SPACING);
    const actualIndex = currentIndex % images.length;
    setIndex(actualIndex);

    // Jump to equivalent position in middle section for infinite scroll
    if (currentIndex < images.length) {
      scrollRef.current?.scrollTo({
        x: SIDE_SPACING + (currentIndex + images.length) * ITEM_SPACING,
        animated: false,
      });
    } else if (currentIndex >= images.length * 2) {
      scrollRef.current?.scrollTo({
        x: SIDE_SPACING + (currentIndex - images.length) * ITEM_SPACING,
        animated: false,
      });
    }
  };

  return (
    <View style={{ marginVertical: 20 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        snapToInterval={ITEM_SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
      >
        {/* Left spacer for peek effect */}
        <View style={{ width: SIDE_SPACING }} />
        {loopData.map((item, idx) => (
          <View key={idx} style={{ width: ITEM_SPACING, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={{ uri: item }} style={styles.midRailImage} />
          </View>
        ))}
        {/* Right spacer for peek effect */}
        <View style={{ width: SIDE_SPACING }} />
      </ScrollView>

      {/* DOTS */}
      <View style={styles.dots}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              index === i && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

/* ================= RAIL ================= */

interface AnimeRailProps {
  title: string;
}

function AnimeRail({ title }: AnimeRailProps) {
  const imageArray = [
    "https://qqcdnpictest.mxplay.com/pic/1910b42303739c5d7dd52ffb9e6fefba/en/16x9/1600x900/test_pic1746016971303.jpg",
    "https://people.com/thmb/LaPCKkXHIQBY3cc23z64O14BhVo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/dandadan-characters-1-071825-807ccc66d6d945c78d711b664a70266f.jpg",
    "https://m.media-amazon.com/images/S/pv-target-images/c4a482851a80ece7b6c052de1a9109a11dfa7714e58a6b60184bc2b59ecd7e21._SX1080_FMjpg_.jpg",
  ];

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.hitCardText}>{title}</Text>
        <Text style={styles.seeAllText}>See All</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {imageArray.map((item, index) => (
          <Image key={index} source={{ uri: item }} style={styles.hitCards} />
        ))}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  heroItem: { width, height: 340 },
  heroImage: { width: "100%", height: "100%" },

  overlay: { position: "absolute", bottom: 24, left: 16 },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "600" },

  playButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    width: 90,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },

  playText: { fontWeight: "700" },

  midRailImage: {
    width: ITEM_WIDTH,
    height: 180,
    borderRadius: 12,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#000",
    width: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 14,
  },

  hitCardText: { fontSize: 20, fontWeight: "bold" },
  seeAllText: { color: "red", fontWeight: "600" },

  hitCards: {
    width: 150,
    height: 200,
    marginHorizontal: 8,
    borderRadius: 10,
  },
});
