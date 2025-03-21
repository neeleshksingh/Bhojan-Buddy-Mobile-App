import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Image, Text, TouchableOpacity, StatusBar, SectionList } from 'react-native';
import { Title, Caption, Searchbar, Chip, Badge } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';

// Dummy data for restaurants with Pexels images
const dummyRestaurants = [
  { 
    id: '1', 
    name: 'Flavor Haven', 
    rating: 4.6, 
    deliveryTime: '20-30 min',
    deliveryFee: '₹30',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    cuisine: 'Continental, Healthy',
    featured: true,
    discount: '20% OFF'
  },
  { 
    id: '2', 
    name: 'Curry Kingdom', 
    rating: 4.8, 
    deliveryTime: '15-25 min',
    deliveryFee: '₹40', 
    image: 'https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg',
    cuisine: 'Indian, Spicy',
    featured: true,
    discount: '15% OFF'
  },
  { 
    id: '3', 
    name: 'Burger Bonanza', 
    rating: 4.5, 
    deliveryTime: '25-35 min',
    deliveryFee: '₹25', 
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    cuisine: 'American, Fast Food',
    featured: false
  },
  { 
    id: '4', 
    name: 'Pizza Paradise', 
    rating: 4.7, 
    deliveryTime: '30-40 min',
    deliveryFee: 'FREE', 
    image: 'https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg',
    cuisine: 'Italian, Pizza',
    featured: true,
    discount: 'FREE DELIVERY'
  },
];

// Dummy data for popular food items with Pexels images
const dummyFoodItems = [
  { 
    id: '1', 
    name: 'Grilled Veggie Bowl', 
    price: 249, 
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    restaurant: 'Flavor Haven',
    rating: 4.6,
    timeEstimate: '20 min',
    isFavorite: false
  },
  { 
    id: '2', 
    name: 'Chicken Tikka Masala', 
    price: 329, 
    image: 'https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg',
    restaurant: 'Curry Kingdom',
    rating: 4.8,
    timeEstimate: '15 min',
    isFavorite: true
  },
  { 
    id: '3', 
    name: 'Double Cheese Burger', 
    price: 199, 
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    restaurant: 'Burger Bonanza',
    rating: 4.5,
    timeEstimate: '25 min',
    isFavorite: false
  },
  { 
    id: '4', 
    name: 'Pasta Primavera', 
    price: 279, 
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
    restaurant: 'Flavor Haven',
    rating: 4.6,
    timeEstimate: '20 min',
    isFavorite: true
  },
];

// Categories for filtering
const categories = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Indian' },
  { id: '3', name: 'Fast Food' },
  { id: '4', name: 'Healthy' },
  { id: '5', name: 'Italian' },
  { id: '6', name: 'Chinese' },
];

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  image: string;
  cuisine: string;
  featured: boolean;
  discount?: string;
}

interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  restaurant: string;
  rating: number;
  timeEstimate: string;
  isFavorite: boolean;
}

interface FoodItemCardProps {
  item: FoodItem;
  onToggleFavorite: (id: string) => void;
}

interface PromoCardProps {
  title: string;
  subtitle: string;
  color: [string, string];
}

interface SectionItem {
  id: string;
  title?: string;
}

// RestaurantCard component with enhanced UI
const RestaurantCard: React.FC<{ restaurant: Restaurant; onPress: () => void }> = ({ restaurant, onPress }) => (
  <TouchableOpacity style={styles.restaurantCard} onPress={onPress}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
      {restaurant.featured && (
        <LinearGradient
          colors={['#FF9933', '#FF6600']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.featuredBadge}
        >
          <Text style={styles.featuredText}>Featured</Text>
        </LinearGradient>
      )}
      {restaurant.discount && (
        <View style={styles.discountContainer}>
          <Text style={styles.discountText}>{restaurant.discount}</Text>
        </View>
      )}
    </View>
    <View style={styles.restaurantInfo}>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Text style={styles.restaurantDetails}>{restaurant.cuisine}</Text>
      
      <View style={styles.detailsRow}>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={14} color="#FF9933" />
          <Text style={styles.ratingText}>{restaurant.rating}</Text>
        </View>
        
        <View style={styles.deliveryTimeContainer}>
          <Feather name="clock" size={14} color="#666" />
          <Text style={styles.deliveryTime}>{restaurant.deliveryTime}</Text>
        </View>
        
        <View style={styles.deliveryFeeContainer}>
          <Text style={styles.deliveryFee}>
            {restaurant.deliveryFee === 'FREE' ? (
              <Text style={[styles.deliveryFee, { color: '#4CAF50' }]}>FREE</Text>
            ) : restaurant.deliveryFee}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// FoodItemCard component with enhanced UI
const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, onToggleFavorite }) => (
  <TouchableOpacity style={styles.foodItemCard}>
    <View style={styles.foodImageContainer}>
      <Image source={{ uri: item.image }} style={styles.foodItemImage} />
      <TouchableOpacity 
        style={styles.favoriteButton} 
        onPress={() => onToggleFavorite(item.id)}
      >
        <AntDesign name={item.isFavorite ? "heart" : "hearto"} size={18} color={item.isFavorite ? "#FF5252" : "#fff"} />
      </TouchableOpacity>
    </View>
    
    <View style={styles.foodItemInfo}>
      <Text style={styles.foodItemName}>{item.name}</Text>
      <Text style={styles.foodItemRestaurant}>{item.restaurant}</Text>
      
      <View style={styles.foodItemDetailsRow}>
        <View style={styles.foodItemRating}>
          <AntDesign name="star" size={14} color="#FF9933" />
          <Text style={styles.foodRatingText}>{item.rating}</Text>
        </View>
        
        <View style={styles.foodTimeContainer}>
          <Feather name="clock" size={14} color="#666" />
          <Text style={styles.foodTimeText}>{item.timeEstimate}</Text>
        </View>
      </View>
      
      <View style={styles.priceAddContainer}>
        <Text style={styles.foodItemPrice}>₹{item.price}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
    </TouchableOpacity>
  );

const PromoCard: React.FC<PromoCardProps> = ({ title, subtitle, color }) => (
  <LinearGradient
    colors={color}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.promoCard}
  >
    <View style={styles.promoContent}>
      <Text style={styles.promoTitle}>{title}</Text>
      <Text style={styles.promoSubtitle}>{subtitle}</Text>
    </View>
    <View style={styles.promoImageContainer}>
      <MaterialIcons name="local-offer" size={60} color="rgba(255,255,255,0.2)" />
    </View>
  </LinearGradient>
);

interface CategoryListProps {
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <View style={styles.categoryContainer}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCategory === item.id}
            style={[
              styles.categoryChip,
              selectedCategory === item.id && styles.selectedCategoryChip
            ]}
            textStyle={[
              styles.categoryText,
              selectedCategory === item.id && styles.selectedCategoryText
            ]}
            onPress={() => setSelectedCategory(item.id)}
          >
            {item.name}
          </Chip>
        )}
      />
    </View>
  );
};

// Component for promo cards
const PromoList = () => {
  const promos = [
    { id: '1', title: "50% OFF", subtitle: "On your first order", color: ['#FF5252', '#FF8A80'] as [string, string] },
    { id: '2', title: "FREE DELIVERY", subtitle: "On orders above ₹499", color: ['#4CAF50', '#8BC34A'] as [string, string] },
    { id: '3', title: "REFER & EARN", subtitle: "Get ₹100 for each friend", color: ['#2196F3', '#4FC3F7'] as [string, string] }
  ];

  return (
    <View style={styles.promoSection}>
      <FlatList
        data={promos}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PromoCard 
            title={item.title} 
            subtitle={item.subtitle} 
            color={item.color}
          />
        )}
      />
    </View>
  );
};

// SOLUTION OPTION 1: Using SectionList
const LandingScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [foodItems, setFoodItems] = useState(dummyFoodItems);

  const onChangeSearch = (query: string) => setSearchQuery(query);
  
  const toggleFavorite = (id: string) => {
    setFoodItems(
      foodItems.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  // Prepare data for SectionList
  const sections = [
    {
      title: 'categories',
      data: [{ type: 'categories' }]
    },
    {
      title: 'promos',
      data: [{ type: 'promos' }]
    },
    {
      title: 'Top Restaurants',
      data: [{ type: 'restaurants' }]
    },
    {
      title: 'Popular Dishes',
      data: [{ type: 'popularDishes' }]
    }
  ];

  const renderSectionHeader = ({ section }: { section: { title: string } }) => {
    if (section.title === 'categories' || section.title === 'promos') {
      return null;
    }
    
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item, section }: { item: { type: string }, section: { title: string } }) => {
    switch (item.type) {
      case 'categories':
        return (
          <CategoryList 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
          />
        );
      case 'promos':
        return <PromoList />;
      case 'restaurants':
        return (
          <FlatList
            data={dummyRestaurants}
            renderItem={({ item }) => (
              <RestaurantCard 
                restaurant={item} 
                onPress={() => console.log(`Selected ${item.name}`)} 
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.restaurantList}
          />
        );
      case 'popularDishes':
        return (
          <View style={{ paddingBottom: 90 }}>
            {foodItems.map(item => (
              <FoodItemCard 
                key={item.id}
                item={item} 
                onToggleFavorite={toggleFavorite} 
              />
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF9933" />
      
      {/* App Header */}
      <LinearGradient colors={['#FF9933', '#FF8000']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Foodie Delight</Text>
            <View style={styles.locationContainer}>
              <Feather name="map-pin" size={14} color="#fff" />
              <Text style={styles.locationText}>Koramangala, Bangalore</Text>
              <MaterialIcons name="keyboard-arrow-down" size={18} color="#fff" />
            </View>
          </View>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="shopping-bag" size={22} color="#fff" />
              <Badge style={styles.badge}>2</Badge>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="bell" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Searchbar
          placeholder="Search for restaurants, cuisine or a dish"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#FF9933"
        />
      </LinearGradient>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.type + index}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
      />
      
      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="home" size={24} color="#FF9933" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Feather name="search" size={24} color="#999" />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Feather name="heart" size={24} color="#999" />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Feather name="user" size={24} color="#999" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

// SOLUTION OPTION 2: Using a single parent FlatList
const LandingScreenWithFlatList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [foodItems, setFoodItems] = useState(dummyFoodItems);

  const onChangeSearch = (query: string) => setSearchQuery(query);
  
  const toggleFavorite = (id: string) => {
    setFoodItems(
      foodItems.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  // Data sections for our main FlatList
  const sections: SectionItem[] = [
    { id: 'categories' },
    { id: 'promos' },
    { id: 'restaurants', title: 'Top Restaurants' },
    { id: 'dishes', title: 'Popular Dishes' }
  ];

  // Render individual section components
  const renderSection = ({ item }: { item: SectionItem }) => {
    switch (item.id) {
      case 'categories':
        return (
          <CategoryList 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
          />
        );
      case 'promos':
        return <PromoList />;
      case 'restaurants':
        return (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={dummyRestaurants}
              renderItem={({ item }) => (
                <RestaurantCard 
                  restaurant={item} 
                  onPress={() => console.log(`Selected ${item.name}`)} 
                />
              )}
              keyExtractor={(restaurant) => restaurant.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.restaurantList}
            />
          </>
        );
      case 'dishes':
        return (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.foodItemList}>
              {foodItems.map(foodItem => (
                <FoodItemCard 
                  key={foodItem.id}
                  item={foodItem} 
                  onToggleFavorite={toggleFavorite} 
                />
              ))}
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF9933" />
      
      {/* App Header */}
      <LinearGradient colors={['#FF9933', '#FF8000']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Foodie Delight</Text>
            <View style={styles.locationContainer}>
              <Feather name="map-pin" size={14} color="#fff" />
              <Text style={styles.locationText}>Koramangala, Bangalore</Text>
              <MaterialIcons name="keyboard-arrow-down" size={18} color="#fff" />
            </View>
          </View>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="shopping-bag" size={22} color="#fff" />
              <Badge style={styles.badge}>2</Badge>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="bell" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Searchbar
          placeholder="Search for restaurants, cuisine or a dish"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#FF9933"
        />
      </LinearGradient>

      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 90 }}
      />
      
      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="home" size={24} color="#FF9933" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Feather name="search" size={24} color="#999" />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Feather name="heart" size={24} color="#999" />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Feather name="user" size={24} color="#999" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f8f8',
  },
  header: { 
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff', 
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
    marginRight: 2,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5252',
  },
  searchBar: {
    borderRadius: 10,
    elevation: 0,
    backgroundColor: '#fff',
  },
  searchInput: {
    fontSize: 14,
  },
  categoryContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  categoryChip: {
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  selectedCategoryChip: {
    backgroundColor: '#FF9933',
  },
  categoryText: {
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  promoSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  promoCard: {
    width: 280,
    height: 120,
    borderRadius: 12,
    marginRight: 15,
    padding: 15,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  promoImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF9933',
    fontWeight: '500',
  },
  restaurantList: { 
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  restaurantCard: { 
    width: 280,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  restaurantImage: { 
    width: '100%', 
    height: 150,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  featuredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  discountContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255, 153, 51, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  restaurantInfo: { 
    padding: 12,
  },
  restaurantName: { 
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantDetails: { 
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: { 
    fontSize: 13,
    color: '#FF9933',
    fontWeight: '600',
    marginLeft: 3,
  },
  deliveryTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  deliveryTime: { 
    fontSize: 13,
    color: '#666',
    marginLeft: 3,
  },
  deliveryFeeContainer: {
    marginLeft: 'auto',
  },
  deliveryFee: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  foodItemList: { 
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  foodItemCard: { 
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    overflow: 'hidden',
  },
  foodImageContainer: {
    position: 'relative',
  },
  foodItemImage: { 
    width: 120,
    height: 120,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodItemInfo: { 
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  foodItemName: { 
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  foodItemRestaurant: { 
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  foodItemDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  foodItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodRatingText: {
    fontSize: 13,
    color: '#FF9933',
    fontWeight: '500',
    marginLeft: 3,
  },
  foodTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  foodTimeText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 3,
  },
  priceAddContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  foodItemPrice: { 
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9933',
  },
  addButton: {
    backgroundColor: '#FF9933',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#999',
  },
  activeNavText: {
    color: '#FF9933',
    fontWeight: '500',
  },
});

export default LandingScreen;