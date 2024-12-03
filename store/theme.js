import { createSlice } from "@reduxjs/toolkit"

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "dark"
  },
  reducers: {
    toggleTheme: (state, action) => {
      state.theme = action.payload
    }
  },
})


export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer