"use client";
import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTasksForProject, upsertTask, removeTask } from '@/store/slices/tasksSlice';
import { getSocket } from '@/lib/socket';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
	const projectId = params.id;
	const dispatch = useAppDispatch();
	const tasks = useAppSelector((s) => s.tasks.byProjectId[projectId] || []);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		api.get(`/projects/${projectId}/tasks`).then((res) => dispatch(setTasksForProject({ projectId, tasks: res.data })));
		const s = getSocket();
		const onCreated = (task: any) => { if (task.project?.id === projectId) dispatch(upsertTask(task)); };
		const onUpdated = (task: any) => { if (task.project?.id === projectId) dispatch(upsertTask(task)); };
		const onDeleted = ({ id }: any) => dispatch(removeTask({ projectId, id }));
		s.on('task.created', onCreated);
		s.on('task.updated', onUpdated);
		s.on('task.deleted', onDeleted);
		return () => {
			s.off('task.created', onCreated);
			s.off('task.updated', onUpdated);
			s.off('task.deleted', onDeleted);
		};
	}, [dispatch, projectId]);

	async function createTask(e: React.FormEvent) {
		e.preventDefault();
		const res = await api.post(`/projects/${projectId}/tasks`, { title, description });
		dispatch(upsertTask(res.data));
		setTitle('');
		setDescription('');
	}

	return (
		<div style={{ maxWidth: 800, margin: '20px auto' }}>
			<h1>Project Tasks</h1>
			<form onSubmit={createTask} style={{ marginBottom: 16 }}>
				<input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
				<input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
				<button type="submit">Add Task</button>
			</form>
			<ul>
				{tasks.map((t) => (
					<li key={t.id}>{t.title} — {t.status}</li>
				))}
			</ul>
		</div>
	);
} 