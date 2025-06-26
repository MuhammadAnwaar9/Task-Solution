import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: { typing: false, userId: null },
  theme: 'light',
  favourites: [],
};

export const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setFavourites: (state, action) => {
      state.favourites = action.payload;
    },
    toggleFavourite: (state, action) => {
      const id = action.payload;
      if (state.favourites.includes(id)) {
        state.favourites = state.favourites.filter(fav => fav !== id);
      } else {
        state.favourites.push(id);
      }
    },
  },
});

export const {
  setUserData,
  setTheme,
  setFavourites,
  toggleFavourite,
} = appSettingsSlice.actions;

export default appSettingsSlice.reducer;
