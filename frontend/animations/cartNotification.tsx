import React, { useEffect, useRef, ReactNode } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { NavigationProp } from '../types/navigation';

const { width } = Dimensions.get('window');

interface CartNotificationProps {
  isVisible: boolean;
  itemName: string;
  onHide: () => void;
  duration?: number;
}

// CartNotification component that shows when item is added to cart
const CartNotification = ({ 
  isVisible, 
  itemName, 
  onHide, 
  duration = 4000 // Auto-hide after 4 seconds
}: CartNotificationProps) => {
  const navigation = useNavigation<NavigationProp>();
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Get cart data from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    let hideTimeout:any;
    
    if (isVisible) {
      // Show animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Set timeout to hide notification
      hideTimeout = setTimeout(() => {
        onHide();
      }, duration);
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    return () => {
      clearTimeout(hideTimeout);
    };
  }, [isVisible, onHide, duration, translateY, opacity]);

  const goToCart = () => {
    onHide();
    navigation.navigate('Cart'); // Navigate to cart screen
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          transform: [{ translateY }],
          opacity 
        }
      ]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.leftContent}>
          <Text style={styles.addedText}>
            <Feather name="check-circle" size={16} color="#4CAF50" /> Added to cart
          </Text>
          <Text style={styles.itemName} numberOfLines={1}>
            {itemName}
          </Text>
          <View style={styles.cartSummary}>
            <Text style={styles.cartSummaryText}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'} | ₹{totalAmount}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewCartButton} onPress={goToCart}>
          <Text style={styles.viewCartText}>VIEW CART</Text>
          <Feather name="chevron-right" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Main provider component
export const CartNotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = React.useState({
    isVisible: false,
    itemName: '',
  });

  // Function to show notification
  const showNotification = (itemName: string) => {
    setNotification({
      isVisible: true,
      itemName,
    });
  };

  // Function to hide notification
  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false,
    }));
  };

  return (
    <CartNotificationContext.Provider value={{ showNotification }}>
      {children}
      <CartNotification
        isVisible={notification.isVisible}
        itemName={notification.itemName}
        onHide={hideNotification}
      />
    </CartNotificationContext.Provider>
  );
};

// Context for accessing notification functions
export const CartNotificationContext = React.createContext({
  showNotification: (itemName: string) => {},
});

// Hook to use cart notification
export const useCartNotification = () => {
  return React.useContext(CartNotificationContext);
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 0,
    zIndex: 1000,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  leftContent: {
    flex: 1,
    marginRight: 10,
  },
  addedText: {
    fontSize: 13,
    color: '#4CAF50',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cartSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartSummaryText: {
    fontSize: 14,
    color: '#666',
  },
  viewCartButton: {
    backgroundColor: '#FF9933',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
});