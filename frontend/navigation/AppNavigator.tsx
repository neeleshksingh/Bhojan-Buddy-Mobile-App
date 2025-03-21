import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import LoginScreen from '../components/LoginScreen';
import LandingScreen from '../components/LandingScreen';
import CartScreen from '../components/CartScreen';
import OrderScreen from '../components/OrderScreen';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();


// Custom Header Component with Location and Profile
const CustomHeader: React.FC<{ navigation: any }> = ({ navigation }) => (
  <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.headerLeft} onPress={() => console.log('Location pressed')}>
        <Ionicons name="location" size={24} color="#fff" />
        <Text style={styles.headerText}>Your Location</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerRight} onPress={() => console.log('Profile pressed')}>
        <Ionicons name="person-circle" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

// Tab Navigator for Home, Cart, and Orders
const HomeTabs = () => (
  <SafeAreaView style={styles.safeContainer} edges={['left', 'right']}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Cart') iconName = 'cart';
          else if (route.name === 'Orders') iconName = 'receipt';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF9933', // Saffron for active tab
        tabBarInactiveTintColor: '#666',
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Home" component={LandingScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Orders" component={OrderScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  </SafeAreaView>
);

const AppNavigator: React.FC = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#FF9933" />
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Landing" 
              component={HomeTabs} 
              options={({ navigation }) => ({
                header: () => <CustomHeader navigation={navigation} />,
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFD699', // Matches gradient end for seamless transition
  },
  headerSafeArea: {
    backgroundColor: '#FF9933', // Matches gradient start for navbar integration
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FF9933', // Saffron to blend with status bar
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {},
  headerText: {
    fontSize: 16,
    color: '#fff', // White for contrast on saffron
    marginLeft: 5,
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
    elevation: 5,
    paddingBottom: 5,
  },
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  placeholderText: {
    fontSize: 18,
    color: '#333',
  },
});

export default AppNavigator;