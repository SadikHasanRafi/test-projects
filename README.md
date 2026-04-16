# Next.js Auth: JWT & Auth.js (NextAuth)

This branch serves as a dedicated learning environment for implementing secure authentication patterns in Next.js using **Auth.js** and **JSON Web Tokens (JWT)**.

## 🧠 Learning Objectives
* Configuring **Auth.js** (formerly NextAuth) for session management.
* Implementing **JWT-based** authentication for stateless security.
* Protecting API routes and server components.
* Handling Middleware for client-side route protection.

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router)
* **Auth:** Auth.js / NextAuth.v5
* **Security:** JWT (JSON Web Tokens)
* **Styling:** Tailwind CSS

## 🚀 Key Features Implemented
- [x] **Credential Provider:** Custom login logic with email/password.
- [x] **JWT Callbacks:** Extending the token with custom user data.
- [x] **Middleware:** Redirecting unauthenticated users from private routes.
- [x] **Session Access:** Using `auth()` in Server Components and `useSession()` on the client.

## 📝 Usage
To run this specific project:
```bash
git checkout auth-jwt-learning
npm install
npm run dev