import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  restaurant: string;
}

interface Props {
  item: FoodItem;
}

const FoodItemCard: React.FC<Props> = ({ item }) => (
    <View style={styles.foodItemCard}>
      <Image source={{ uri: item.image }} style={styles.foodItemImage} />
      <View style={styles.foodItemInfo}>
        <Text style={styles.foodItemName}>{item.name}</Text>
        <Text style={styles.foodItemRestaurant}>{item.restaurant}</Text>
        <Text style={styles.foodItemPrice}>₹{item.price}</Text>
      </View>
    </View>
  );

const styles = StyleSheet.create({
  foodItemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 5,
    padding: 10
  },
  foodItemImage: {
    width: 100,
    height: 100,
    borderRadius: 8
  },
  foodItemInfo: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center'
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  foodItemRestaurant: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  foodItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9933',
    marginTop: 5
  }
});

export default FoodItemCard;