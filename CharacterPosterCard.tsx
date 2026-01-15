import React from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';

export default function CharacterPosterCard() {
const images = [
  "https://images1.wionews.com/images/wion/900x1600/2023/8/10/1691666020586_MonkeyD.LuffyAnimePostTimeskipInfobox.webp",
  "https://i.pinimg.com/736x/3c/17/13/3c171372e2ef27248f5f99e66231e1d9.jpg",
  "https://r1.ilikewallpaper.net/iphone-12-pro-max-wallpapers/download-109421/goku-ultra-instinct.jpg",
  "https://wallpapers-clan.com/wp-content/uploads/2025/06/ichigo-red-mode-bleach-anime-wallpaper.jpg",
  "https://i.pinimg.com/736x/03/b7/41/03b741d35b9cc1c4707c67d1f7f42d03.jpg",
];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={[
              styles.imageContainer,
              index % 2 === 0 ? styles.evenImage : styles.oddImage,
            ]}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 10,
    margin: 10,
  },
  imageContainer: {
    width: 100,
    height: 300,
    marginRight: 10,
  },
  evenImage: {
    marginTop: 0, // 50px above
  },
  oddImage: {
    marginTop: 30, // pushed down
  },
});
