import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Dimensions } from "react-native";
import { useRef, useEffect } from "react";


const { width, height } = Dimensions.get("window");
export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
      <View style={styles.container}>
        <MakeForYou />
        <TopSongCard />
        <FeaturedSongs />
        <CharacterSongCard />
        <AnimeGameSongs />
        <GenreCard />
      </View>
      </ScrollView>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}

const GenreCard = () => {
  const genres = [
    { name: "Rock", image: "https://yattatachi.com/wp-content/uploads/2025/02/bocchi-the-rock-1024x577.jpg" },
    { name: "Pop", image: "https://assets.telegraphindia.com/telegraph/2023/Aug/1692962108_oshi-no-ko.jpg" },
    { name: "Hip Hop", image: "https://static0.cbrimages.com/wordpress/wp-content/uploads/2019/10/5-samurai-champloo-Mugen-Jin-against-Japanese-rising-sun.jpg" },
    { name: "Jazz", image: "https://miro.medium.com/0*xQGjTpzZSSosSUG2.jpg" },
    { name: "Electronic", image: "https://i0.wp.com/chromaticdreamers.com/wp-content/uploads/2021/10/denkiguitar.jpg?fit=1280%2C720&ssl=1" },
    { name: "Classical", image: "https://b4105269.smushcdn.com/4105269/wp-content/uploads/2021/10/spirited-away.jpg?lossy=2&strip=1&webp=1" },
  ];

  return (
    <View style={styles.genreCardSection}>
      <Text style={styles.genreCardTitle}>Genre</Text>
      <View style={styles.genreCardWrapper}>
        {genres.map((genre, index) => (
          <View key={index} style={styles.genreCardContainer}>
            <Image source={{uri: genre.image}} style={styles.genreCardImage} />
            <Text style={styles.genreCardText}>{genre.name}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const MakeForYou = () => {
  const cards = Array.from({ length: 6 }, (_, i) => i);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAutoScrollingRef = useRef(false);
  const imagesUrl = ["https://www.joytify.com/blog/en-us/wp-content/uploads/2024/06/featured.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7jJbVlP_TtOScUwDCrE-aUPoNbKIat6hLmQ&s", 
    "https://static0.cbrimages.com/wordpress/wp-content/uploads/2023/05/how-well-does-the-mashle-anime-match-up-to-its-manga-source-material.jpg",
     "https://people.com/thmb/LaPCKkXHIQBY3cc23z64O14BhVo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/dandadan-characters-1-071825-807ccc66d6d945c78d711b664a70266f.jpg",
    "https://occ-0-8407-2219.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABdVyosBNChijdfQnnn-XROCxy0jFtfCtxl5_2CCTKbvC_wk4k2Cl3g0ufJ0yRmG40QALM76Gqc4150k1WaxAi3iQZSkwXNXw3_52.jpg?r=3bd",
  "https://i.ytimg.com/vi/xVI0MCi7HA4/maxresdefault.jpg"]
  const songNames = ["Gurenge","Suzume no Tojimari", "Bling-Bang-Bang-Born", "Otonoke", "the WORLD", "Blue Bird"]
  
  // Card width should match the section width exactly for paging
  const cardWidth = width * 0.9 + 10;
  
  // Function to start/reset the auto-scroll timer
  const startAutoScroll = () => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start new interval
    intervalRef.current = setInterval(() => {
      isAutoScrollingRef.current = true;
      const nextIndex = (currentIndexRef.current + 1) % cards.length;
      currentIndexRef.current = nextIndex;
      
      scrollViewRef.current?.scrollTo({
        x: nextIndex * cardWidth,
        y: 0,
        animated: true,
      });
      
      // Reset flag after animation
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 500);
    }, 5000);
  };
  
  // Initialize auto-scroll
  useEffect(() => {
    startAutoScroll();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cards.length, cardWidth]);
  
  // Handle manual scroll - reset timer
  const handleScrollEnd = (event: any) => {
    // Only reset if it was a manual scroll (not auto-scroll)
    if (!isAutoScrollingRef.current) {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / cardWidth);
      currentIndexRef.current = index;
      
      // Reset the timer
      startAutoScroll();
    }
  };

  return (
    <View style={styles.makeForYouSection}>
      <Text style={styles.makeForYouText}>Make For You</Text>
      <ScrollView 
        ref={scrollViewRef} 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        pagingEnabled={true}
        decelerationRate="fast"
        snapToInterval={cardWidth}
        snapToAlignment="start"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      >
        <View style={styles.makeForYouWrapper}>
          {cards.map((item, index) => (
            <View key={index} style={styles.makeForYouContainer}>
              <Image source={{uri: imagesUrl[index]}} style={styles.makeForYouImage} />
              <Text style={styles.makeForYouImageText}>{songNames[index]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const TopSongCard = () => {
  const cards = Array.from({ length: 10 }, (_, i) => i);
  const songUrl = ["https://i.scdn.co/image/ab67616d0000b2735eb01b29c4842b37ec1d7841",
     "https://m.media-amazon.com/images/M/MV5BYzM3ZGJkN2YtOTQ5Ny00MzEyLTlkMzQtZDVhYzM3YWFlM2QwXkEyXkFqcGc@._V1_.jpg",
    "https://m.media-amazon.com/images/M/MV5BZTI4ZGMxN2UtODlkYS00MTBjLWE1YzctYzc3NDViMGI0ZmJmXkEyXkFqcGc@._V1_.jpg",
  "https://www.fairytailgame.com/common/img/features_img01.jpg",
"https://i.pinimg.com/1200x/e4/c7/d0/e4c7d0514772931dbddb711a90601a00.jpg",
"https://m.media-amazon.com/images/M/MV5BMzIyNzY4NTMtNmVhYS00OWFhLTkwMWMtOGFkNTdmNWU2ZDdiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
"https://geemerch.com/cdn/shop/products/27033.jpg?v=1744928345",
"https://m.media-amazon.com/images/M/MV5BYjYxMWFlYTAtYTk0YS00NTMxLWJjNTQtM2E0NjdhYTRhNzE4XkEyXkFqcGc@._V1_.jpg",
"https://m.media-amazon.com/images/M/MV5BNTgzZWY0YmEtNTNlMy00YzU1LWI4NTUtYzBlNzQ0ODkzNzAwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
"https://img2.hulu.com/user/v3/artwork/f6451467-97a8-4ddf-9ae8-e9e4cbb53fc8?base_image_bucket_name=image_manager&base_image=bc1a1c50-6786-4cf7-ae75-75de958b64e1&size=458x687&format=webp"]
  const songNames = ["Mob Psycho 10", "Oshi No Ko", "Frieren", "Fairy Tail", "Full Metal Alchemist", "JoJo's Bizarre Adventure", "Banana Fish", "Haikyuu!!", "Steins;Gate", "Black Clover"]
  return (
    <View style={styles.topSongCardSection}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.topSongCardWrapper}>
          {cards.map((item, index) => (
            <View key={index} style={styles.topSongCardContainer}>
              <Image 
                source={{uri: songUrl[index]}} 
                style={styles.topSongCardImage} 
              />
              <Text style={styles.topSongCardText}>{songNames[index]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const FeaturedSongs = () => {
  return (
    <View style={styles.featuredSongsWrapper}>
      <Text style={styles.makeForYouText}>Featured Songs</Text>
      <View style={styles.makeForYouContainer}>
        <Image source={{uri: "https://latouchemusicale.com/wp-content/uploads/2022/07/your-lie-in-april-anime-piano.jpeg"}} style={styles.makeForYouImage} />
        <Text style={styles.featuredSongsText}>Feature Anime Audios</Text>
      </View>
    </View>
  );
}


const CharacterSongCard = () => {
  const characterSongCardImages  = ["https://static.wikitide.net/greatcharacterswiki/thumb/e/e1/Tanjiro_anime.png/640px-Tanjiro_anime.png", "https://static.wikia.nocookie.net/noragami/images/d/d3/Yato_%28Anime%29.png/revision/latest/scale-to-width-down/300?cb=20210312042918", "https://assets.altarofgaming.com/wp-content/uploads/2024/04/goku-ssgss-dragon-ball-fighterz-character-artwork-altar-of-gaming-2442-726x1024.png", "https://wallpapers.com/images/hd/one-piece-luffy-character-pose-p3p6kkgnhw9205zl-2.jpg", "https://pngfre.com/wp-content/uploads/1000111696.png", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5195ca32-8c3b-43d8-aee2-8002c1dc3e4e/dkit5vj-c9e3acf7-30a6-447b-9c61-ac52556c5c00.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi81MTk1Y2EzMi04YzNiLTQzZDgtYWVlMi04MDAyYzFkYzNlNGUvZGtpdDV2ai1jOWUzYWNmNy0zMGE2LTQ0N2ItOWM2MS1hYzUyNTU2YzVjMDAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.qvW1RzjSF1uVvyOX0T5-0wWxA98nfzoWfu2gZj5eHsI", "https://pngfre.com/wp-content/uploads/anime-png-image-pngfre-35.png", "https://wallpapers.com/images/hd/rei-ayanami-evangelion-character-pjo76h60hxabbhtj-2.jpg", "https://freepngimg.com/save/31999-kaneki-ken-free-download/477x795", "https://a.storyblok.com/f/178900/800x1600/fe6dba6092/1_jinwoo.png/m/filters:quality(95)format(webp)", "https://anime-dandadan.com/_assets/images/char/detail/ken_pc.png", "https://static.wikia.nocookie.net/sakamoto-days/images/3/37/Shin_Asakura_anime_design.png/revision/latest?cb=20240731060821", "https://anime.fate-go.us/ep7-tv/assets/img/character/stand/img_stand_ishu.png", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/07f58b8e-1cf1-4d91-9e30-69d2b5bc3b3b/dfuvop4-22a9590b-3972-432b-88c1-a7e68a66da3b.png/v1/fill/w_1280,h_2063/suzume_no_tojimari_png_by_aadunis_dfuvop4-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjA2MyIsInBhdGgiOiIvZi8wN2Y1OGI4ZS0xY2YxLTRkOTEtOWUzMC02OWQyYjViYzNiM2IvZGZ1dm9wNC0yMmE5NTkwYi0zOTcyLTQzMmItODhjMS1hN2U2OGE2NmRhM2IucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.xmqc8wIrbeEWRNGI-pmbFLEopA3ulu1qumSRkCzRIsA", "https://www.pngall.com/wp-content/uploads/15/Hunter-X-Hunter-HXH-PNG-Photos.png", "https://static.wikitide.net/greatcharacterswiki/0/0a/Denji_Chainsaw_Man_Reze_Arc_anime_design.png"]
  const cards = Array.from({ length: characterSongCardImages.length }, (_, i) => i);
  return (
    <View style={styles.characterSongCardSection}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.characterSongCardWrapper}>
          {cards.map((item, index) => (
            <View key={index} style={styles.characterSongCardOuter}>
              <Image 
                source={{uri: characterSongCardImages[index]}} 
                style={styles.characterSongCardImage}
                resizeMode="cover"
              />
              <View style={styles.characterSongCardContainer} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const AnimeGameSongs = () => {
  const songImages = [
    "https://wutheringwaves.gg/wp-content/uploads/sites/8/2024/04/Wuthering-Waves-Key-Art-April-2024.jpg",
    "https://mlpnk72yciwc.i.optimole.com/cqhiHLc.IIZS~2ef73/w:auto/h:auto/q:75/https://bleedingcool.com/wp-content/uploads/2021/07/Punishing-Gray-Raven-Main-Art.jpg",
    "https://fastcdn.hoyoverse.com/content-v2/plat/124031/5d2ba4371115d26de4c574b28311aed8_576844151847376526.jpeg",
    "https://static0.anpoimages.com/wordpress/wp-content/uploads/2023/04/honkai-star-rail-hero-1.jpg?w=1600&h=900&fit=crop",
    "https://www.talkesport.com/wp-content/uploads/Honkai-Impact-3.jpg",
    "https://www.joytify.com/blog/en-ph/wp-content/uploads/2024/07/zzz1.jpg",
    "https://sm.ign.com/ign_in/review/p/persona-5-/persona-5-review_62rp.jpg",
    "https://i0.wp.com/nikke.gg/wp-content/uploads/Nikke-Key-Art.jpg?fit=823%2C463&ssl=1",
    "https://cdn-www.bluestacks.com/bs-images/f3c1b-17045605719599-1920.webp",
  ];
  const songs = Array.from({ length: songImages.length }, (_, i) => i);

  return (
    <View style={styles.animeGameSongsWrapper}>
      <Text style={styles.makeForYouText}>Game Songs</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled={true}>
        <View style={styles.animeGameSongsContainer}>
          {songs.map((item, index) => (
            <View key={index} style={styles.animeGameSongItem}>
              <Image 
                source={{uri: songImages[index]}} 
                style={styles.makeForYouImage} 
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const BottomNavigation = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: "Home", icon: "♬" },
    { id: "Search", icon: "⌕" },
    { id: "Play", icon: "▷" },
    { id: "Heart", icon: "♡" },
    { id: "Settings", icon: "⛯" },
  ];

  const IconComponent = ({ icon, isActive }: { icon: string; isActive: boolean }) => {
    if (icon === "⌂") {
      // Home icon
      return (
        <View style={styles.homeIcon}>
          <View style={[styles.homeIconRoof, isActive && styles.homeIconRoofActive]} />
          <View style={[styles.homeIconBase, isActive && styles.homeIconBaseActive]} />
          <View style={[styles.homeIconDoor, isActive && styles.homeIconDoorActive]} />
        </View>
      );
    }
    return <Text style={[styles.bottomNavIcon, isActive && styles.bottomNavIconActive]}>{icon}</Text>;
  };

  return (
    <View style={styles.bottomNavContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.bottomNavItem}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.bottomNavIconContainer,
              isActive && styles.bottomNavIconContainerActive,
            ]}>
              <IconComponent icon={tab.icon} isActive={isActive} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  characterSongCardSection: {
    width: width * 0.9,
    marginTop: 20,
  },
  characterSongCardWrapper: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 5,
  },
  characterSongCardOuter: {
    width: 100,
    height: 130,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
  },
  characterSongCardContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "yellow",
    borderWidth: 2,
    borderColor: "white",
    position: "absolute",
    zIndex: 1,
  },
  characterSongCardImage: {
    width: "100%",
    height: "150%",
    borderRadius: 20,
    position: "absolute",
    top: 5,
    zIndex: 2,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  topSongCardContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  topSongCardImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  topSongCardText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    position: "absolute",
    "bottom": 5,
    textAlign: "center",
    alignSelf: "center",
    paddingHorizontal: 5,
  },
  makeForYouSection: {
    width: width * 0.9,
    marginTop: 20,
  },
  makeForYouWrapper: {
    flexDirection: "row",
    gap: 10,
  },
  makeForYouContainer: {
    width: width * 0.9,
    height: 200,
  },
  makeForYouImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  makeForYouImageText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: -40,
    textAlign: "center",
    color: "white",
  },
  featuredSongsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: -30,
    textAlign: "right",
    color: "white",
    paddingHorizontal: 5
  },
  makeForYouText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for bottom navigation
  },
  topSongCardSection: {
    width: width * 0.9,
    marginTop: 20,
  },
  topSongCardWrapper: {
    flexDirection: "row",
    gap: 10,
  },
  featuredSongsWrapper: {
    width: width * 0.9,
    marginTop: 20,
  },
  animeGameSongsWrapper: {
    width: width * 0.9,
    marginTop: 20,
  },
  animeGameSongsContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 5,
  },
  animeGameSongItem: {
    width: width * 0.9 - 10,
    resizeMode: "contain",
    height: 200,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 40,
    left: 30,
    right: 30,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(200, 200, 200, 0.8)",

    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 10,
  },
  bottomNavItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  bottomNavItemActive: {
    // Active state handled by icon container
  },
  bottomNavIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNavIconContainerActive: {
    backgroundColor: "#FFD700", // Yellow for active state
  },
  bottomNavIcon: {
    fontSize: 18,
    color: "#fff",
  },
  bottomNavIconActive: {
    color: "#000",
  },
  homeIcon: {
    width: 30,
    height: 30,
    position: "relative",
  },
  homeIconRoof: {
    position: "absolute",
    top: 0,
    left: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff",
  },
  homeIconRoofActive: {
    borderBottomColor: "#000",
  },
  homeIconBase: {
    position: "absolute",
    top: 6,
    left: 0,
    width: 16,
    height: 12,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "transparent",
  },
  homeIconBaseActive: {
    borderColor: "#000",
  },
  homeIconDoor: {
    position: "absolute",
    top: 10,
    left: 6,
    width: 4,
    height: 6,
    backgroundColor: "#fff",
  },
  homeIconDoorActive: {
    backgroundColor: "#000",
  },
  genreCardSection: {
    width: width * 0.9,
    marginTop: 20,
  },
  genreCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  genreCardWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  genreCardContainer: {
    width: (width * 0.9 - 10) / 2,
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  genreCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  genreCardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    position: "absolute",
    bottom: 10,
    left: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});