import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeFromCart } from '../redux/cartSlice';
import { NavigationProp } from '../types/navigation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  navigation: NavigationProp;
}

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>
        {item.name} - ₹{item.price} x {item.quantity}
      </Text>
      <Button mode="outlined" onPress={() => dispatch(removeFromCart(item.id))}>
        Remove
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Your Cart</Title>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Text style={styles.total}>Total: ₹{total}</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Order')}
        style={styles.button}
        disabled={cartItems.length === 0}
      >
        Place Order
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20 },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 16 },
  total: { fontSize: 18, marginVertical: 20, textAlign: 'right' },
  button: { backgroundColor: '#ff5722' },
});

export default CartScreen;