import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CustomBannerAd from "../components/CustomBannerAd";

 const birds = [
  { id: 0, name: "Bouncy", price: 0, src: require("../assets/bouncy.png") },
  { id: 1, name: "Grudge", price: 500, src: require("../assets/grudge.png") },
  { id: 2, name: "Zenith", price: 1000, src: require("../assets/zenith.png") },
  { id: 3, name: "Sunny", price: 1500, src: require("../assets/sunny.png") },
];
export default function ShopScreen({ navigation }) {
  const [seeds, setSeeds] = useState(0); // valor inicial
  const [selectedBird, setSelectedBird] = useState(0);
  const [unlocked, setUnlocked] = useState([0]);

  useEffect(() => {
  const loadData = async () => {
    try {
      const storedSelectedBird = await AsyncStorage.getItem('selectedBird');
      console.log("Stored selected bird:", storedSelectedBird);
      const storedUnlocked = await AsyncStorage.getItem('unlockedBirds');
      const storedSeeds = await AsyncStorage.getItem('totalSeeds');

      if (storedSelectedBird !== null) {
        setSelectedBird(JSON.parse(storedSelectedBird));
      }
      if (storedUnlocked !== null) {
        setUnlocked(JSON.parse(storedUnlocked));
      }
      if (storedSeeds !== null) {
        setSeeds(JSON.parse(storedSeeds));
      }
    } catch (e) {
      console.log("Error loading bird data:", e);
    }
  };

  loadData();
}, []);

const handleSelect = async (bird) => {
  if (unlocked.includes(bird.id)) {
    setSelectedBird(bird.id);
    await AsyncStorage.setItem('selectedBird', JSON.stringify(bird.id));
  } else if (seeds >= bird.price) {
    const newUnlocked = [...unlocked, bird.id];
    const newSeeds = seeds - bird.price;

    setUnlocked(newUnlocked);
    setSeeds(newSeeds);
    setSelectedBird(bird.id);

    await AsyncStorage.setItem('selectedBird', JSON.stringify(bird.id));
    await AsyncStorage.setItem('unlockedBirds', JSON.stringify(newUnlocked));
    await AsyncStorage.setItem('seeds', JSON.stringify(newSeeds));
  }
};


  return (
    <View style={styles.container}>
      <CustomBannerAd />
      <Text style={styles.title}>Tienda</Text>
<View style={styles.seedsRow}>
  <Text style={styles.seedsText}>Semillas: {seeds}</Text>
  <Image
    source={require("../assets/seed/03_seed.png")}
    style={styles.seedIcon}
    resizeMode="contain"
  />
</View>


      <ScrollView contentContainerStyle={styles.shopBox}>
        {birds.map((bird) => {
          const isUnlocked = unlocked.includes(bird.id);
          const isSelected = selectedBird === bird.id;

          return (
            <TouchableOpacity
              key={bird.id}
              style={[
                styles.item,
                isSelected && styles.selected,
                !isUnlocked && styles.locked,
              ]}
              onPress={() => handleSelect(bird)}
            >
              <Image source={bird.src} style={styles.image} />
              <Text style={styles.label}>{bird.name}</Text>
              {!isUnlocked && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>{bird.price}</Text>
                  <Image
                    source={require("../assets/seed/03_seed.png")}
                    style={styles.seedIcon}
                    resizeMode="contain"
                  />
                </View>
              )}
              {isSelected && <Text style={styles.using}>Usando</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>
            <CustomBannerAd />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef6ff",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
seedsRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
},

seedsText: {
  fontSize: 16,
  color: '#333',
  marginRight: 6,
},

seedIcon: {
  width: 20,
  height: 20,
},

  shopBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  item: {
    backgroundColor: "#fff",
    width: 140,
    height: 160,
    margin: 10,
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 5,
    resizeMode: "contain",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  price: {
    marginTop: 5,
    color: "#888",
    fontSize: 13,
  },
  using: {
    marginTop: 5,
    color: "#48c774",
    fontWeight: "bold",
  },
  locked: {
    opacity: 0.5,
  },
  selected: {
    borderColor: "#48c774",
    borderWidth: 2,
  },
  backBtn: {
    position: "absolute",
    bottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
  },
  priceRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 5,
  gap: 6,
},

priceText: {
  fontSize: 14,
  color: '#444',
},
});
