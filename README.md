# 🔐 Secure OTP Authentication System

**Developer:** Keshav Sharma  
**Tech Stack:** TypeScript, Node.js, Express, PostgreSQL, Redis, Prisma, JWT, Bcrypt  
**Date:** August 2025  

---

## 🚀 Project Overview
A **secure OTP-based authentication system** with full password reset flow, designed for **production-ready applications**.  
It emphasizes **security, scalability, and modular code** for backend systems.

---

## 🛠 Features
- 🔑 OTP-based login system for enhanced security  
- 🛡 Password hashing using **Bcrypt**  
- 🔒 Session management with **JWT tokens**  
- ⚡ In-memory OTP validation with **Redis**  
- 📦 Database management with **PostgreSQL + Prisma ORM**  
- 🔄 Modular, scalable backend architecture  
- 🔁 Full password reset flow with OTP verification  

---

## 📂 Architecture
Client → Express.js API → Redis (OTP) + PostgreSQL (User Data) → JWT Auth

yaml
Copy
Edit

---

## 💻 API Endpoints

### Auth Routes
| Method | Endpoint                   | Description                                  |
|--------|----------------------------|----------------------------------------------|
| POST   | /auth/register             | Register a new user                          |
| POST   | /auth/login                | Login user                                   |
| POST   | /auth/logout               | Logout user                                  |
| POST   | /auth/verify-otp           | Verify OTP                                   |
| POST   | /auth/reset-password       | Request password reset                       |
| POST   | /auth/reset-password-otp   | Verify OTP for password reset                |
| POST   | /auth/reset-password-final | Finalize password reset                      |

### User Routes
| Method | Endpoint | Description                     |
|--------|----------|---------------------------------|
| GET    | /user    | Get logged-in user info (JWT)   |

---

## ⚡ Key Technologies
- **TypeScript** – Type-safe backend development  
- **Node.js & Express** – API and server logic  
- **PostgreSQL + Prisma** – Relational database management  
- **Redis** – OTP storage for fast validation  
- **JWT** – Secure session management  
- **Bcrypt** – Password hashing and security  

---

## 📝 Highlights
- ✅ Multi-layer authentication with JWT + OTP  
- ✅ Secure password reset flow  
- ✅ Fast, modular, and production-ready code  

---
