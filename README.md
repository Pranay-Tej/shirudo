# 🛡️ Shirudo

Authentication system for developers

## Features

- app registration
- app admin
- user register, login
- JWT authentication
- multiple roles
- Hasura configuration

---

## Usage

### Register app

- register app at `/apps/register` to create an app and an admin

```json
{
  "name": "app-name",
  "password": "admin-password",
  "jwt-secret": "jwt-secret"
}
```

- Save `app_id`
- Admin is created with username `{app-name}-admin`

### Register user

- register new users with `/users/register`
- `email` field is optional for registration

```json
{
  "username": "user001",
  "password": "user001",
  "app_id": "62aae99f415aaa6669bffc12"
}
```

### Login

- login with `/users/login`
- `identity` accepts either `username` or `email` as value

```json
{
  "identity": "react-store-admin",
  "password": "react-store-admin",
  "app_id": "62ab68a3de14711f5973bce1"
}
```

### Authorize API calls

- add `Authorization` header to http request as `Bearer {token}`
- add `ShirudoAppId` header to http request as `{appId}`
- verify user token with `/users/verify`

### Check username/email availability for apps

- Useful for sign up form validations

- check username at `/users/check-username/{username_to_check}/{app_id}`
- check email at `/users/check-email/{email_to_check}/{app_id}`

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

- Deleting an app deletes it's users (including admin), app secret and app from
  the database
- Only admin can delete the app
- `name` should be passed in the body for confirmation

- make a `DELETE` request at `/apps/{app_id}`

### Usage with Hasura

- enable hasura claims by setting `IS_HASURA_MODE_ENABLED` to true in `env`
- this will automatically add hasura claims to jwt as below

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
- Use <a href="https://pnpm.io" target="_blank">pnpm</a> `pnpm i` to install dependencies
- Or `npm i`
- copy `.env.example` to `.env`
- add environment variables (found in app.config.ts) to `.env`
- `npm run dev` to start development server

---

## Deploy

- `npm run build` to build for production
- `npm run start` to start production server

---

## Packages

- bcrypt
- cors
- crypto-js
- dotenv
- express
- express-rate-limit
- helmet
- jsonwebtoken
- mongoose
- morgan
- nodemon
- prettier
- ts-node
- typescript
