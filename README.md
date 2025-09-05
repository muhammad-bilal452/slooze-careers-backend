# 🍔 SLOOZE Food Ordering System (Backend)

Backend service for the **SLOOZE Food Ordering Application**.  
Built with **NestJS**, **TypeORM**, and **PostgreSQL**, this backend implements **role-based access control (RBAC)** and relational data restrictions for Admin, Managers, and Members.

---

## ✨ Features

- 🔐 **Authentication & Authorization** (JWT-based)
- 👤 **Role-Based Access Control (RBAC)**
  - Admin, Manager, Member
  - Function-level access based on role
- 🌍 **Relational Access**
  - Managers & Members limited to their assigned country
- 🍴 Manage restaurants & menu items
- 🛒 Order management (create, checkout, cancel)
- 💳 Payment method management
- 📦 PostgreSQL database with TypeORM entities

---

## 📦 Tech Stack

- **NestJS**
- **TypeScript**
- **TypeORM**
- **PostgreSQL**
- **JWT Authentication**

---

## ⚙️ Local Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/muhammad-bilal452/slooze-careers-backend
cd slooze-backend

```

### 2. Setup environment variables

Create a `.env` file in the root directory and add:

```
env
# Database connection
# Format: postgresql://<username>:<password>@<host>:<port>/<database>?schema=public
DATABASE_URL=postgresql://postgres:123456@localhost:5432/slooze_db?schema=public

# JWT
JWT_SECRET=slooze-api
JWT_EXPIRES_IN=1h

# App
PORT=8080
FRONT_END_URL=http://localhost:3000
```

### 3. Install dependencies
```
npm install

yarn install
```
### 4. Run the development server
```
nest start --watch
```