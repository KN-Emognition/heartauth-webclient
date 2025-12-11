# Auth Webclient for Heartauth Demo

This project is a **Next.js webclient** for the **Heartauth authentication system**.  
It provides a user-friendly interface for users to log in, register.

It integrates with **Keycloak** using **NextAuth.js** for secure authentication.

---

## ✨ Features

- 🔐 User registration and login
- 🔄 OAuth2 / OpenID Connect with Keycloak
- 👤 Session and profile handling via NextAuth
- ⚙️ Environment-based configuration
- 🚀 Easy local and cloud deployment

---

## 🔧 Environment Variables

Create a `.env.local` file in the root of the project and define the following variables:

### Example `.env.local`

```env
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000

NEXT_KEYCLOAK_CLIENT_SECRET=your-keycloak-client-secret
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=heartauth-web
NEXT_PUBLIC_KEYCLOAK_ISSUER=https://keycloak.example.com/realms/heartauth
```
