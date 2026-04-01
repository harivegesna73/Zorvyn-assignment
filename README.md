# Finance Data Processing and Access Control Backend

This is a backend REST API for a finance dashboard system, built to manage financial records, handle role-based access control (RBAC), and generate summary-level analytics. 

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
* **Value:** `[Integer ID of the user]`

**Roles:**
* **Admin:** Full access to all endpoints.
* **Analyst:** Can view financial records and dashboard summaries.
* **Viewer:** Can only view dashboard summaries.

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
