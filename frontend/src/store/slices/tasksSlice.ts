import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
	id: string;
	title: string;
	description?: string;
	status: 'todo' | 'in-progress' | 'done';
	assignee?: { id: string; name: string; email: string } | null;
	dueDate?: string | null;
	project?: { id: string };
}

interface TasksState {
	byProjectId: Record<string, Task[]>;
}

const initialState: TasksState = {
	byProjectId: {},
};

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		setTasksForProject(state, action: PayloadAction<{ projectId: string; tasks: Task[] }>) {
			state.byProjectId[action.payload.projectId] = action.payload.tasks;
		},
		upsertTask(state, action: PayloadAction<Task>) {
			const task = action.payload;
			const projectId = task.project?.id as string;
			if (!projectId) return;
			const list = state.byProjectId[projectId] || [];
			const idx = list.findIndex((t) => t.id === task.id);
			if (idx >= 0) list[idx] = task; else list.push(task);
			state.byProjectId[projectId] = list;
		},
		removeTask(state, action: PayloadAction<{ projectId: string; id: string }>) {
			const { projectId, id } = action.payload;
			state.byProjectId[projectId] = (state.byProjectId[projectId] || []).filter((t) => t.id !== id);
		},
	},
});

export const { setTasksForProject, upsertTask, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer; 