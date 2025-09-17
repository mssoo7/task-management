import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
	id: string;
	name: string;
	description?: string;
}

interface ProjectsState {
	items: Project[];
	currentProjectId: string | null;
}

const initialState: ProjectsState = {
	items: [],
	currentProjectId: null,
};

const projectsSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {
		setProjects(state, action: PayloadAction<Project[]>) {
			state.items = action.payload;
		},
		setCurrentProjectId(state, action: PayloadAction<string | null>) {
			state.currentProjectId = action.payload;
		},
	},
});

export const { setProjects, setCurrentProjectId } = projectsSlice.actions;
export default projectsSlice.reducer; 