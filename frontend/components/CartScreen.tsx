import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView, Animated, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Title, Button, TextInput, Chip, Surface, Divider, Card, Badge, Avatar, Headline } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeFromCart, addToCart, decreaseQuantity } from '../redux/cartSlice';
import { NavigationProp } from '../types/navigation';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurant?: string;
  description?: string;
  customization?: string[];
}

interface Props {
  navigation: NavigationProp;
}

const { width } = Dimensions.get('window');

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<string>('30-35 min');
  const [paymentMethod, setPaymentMethod] = useState<string>('wallet');
  const [showCouponSheet, setShowCouponSheet] = useState<boolean>(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const scrollY = new Animated.Value(0);

  // Animate header opacity based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const platformFee = 20;
  const deliveryFee = subtotal > 499 ? 0 : 40; // Free delivery above ₹499
  const totalBeforeDiscount = subtotal + deliveryFee + tipAmount + gst + platformFee;
  const total = totalBeforeDiscount - discount;

  // Estimated savings
  const savings = discount + (subtotal > 499 ? 40 : 0);

  useEffect(() => {
    const baseTime = 25;
    const additionalTime = Math.min(10, Math.floor(cartItems.length / 2) * 5);
    setDeliveryTime(`${baseTime}-${baseTime + additionalTime} min`);
  }, [cartItems]);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setDiscount(Math.round(totalBeforeDiscount * 0.1));
      setAppliedCoupon('SAVE10');
      setCouponCode('');
      setShowCouponSheet(false);
    } else if (couponCode.toUpperCase() === 'WELCOME20') {
      setDiscount(Math.round(totalBeforeDiscount * 0.2));
      setAppliedCoupon('WELCOME20');
      setCouponCode('');
      setShowCouponSheet(false);
    } else {
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponCode('');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const toggleItemExpand = (id: string) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  // Define the onScroll handler explicitly
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.setValue(event.nativeEvent.contentOffset.y);
  };

  const renderItem = ({ item }: { item: CartItem }) => {
    const isExpanded = expandedItemId === item.id;

    return (
      <Card style={styles.itemCard}>
        <View style={styles.item}>
        <View style={styles.itemImageContainer}>
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/100' }}
            style={styles.itemImage}
          />
          {item.customization?.length ? (
            <View style={styles.customizedBadge}>
              <Text style={styles.customizedText}>Customized</Text>
            </View>
          ) : null}
        </View>

          <View style={styles.itemDetails}>
            <Text style={styles.itemText}>{item.name}</Text>
            {item.restaurant && (
              <Text style={styles.restaurantName}>{item.restaurant}</Text>
            )}
            {item.description && (
              <Text
                numberOfLines={isExpanded ? undefined : 1}
                style={styles.itemDescription}
              >
                {item.description}
              </Text>
            )}

            {item.customization?.length ? (
              <TouchableOpacity onPress={() => toggleItemExpand(item.id)}>
                <Text style={styles.customizationLink}>
                  {isExpanded ? 'Hide customization' : 'Show customization'}{' '}
                  <MaterialIcons
                    name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={16}
                    color="#FF9933"
                  />
                </Text>
              </TouchableOpacity>
            ) : null}

            {isExpanded && item.customization?.map((option, index) => (
              <Text key={index} style={styles.customizationOption}>• {option}</Text>
            ))}

            <View style={styles.itemPriceContainer}>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => dispatch(decreaseQuantity(item.id))}
                  style={[styles.quantityButton, { opacity: item.quantity === 1 ? 0.5 : 1 }]}
                >
                  <Feather name="minus" size={14} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                  style={styles.quantityButton}
                >
                  <Feather name="plus" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.itemFooter}>
          <Text style={styles.itemTotal}>Item total: ₹{item.price * item.quantity}</Text>
          <TouchableOpacity
            onPress={() => dispatch(removeFromCart(item.id))}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  const EmptyCartComponent = () => (
    <View style={styles.emptyContainer}>
      <StatusBar style="dark" />
      <Image
        source={{ uri: 'https://via.placeholder.com/300' }}
        style={styles.emptyCartImage}
      />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptyText}>Add items to your cart to see them here</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Landing')}
        style={styles.browseFoodButton}
        labelStyle={styles.browseFoodButtonLabel}
        icon={({ size, color }) => (
          <Feather name="shopping-bag" size={size} color={color} />
        )}
      >
        Explore Restaurants
      </Button>
    </View>
  );

  const renderAvailableCoupons = () => (
    <View style={styles.availableCoupons}>
      <Text style={styles.availableCouponsTitle}>Available Offers</Text>

      <View style={styles.couponCard}>
        <View style={styles.couponIconContainer}>
          <MaterialCommunityIcons name="ticket-percent" size={20} color="#FF9933" />
        </View>
        <View style={styles.couponDetails}>
          <Text style={styles.couponCode}>SAVE10</Text>
          <Text style={styles.couponDescription}>10% off on your order</Text>
        </View>
        <TouchableOpacity
          style={styles.applyCouponLink}
          onPress={() => {
            setCouponCode('SAVE10');
            handleApplyCoupon();
          }}
        >
          <Text style={styles.applyCouponText}>Apply</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.couponCard}>
        <View style={styles.couponIconContainer}>
          <MaterialCommunityIcons name="ticket-percent" size={20} color="#FF9933" />
        </View>
        <View style={styles.couponDetails}>
          <Text style={styles.couponCode}>WELCOME20</Text>
          <Text style={styles.couponDescription}>20% off for new users</Text>
        </View>
        <TouchableOpacity
          style={styles.applyCouponLink}
          onPress={() => {
            setCouponCode('WELCOME20');
            handleApplyCoupon();
          }}
        >
          <Text style={styles.applyCouponText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyCartComponent />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={{ width: 24 }} />
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll} // Use the explicit handler
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Headline style={styles.pageTitle}>Your Cart</Headline>
            <Badge style={styles.cartBadge}>{cartItems.length}</Badge>
          </View>

          <View style={styles.restaurantInfo}>
            <Avatar.Image
              source={{ uri: 'https://via.placeholder.com/50' }}
              size={40}
              style={styles.restaurantLogo}
            />
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantTitle}>Tasty Bites</Text>
              <View style={styles.deliveryInfoRow}>
                <View style={styles.deliveryInfo}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                  <Text style={styles.deliveryInfoText}>{deliveryTime}</Text>
                </View>
                <View style={styles.deliveryInfo}>
                  <MaterialCommunityIcons name="map-marker-outline" size={16} color="#666" />
                  <Text style={styles.deliveryInfoText}>1.2 km</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {savings > 0 && (
          <View style={styles.savingsBar}>
            <MaterialCommunityIcons name="piggy-bank" size={18} color="#4CAF50" />
            <Text style={styles.savingsText}>Yay! You're saving ₹{savings} on this order</Text>
          </View>
        )}

        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Frequently Bought Together</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
            {[1, 2, 3, 4].map((item) => (
              <TouchableOpacity key={item} style={styles.suggestionItem}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/80' }}
                  style={styles.suggestionImage}
                />
                <Text style={styles.suggestionName}>Suggested Item {item}</Text>
                <Text style={styles.suggestionPrice}>₹120</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>ADD</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Surface style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.couponSelector}
            onPress={() => setShowCouponSheet(!showCouponSheet)}
          >
            <View style={styles.couponSelectorLeft}>
              <MaterialCommunityIcons name="ticket-percent-outline" size={22} color="#FF9933" />
              {appliedCoupon ? (
                <View style={styles.appliedCouponInfo}>
                  <Text style={styles.appliedCouponText}>
                    <Text style={styles.appliedCouponCode}>{appliedCoupon}</Text> applied
                  </Text>
                  <Text style={styles.savingsInfo}>You saved ₹{discount}</Text>
                </View>
              ) : (
                <Text style={styles.couponSelectorText}>Apply Coupon</Text>
              )}
            </View>
            {appliedCoupon ? (
              <TouchableOpacity onPress={handleRemoveCoupon} style={styles.removeCouponButton}>
                <Text style={styles.removeCouponText}>REMOVE</Text>
              </TouchableOpacity>
            ) : (
              <MaterialIcons name="keyboard-arrow-right" size={24} color="#666" />
            )}
          </TouchableOpacity>

          {showCouponSheet && !appliedCoupon && renderAvailableCoupons()}
        </Surface>

        <Surface style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="note-add" size={22} color="#FF9933" />
            <Text style={styles.sectionTitle}>Add Delivery Instructions</Text>
          </View>
          <TextInput
            value={deliveryNotes}
            onChangeText={setDeliveryNotes}
            multiline
            numberOfLines={2}
            style={styles.notesInput}
            mode="outlined"
            theme={{ colors: { primary: '#FF9933' } }}
            placeholder="E.g., Leave at door, Call when arriving, etc."
          />
        </Surface>

        <Surface style={styles.sectionCard}>
          <Text style={styles.billTitle}>Bill Details</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{subtotal}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <View style={styles.deliveryFeeContainer}>
              {deliveryFee === 0 && subtotal > 0 && (
                <Text style={styles.freeDeliveryTag}>FREE</Text>
              )}
              <Text style={styles.billValue}>{deliveryFee > 0 ? `₹${deliveryFee}` : '₹0'}</Text>
            </View>
          </View>

          <View style={styles.billRow}>
            <View style={styles.billLabelWithInfo}>
              <Text style={styles.billLabel}>Platform Fee</Text>
              <TouchableOpacity>
                <MaterialIcons name="info-outline" size={16} color="#999" />
              </TouchableOpacity>
            </View>
            <Text style={styles.billValue}>₹{platformFee}</Text>
          </View>

          <View style={styles.billRow}>
            <View style={styles.billLabelWithInfo}>
              <Text style={styles.billLabel}>GST and Restaurant Charges</Text>
              <TouchableOpacity>
                <MaterialIcons name="info-outline" size={16} color="#999" />
              </TouchableOpacity>
            </View>
            <Text style={styles.billValue}>₹{gst}</Text>
          </View>

          {tipAmount > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Partner Tip</Text>
              <TouchableOpacity onPress={() => setTipAmount(0)}>
                <Text style={styles.editTipLink}>Edit</Text>
              </TouchableOpacity>
              <Text style={styles.billValue}>₹{tipAmount}</Text>
            </View>
          )}

          {discount > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Coupon Discount</Text>
              <Text style={styles.discountValue}>-₹{discount}</Text>
            </View>
          )}

          <Divider style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>To Pay</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </Surface>

        <Surface style={styles.sectionCard}>
          <View style={styles.tipHeader}>
            <FontAwesome5 name="hand-holding-heart" size={20} color="#FF9933" />
            <View style={styles.tipHeaderText}>
              <Text style={styles.tipTitle}>Tip your delivery partner</Text>
              <Text style={styles.tipSubtitle}>Your kindness means a lot!</Text>
            </View>
          </View>

          <View style={styles.tipOptions}>
            {[0, 20, 30, 50, 'other'].map((amount:any, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setTipAmount(amount === 'other' ? tipAmount : amount as number)}
                style={[
                  styles.tipOption,
                  tipAmount === amount && amount !== 'other' && styles.selectedTipOption
                ]}
              >
                <Text style={[
                  styles.tipOptionText,
                  tipAmount === amount && amount !== 'other' && styles.selectedTipText
                ]}>
                  {amount === 0 ? 'No Tip' : amount === 'other' ? 'Other' : `₹${amount}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tipAmount > 0 && (
            <View style={styles.tipMessage}>
              <MaterialCommunityIcons name="emoticon-happy-outline" size={18} color="#4CAF50" />
              <Text style={styles.tipMessageText}>Thank you for valuing your delivery partner's service!</Text>
            </View>
          )}
        </Surface>

        <Surface style={styles.sectionCard}>
          <View style={styles.paymentHeader}>
            <View style={styles.paymentTitle}>
              <MaterialIcons name="payment" size={22} color="#333" />
              <Text style={styles.paymentTitleText}>Payment Method</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changePaymentText}>CHANGE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.selectedPayment}>
            <Image
              source={{ uri: 'https://via.placeholder.com/30' }}
              style={styles.walletIcon}
            />
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentName}>Wallet Balance</Text>
              <Text style={styles.paymentBalance}>₹850 available</Text>
            </View>
          </View>
        </Surface>

        <Surface style={styles.sectionCard}>
          <View style={styles.addressHeader}>
            <View style={styles.addressHeaderLeft}>
              <MaterialIcons name="location-on" size={22} color="#333" />
              <Text style={styles.addressTitle}>Delivery Address</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeAddressText}>CHANGE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressDetails}>
            <Text style={styles.addressType}>Home</Text>
            <Text style={styles.addressText}>123 Main Street, Apartment 4B, Koramangala</Text>
          </View>
        </Surface>

        <Surface style={styles.sectionCard}>
          <Text style={styles.cancellationTitle}>Cancellation Policy</Text>
          <Text style={styles.cancellationText}>
            100% cancellation fee will be applicable if you decide to cancel the order anytime after order placement.
            This is done to compensate our restaurant partners for their efforts.
          </Text>
        </Surface>
      </ScrollView>

      <Surface style={styles.placeOrderContainer}>
        {savings > 0 && (
          <View style={styles.savingsPill}>
            <MaterialCommunityIcons name="tag" size={14} color="#4CAF50" />
            <Text style={styles.savingsPillText}>You're saving ₹{savings}!</Text>
          </View>
        )}

        <View style={styles.placeOrderContent}>
          <View style={styles.orderSummary}>
            <Text style={styles.totalItems}>{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</Text>
            <Text style={styles.finalPrice}>₹{total}</Text>
          </View>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('Order')}
            style={styles.placeOrderButton}
            labelStyle={styles.placeOrderButtonLabel}
            icon={({ size, color }) => (
              <MaterialIcons name="shopping-cart-checkout" size={size} color={color} />
            )}
          >
            Place Order
          </Button>
        </View>
      </Surface>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
  },
  cartBadge: {
    backgroundColor: '#FF9933',
    color: '#fff',
    marginLeft: 'auto',
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantLogo: {
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deliveryInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  deliveryInfoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  savingsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  savingsText: {
    color: '#4CAF50',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  itemCard: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    padding: 12,
  },
  itemImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
  },
  customizedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 153, 51, 0.9)',
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  customizedText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  restaurantName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  customizationLink: {
    fontSize: 12,
    color: '#FF9933',
    marginBottom: 4,
  },
  customizationOption: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    marginBottom: 2,
  },
  itemPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 0,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  removeButton: {
    borderWidth: 1,
    borderColor: '#FF5252',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeButtonText: {
    color: '#FF5252',
    fontSize: 12,
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 2,
  },
  quantityButton: {
    backgroundColor: '#FF9933',
    borderRadius: 4,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    marginHorizontal: 8,
    color: '#333',
    fontWeight: '500',
    minWidth: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  browseFoodButton: {
    backgroundColor: '#FF9933',
    borderRadius: 8,
  },
  browseFoodButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  availableCoupons: {
    paddingVertical: 10,
  },
  availableCouponsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  couponIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  couponDetails: {
    flex: 1,
  },
  couponCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  couponDescription: {
    fontSize: 12,
    color: '#666',
  },
  applyCouponLink: {
    paddingHorizontal: 10,
  },
  applyCouponText: {
    fontSize: 14,
    color: '#FF9933',
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  suggestionsScroll: {
    paddingBottom: 10,
  },
  suggestionItem: {
    width: 120,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    elevation: 1,
  },
  suggestionImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginBottom: 6,
  },
  suggestionName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  suggestionPrice: {
    fontSize: 12,
    color: '#FF9933',
    fontWeight: '500',
    marginBottom: 6,
  },
  addButton: {
    backgroundColor: '#FF9933',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
  },
  couponSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponSelectorText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  appliedCouponInfo: {
    marginLeft: 12,
  },
  appliedCouponText: {
    fontSize: 14,
    color: '#333',
  },
  appliedCouponCode: {
    fontWeight: '600',
    color: '#FF9933',
  },
  savingsInfo: {
    fontSize: 12,
    color: '#4CAF50',
  },
  removeCouponButton: {
    paddingHorizontal: 10,
  },
  removeCouponText: {
    fontSize: 14,
    color: '#FF5252',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  notesInput: {
    backgroundColor: '#fff',
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
  },
  billLabelWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  billValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  discountValue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  deliveryFeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeDeliveryTag: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    marginRight: 4,
  },
  editTipLink: {
    fontSize: 12,
    color: '#FF9933',
    marginRight: 8,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#eee',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9933',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipHeaderText: {
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tipSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  tipOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tipOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedTipOption: {
    borderColor: '#FF9933',
    backgroundColor: '#FFF3E0',
  },
  tipOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTipText: {
    color: '#FF9933',
    fontWeight: '500',
  },
  tipMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  tipMessageText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 8,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  changePaymentText: {
    fontSize: 14,
    color: '#FF9933',
    fontWeight: '500',
  },
  selectedPayment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  paymentBalance: {
    fontSize: 12,
    color: '#666',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  changeAddressText: {
    fontSize: 14,
    color: '#FF9933',
    fontWeight: '500',
  },
  addressDetails: {
    marginLeft: 34,
  },
  addressType: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#666',
  },
  cancellationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cancellationText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  placeOrderContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  savingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'center',
    marginBottom: 8,
  },
  savingsPillText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  placeOrderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderSummary: {
    flex: 1,
  },
  totalItems: {
    fontSize: 14,
    color: '#666',
  },
  finalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9933',
  },
  placeOrderButton: {
    backgroundColor: '#FF9933',
    borderRadius: 8,
    paddingVertical: 2,
  },
  placeOrderButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;