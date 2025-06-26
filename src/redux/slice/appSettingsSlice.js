import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: { typing: false, userId: null },
  theme: 'light', // Default theme
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
  },
});

export const { setUserData } = appSettingsSlice.actions;

export default appSettingsSlice.reducer;
