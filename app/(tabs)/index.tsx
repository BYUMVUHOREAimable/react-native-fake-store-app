import { StyleSheet, SafeAreaView } from "react-native";
import ProductListingScreen from "../../screens/ProductListingScreen";


export default function HomeScreen() {
 
  return (
    <SafeAreaView style={styles.container}>
      <ProductListingScreen />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
});
