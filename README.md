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

## Usage flow

- register app at `/app/register` to create an app and an admin
- login with `/users/login`
- register new users with `/users/register`
- add `Authorization` header to http request as `Bearer ${token}`
- verify user token with `/users/verify`

---

## Development setup

- `git clone REPO_URL`
- `npm i` to install dependencies
- copy `.env.example` to `.env`
- add environment variables to `.env`
- `npm run dev` to start development server

---

## Deploy

- `npm run build` to build for production
- `npm run start` to start production server

---

## Packages

- bcrypt
- cors
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
