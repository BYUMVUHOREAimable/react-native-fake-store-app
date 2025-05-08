// Step: 1 Fetch the API , check the data in the console - done
// Step: 2 Use the data to update the state and use flatlist to render the data
// Step: 3 Handle the errors and error state
// Step: 4 Add a loading indictaor for a better user experience

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";

// Get screen width for responsive design
const { width } = Dimensions.get('window');

/**
 * ProductListingScreen Component
 * Displays a list of products fetched from the Fake Store API
 * Features:
 * - Product cards with images, titles, prices, and ratings
 * - Star rating visualization
 * - Loading and error states
 * - Responsive design
 * - Navigation to product details
 */
const ProductListingScreen = () => {
  const router = useRouter();
  // State management for products, loading state, and errors
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products when component mounts
  useEffect(() => {
    getProducts();
  }, []);

  /**
   * Fetches products from the Fake Store API
   * Handles loading states and errors
   */
  const getProducts = async () => {
    const URL = "https://fakestoreapi.com/products";

    fetch(URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  /**
   * Renders star rating based on product rating
   * @param {number} rating - Product rating (0-5)
   * @returns {Array} Array of star icons
   */
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`star-${i}`} name="star" size={16} color="#FFD700" />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half-star" name="star-half" size={16} color="#FFD700" />
      );
    }

    // Add empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-star-${i}`} name="star-outline" size={16} color="#FFD700" />
      );
    }

    return stars;
  };

  /**
   * Formats price with currency symbol and 2 decimal places
   * @param {number} price - Product price
   * @returns {string} Formatted price string
   */
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  /**
   * Handles product item press
   * @param {Object} item - Product data
   */
  const handleProductPress = (item) => {
    router.push({
      pathname: "/product/[id]",
      params: { id: item.id }
    });
  };

  /**
   * Renders individual product card
   * @param {Object} item - Product data
   */
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.productInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.category}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </Text>
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {renderStars(item.rating.rate)}
          </View>
          <Text style={styles.ratingCount}>({item.rating.count})</Text>
        </View>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>App Store</Text>
          <Text style={styles.headerSubtitle}>Your One-Stop Shop for Everything</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator color="#007AFF" size="large" />
          ) : error ? (
            <Text style={styles.errorStyle}>{error}</Text>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={products}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ProductListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Header Styles
  header: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 10,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: width - 50,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
  },
  productInfo: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 5,
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  errorStyle: {
    color: "red",
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
