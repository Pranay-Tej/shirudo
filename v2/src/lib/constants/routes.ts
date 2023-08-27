export const ROUTES = {
  dashboard: '/',
  apps: '/apps',
  appById: (id: string) => `/apps/${id}`,
  login: '/login',
};

export const ROUTE_DATA_KEYS = {
  appById: '/apps/:id',
};
