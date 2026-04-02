# Finance Data Processing and Access Control Backend

This is a backend REST API for a finance dashboard system, built to manage financial records, handle role-based access control (RBAC), and generate summary-level analytics. 

## 🌍 Live Deployment & Important Notes
**Live API URL:** `https://zorvyn-assignment.onrender.com`

* **Render Free Tier:** This API is deployed on Render's free tier. Please note that the server spins down after 15 minutes of inactivity (the first request may take ~15 seconds to wake the server). 
* **Ephemeral Storage:** Because Render uses an ephemeral file system, the SQLite database will reset to an empty state upon waking up. 
* **Database Seeding:** To make evaluation completely frictionless, I have seeded the database to automatically generate a default System Admin upon initialization. You can immediately begin testing the live endpoints using `user-id: 1` in your headers.

## 🚀 Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** SQLite (Chosen for frictionless local setup and evaluation)

## ⚙️ Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd finance-backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The SQLite database (`database.sqlite`) will be automatically generated upon starting the server.*

## 🔐 Authentication & Access Control
For the sake of this assignment, authentication is handled via a mock HTTP header to simplify testing.

To authenticate requests, pass the `user-id` in the header:
* **Key:** `user-id`
* **Value:** `[Integer ID of the user]` (Use `1` for the seeded System Admin)

**Roles:**
* **Admin:** Full access to all endpoints.
* **Analyst:** Can view financial records and dashboard summaries.
* **Viewer:** Can only view dashboard summaries.

## 🧪 Quick Start / Testing Guide
You can test the live API immediately using the seeded Admin account. Here are sample requests you can import directly into Postman or use via cURL:

### 1. View Dashboard Summary
* **Method:** `GET`
* **URL:** `https://zorvyn-assignment.onrender.com/dashboard/summary`
* **Headers:** 
  * `user-id: 1`

### 2. Create a New User (Admin Only)
* **Method:** `POST`
* **URL:** `https://zorvyn-assignment.onrender.com/users`
* **Headers:** 
  * `user-id: 1`
  * `Content-Type: application/json`
* **Body (JSON):**
  ```json
  {
    "name": "Alex Analyst",
    "email": "alex@zorvyn.com",
    "role": "Analyst"
  }
  ```

### 3. Create a Financial Record (Admin Only)
* **Method:** `POST`
* **URL:** `https://zorvyn-assignment.onrender.com/records`
* **Headers:** 
  * `user-id: 1`
  * `Content-Type: application/json`
* **Body (JSON):**
  ```json
  {
    "user_id": 1,
    "amount": 5000,
    "type": "income",
    "category": "Project Bonus",
    "date": "2026-04-02",
    "notes": "Initial test record"
  }
  ```

## 📡 API Endpoints Overview

### Users
* `POST /users` - Create a new user (Admin only)
* `GET /users` - List all users (Admin only)

### Financial Records
* `POST /records` - Create a new record (Admin only)
* `GET /records` - Get records (Admin/Analyst) *(Supports queries: `?type=income`, `?category=Salary`)*
* `PUT /records/:id` - Update a record (Admin only)
* `DELETE /records/:id` - Delete a record (Admin only)

### Dashboard
* `GET /dashboard/summary` - Get aggregated financial analytics (Admin/Analyst/Viewer)

## 🧠 Technical Decisions & Trade-offs
1. **SQLite Database:** Chosen over PostgreSQL/MongoDB to ensure the reviewer does not need to configure external database connections or Docker containers to run the project.
2. **Custom RBAC Middleware:** Implemented a scalable factory function (`authorize(...roles)`) to cleanly separate business logic from transport logic.
3. **SQL Aggregation:** The dashboard summary uses raw SQL `SUM` and `GROUP BY` clauses parsed via Promises, preventing the backend from having to pull thousands of rows into memory to calculate totals.
