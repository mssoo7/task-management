import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = { id: string; name: string; email: string } | null;

interface AuthState {
	user: User;
	token: string | null;
}

const initialState: AuthState = {
	user: null,
	token: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
			state.user = action.payload.user;
			state.token = action.payload.token;
		},
		logout(state) {
			state.user = null;
			state.token = null;
		},
	},
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer; 