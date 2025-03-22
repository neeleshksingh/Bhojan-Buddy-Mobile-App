import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the CartItem type with all fields from LandingScreen
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string; // Optional, as in your CartScreen
  restaurant?: string; // Optional, as in your CartScreen
  description?: string; // Optional, for potential future use
  customization?: string[]; // Optional, for potential future use
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addToCart, decreaseQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;