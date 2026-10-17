# 🚀 NestJS Blog API (Learning Journey)

A robust, modular RESTful Blog API built from scratch using **NestJS**, **TypeScript**, **TypeORM**, and **SQLite**, featuring comprehensive **Unit (Jest)** and **End-to-End (Supertest)** testing suites.

This project was built as part of a hands-on learning roadmap to master enterprise backend architecture, dependency injection, database ORMs, and automated testing.

---

## 🏗️ Tech Stack
* **Framework:** NestJS (Node.js framework)
* **Language:** TypeScript
* **Database & ORM:** SQLite via TypeORM
* **Validation:** `class-validator` & `class-transformer`
* **Testing:** Jest (Unit Tests) & Supertest (E2E Tests)

---

## 🔥 Engineering Hurdles & How I Solved Them

Building real-world applications comes with roadblocks. Documenting these challenges and their solutions helped solidify core backend concepts:

1. **The Prisma Installation Hang:**
   * *Problem:* The Prisma CLI hung indefinitely during setup due to network/cache stalls.
   * *Solution:* Cut losses and pivoted to **TypeORM**, which has first-class integration in NestJS, utilizing a familiar repository pattern.
2. **Missing SQLite Driver:**
   * *Problem:* TypeORM threw a `DriverPackageNotInstalledError` on startup because it expects a specific underlying SQLite connector.
   * *Solution:* Identified and installed the required `better-sqlite3` driver package (`npm install better-sqlite3`).
3. **Async Type Mismatches in Controllers:**
   * *Problem:* Shifting from synchronous in-memory arrays to asynchronous database queries threw TypeScript errors because the controller wasn't awaiting promises.
   * *Solution:* Marked controller methods as `async` and updated return signatures to handle `Promise<Blog[]>`.
4. **Jest Mocking for Database Repositories:**
   * *Problem:* Integrating TypeORM broke existing unit tests because they weren't wired up to mock database operations.
   * *Solution:* Properly mocked TypeORM's repository methods (`find`, `findOneBy`, `save`, `delete`) and isolated controller unit tests using service mocks to ensure lightning-fast, self-contained test runs.

---

## 🏆 Key Features
* **Modular Architecture:** Clean separation of concerns using NestJS Modules, Controllers, and Services.
* **Data Persistence:** Persistent storage using SQLite and TypeORM repositories instead of volatile in-memory arrays.
* **Automatic DTO Validation:** Requests are intercepted and validated using `ValidationPipe`, stripping unauthorized properties.
* **Robust Testing Suite:** 
  * Unit tests isolating business logic with mocked dependencies.
  * E2E tests simulating full HTTP request pipelines from route to database.

---

## ⚙️ Getting Started

### Prerequisites
* Node.js installed on your machine.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd blogapp

## 🔐 Security & Authentication
* **Password Hashing:** Passwords are securely hashed using `bcrypt` with salt rounds before storing them in SQLite.
* **JWT Authentication:** Issuing JSON Web Tokens upon successful sign-in via `@nestjs/jwt`.
* **Route Protection:** Public endpoints (`GET /blog`, `GET /blog/:id`) remain open, while sensitive operations (`POST`, `PATCH`, `DELETE`) are strictly guarded using `@UseGuards(AuthGuard('jwt'))`.