import { View, Image, StyleSheet } from "react-native";

function AnimeCard({ cuts = [] }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://wuwatracker.com/_next/image?url=%2Fapi%2Fcharacter-portraits%2Ffile%2Fcartethyia.webp&w=1080&q=75",
          }}
          style={styles.image}
        />
      </View>

      {/* Render cuts dynamically */}
      {cuts.map((cut) => (
        <View key={cut} style={[styles.cut, styles[cut]]} />
      ))}
    </View>
  );
}

const BG = "#0b0f1a";
const SCREEN_BG = "#ffffff";

const styles = StyleSheet.create({
  wrapper: {
    width: 160,
    height: 260,
  },

  card: {
    width: "100%",
    height: "100%",
    backgroundColor: BG,
    borderRadius: 20,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  cut: {
    position: "absolute",
    width: 70,
    height: 70,
    backgroundColor: SCREEN_BG,
    transform: [{ rotate: "45deg" }],
  },

  topLeft: {
    top: -35,
    left: -35,
  },

  topRight: {
    top: -35,
    right: -35,
  },

  bottomLeft: {
    bottom: -35,
    left: -35,
  },

  bottomRight: {
    bottom: -35,
    right: -35,
  },
});
