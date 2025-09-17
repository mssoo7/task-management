"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProjects } from '@/store/slices/projectsSlice';
import Link from 'next/link';

export default function DashboardPage() {
	const projects = useAppSelector((s) => s.projects.items);
	const dispatch = useAppDispatch();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		api.get('/projects').then((res) => dispatch(setProjects(res.data)));
	}, [dispatch]);

	async function createProject(e: React.FormEvent) {
		e.preventDefault();
		const res = await api.post('/projects', { name, description });
		dispatch(setProjects([res.data, ...projects]));
		setName('');
		setDescription('');
	}

	return (
		<div style={{ maxWidth: 800, margin: '20px auto' }}>
			<h1>Projects</h1>
			<form onSubmit={createProject} style={{ marginBottom: 16 }}>
				<input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
				<input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
				<button type="submit">Add</button>
			</form>
			<ul>
				{projects.map((p) => (
					<li key={p.id}><Link href={`/projects/${p.id}`}>{p.name}</Link></li>
				))}
			</ul>
		</div>
	);
} 