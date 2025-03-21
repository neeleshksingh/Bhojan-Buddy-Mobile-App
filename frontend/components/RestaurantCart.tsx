import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
}

interface Props {
  restaurant: Restaurant;
  onPress: () => void;
}

const RestaurantCard: React.FC<Props> = ({ restaurant, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text>⭐ {restaurant.rating} • {restaurant.deliveryTime}</Text>
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { marginVertical: 10, elevation: 4 },
  name: { fontSize: 18, fontWeight: 'bold' },
});

export default RestaurantCard;