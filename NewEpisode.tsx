import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Text,
} from "react-native";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = 120;
const IMAGE_HEIGHT = 160;
const LIST_HEIGHT = IMAGE_HEIGHT + 20;
const SPACING = 12;

const DATA = [
  {
    id: "1",
    title: "My Hero Academia",
    subtitle: "S6 E22 · Friend",
    image:
      "https://www.pngarts.com/files/10/Deku-Full-Body-PNG-Image-Transparent-Background.png",
    bg: "#FFA94D",
  },
  {
    id: "2",
    title: "Demon Slayer",
    subtitle: "S3 E5 · Swordsmith",
    image:
      "https://i.pinimg.com/originals/29/b1/c7/29b1c741a6e654fd5a66044f41b0abdf.png",
    bg: "#FFE066",
  },
];

export default function App() {
  return (
    <View>
      {/* Tall wrapper so overflow stays visible */}
      <View style={{ height: LIST_HEIGHT }}>
        <FlatList
          data={DATA}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          removeClippedSubviews={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            alignItems: "flex-end",
          }}
          ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                { width: CARD_WIDTH, backgroundColor: item.bg },
              ]}
            >
              {/* Text content */}
              <View style={styles.textContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>✨ New Episode!</Text>
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>

              {/* Floating character */}
              <Image
                source={{ uri: item.image }}
                style={styles.character}
                resizeMode="contain"
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    height: CARD_HEIGHT,
    borderRadius: 16,
    padding: 16,
  },

  textContainer: {
    width: "65%",
  },

  badge: {
    backgroundColor: "#FFF3BF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 6,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
  },

  character: {
    position: "absolute",
    right: 10,
    bottom: 0,
    width: 120,
    height: IMAGE_HEIGHT,
  },
});
