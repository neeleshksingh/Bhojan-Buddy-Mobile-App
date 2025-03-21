import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Landing: undefined;
  Cart: undefined;
  Order: undefined;
};

export type NavigationProp = StackNavigationProp<RootStackParamList>;