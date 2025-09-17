"use client";
import { useState } from 'react';
import api from '@/lib/api';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const dispatch = useAppDispatch();

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const res = await api.post('/auth/login', { email, password });
			dispatch(setCredentials({ user: res.data.user, token: res.data.accessToken }));
			router.push('/dashboard');
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div style={{ maxWidth: 360, margin: '40px auto' }}>
			<h1>Login</h1>
			<form onSubmit={onSubmit}>
				<input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
				<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
				<button disabled={loading} type="submit">{loading ? '...' : 'Login'}</button>
			</form>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
} 