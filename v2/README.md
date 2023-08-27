# Shirudo

Authentication system for developers

## Features

- Admin Dashboard
  - Manage multiple apps
  - Manage multiple roles for an app
  - admin, user - default roles
- API
  - register new user
  - check if username, email are already taken
  - login user with JWT authentication
  - verify current user identity
- Hasura configuration

---

## Guide

### Dashboard login

- Enter `SHIRUDO_ADMIN_PASSWORD` specified in `.env` file as password to login

### Register app

- Login to admin dashboard using admin password
- Fill `App Name` and `App Admin Password`
- Click on `Add new app` to create the app
- A new app will be created with the provided name
- Admin is created with the following credentials:
  - username: `{app-name}-admin`
  - password: provided when creating the app
- Click on app name in app list to view app details
- Copy `App Id` for further use

### Register user

- register new users with `/users/register` (`POST` request)
- `email` field is optional for registration

```json
{
  "username": "user001",
  "password": "user001",
  "appId": "62aae99f415aaa6669bffc12"
}
```

### Login

- login with `/users/login` (`POST` request)
- `identity` accepts either `username` or `email` as value

```json
{
  "identity": "react-store-admin",
  "password": "react-store-admin",
  "appId": "62ab68a3de14711f5973bce1"
}
```

### Authorize API calls

- add `Authorization` header to `http` request as `Bearer {token}`

```js
await axios.get(`${SHIRUDO_BASE_URL}/users/verify`, {
  headers: {
    Authorization: `Bearer ${jwt}`,
  },
});
```

### Verify current user

- verify user token with `/users/verify` (`GET` request) (including `Authorization` header)

### Check username/email availability for apps

- Useful for sign up form validations

- check username with `/users/check-username` (`POST` request)

```json
{
  "username": "user001",
  "appId": "98030021-ee2f-4b0e-a523-516a2977d944"
}
```

- check email with `/users/check-email` (`POST` request)

```json
{
  "email": "user001@gmail.com",
  "appId": "79952d05-da54-4150-b62a-2e5a4151d0f5"
}
```

- If username/email is available

```json
{
  "available": true
}
```

- If username/email is already taken

```json
{
  "statusCode": 400,
  "message": "username already taken",
  "name": "BadRequestError"
}
```

### Delete app

- Deleting an app deletes the app it's users (including admin) from
  the database
- Login to dashboard
- Delete from app details page

### Use with Hasura

- Shirudo will automatically add hasura claims to jwt as below

```json
{
  "user_id": "62aaea2e3bf4f7d93c54e99a",
  "username": "app-admin",
  "default_role": "admin",
  "allowed_roles": ["admin"],
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["admin"],
    "x-hasura-default-role": "admin",
    "x-hasura-user-id": "62aaea2e3bf4f7d93c54e99a"
  },
  "iat": 1655368272,
  "exp": 1655454672
}
```

---

## Development setup

- `git clone REPO_URL`
- Use <a href="https://pnpm.io" target="_blank">pnpm</a>
- `pnpm i` to install dependencies
- copy `.env.example` to `.env`
- `SHIRUDO_ADMIN_PASSWORD` is used as dashboard login password
- `SHIRUDO_JWT_SECRET` is used for signing and verifying JWTs
  - `NOTE:` Please make sure it's `at least 32 characters` long for it work properly with Hasura
- `pnpm run dev` to start development server

---

## Deploy

- `pnpm run build` to build for production
- `pnpm run start` to start production server

---

## Packages

- svelte + svelte kit
- prisma
- zod
- bcryptjs
- jsonwebtoken
- axios

## Netlify Build

- [fix guide](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/netlify-caching-issue)
