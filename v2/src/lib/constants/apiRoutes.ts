export const API_ROUTES = {
	registerApp: '/api/apps/register',
	appById: (id: string) => `/api/apps/${id}`,
	roles: '/api/roles',
	roleById: (id: string) => `/api/roles/${id}`,
	logout: '/logout'
};
