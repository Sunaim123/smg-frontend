import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      state.push(action.payload)
    },
    increment: (state, action) => {
      state[action.payload].cart = state[action.payload].cart + 1
    },
    decrement: (state, action) => {
      state[action.payload].cart = state[action.payload].cart - 1
    },
    removeFromCart: (state, action) => {
      state.splice(action.payload, 1)
    },
    emptyCart: (state, action) => {
      return []
    },
    setQuantity: (state, action) => {
      state[action.payload.index].cart = action.payload.value || 1
    }
  },
})


export const { addToCart, increment, decrement, removeFromCart, emptyCart, setQuantity } = cartSlice.actions
export default cartSlice.reducer