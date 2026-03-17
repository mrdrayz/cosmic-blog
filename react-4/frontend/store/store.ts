import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import type { AuthState, User } from '../types';

const initialAuthState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action): action is PayloadAction<{ auth: AuthState }> => action.type === HYDRATE,
      (state, action) => {
        const serverUser = action.payload.auth.user;
        const clientHasToken = Boolean(state.token);

        return {
          token: state.token,
          user: clientHasToken ? state.user : serverUser,
        };
      },
    );
  },
});

export const { setToken, setUser } = authSlice.actions;

const makeStore = () =>
  configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper(makeStore);
