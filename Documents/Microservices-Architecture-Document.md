# LumaDesk - High-Level Design Document

**Project Name:** LumaDesk  
**Version:** 1.1
**Date:** October 20, 2025  

## Objective
To outline the high-level architecture, service responsibilities, and key data flows for the **LumaDesk** microservices application.

---

## 1. High-Level Architecture Overview
LumaDesk will be built using a **microservices architecture**. This approach decomposes the application into a set of small, independent services that communicate over a network. The entire system is fronted by an **API Gateway**, which serves as a single entry point for all client applications.

```
+----------------+      +------------------+
| Frontend       |----->| API Gateway      |
| (Web/Mobile)   |      | (Security/Routing)|
+----------------+      +------------------+
                           |       ^
                           |       | (Service Discovery)
                           v       |
+------------------+      +------------------+
| Discovery Server |<---->| App Services     |
| (Eureka)         |      | (Ticket, User, AI..)|
+------------------+      +------------------+
                           |
                           v
                     +-----------+
                     | MySQL DB  |
                     +-----------+
```

---


## 2.2. Data Architecture

The system strictly follows the **Database-per-Service** pattern. There is no shared database.

| Service | Database |
|----------|-----------|
| auth-service | lumadesk_auth_db |
| user-service | lumadesk_user_db |
| ticket-service | lumadesk_ticket_db |
| feedback-service | lumadesk_feedback_db |
| notification-service | lumadesk_notify_db |
| analytics-service | lumadesk_analytics_db (Read-optimized) |
| ai-agent-service | Redis (Cache) |

---

## 3. Infrastructure Services

### 3.1. API Gateway

**Purpose:** The single, secure entry point for all client requests.

**Responsibilities:**
- **Request Routing:** Maps public API paths (e.g., `/api/tickets/**`) to the correct internal service (e.g., ticket-service) using service discovery.
- **JWT Validation (Global Filter):** Validates Authorization header's JWT using the shared JWT_SECRET.
- **Public Route Bypassing:** Maintains a "public" list (e.g., `/api/auth/login`, `/api/auth/register`) that bypasses validation.
- **Header Enrichment:** Extracts `userId` and `role` from the token and forwards them as headers (`X-User-Id`, `X-User-Roles`).
- **CORS & Rate Limiting:** Manages CORS policies and protects from floods.

### 3.2. Discovery Server (Eureka)

**Purpose:** Dynamic registry of all active microservice instances.

**Responsibilities:**
- **Registration:** All services register with Eureka at startup.
- **Heartbeating:** Periodic alive signal.
- **Discovery:** Gateway & Feign clients resolve service addresses.

### 3.3. Config Server

**Purpose:** Centralized configuration management.

**Responsibilities:**
- **Serve Configuration:** Provides environment-specific configs (DB URLs, JWT_SECRET, etc.).
- **Central Management:** Maintains configs in a Git repo.

---

## 4. Application Services (Detailed)

### 4.1. auth-service (The Gatekeeper)

**Purpose:** Manages identity, authentication, and roles.

**Database:** `lumadesk_auth_db`  
**Table:** `users (user_id, email, password_hash, role, account_status)`

**Core Responsibilities:**
- `POST /api/auth/register` – Validates input, hashes password, saves user, and creates profile in user-service.
- `POST /api/auth/login` – Validates credentials and returns JWT.
- `PUT /api/auth/users/{userId}/role` – Admin role update.

**Key Interactions:**
- Calls: `user-service`
- Called By: `api-gateway`

---

### 4.2. user-service (The Profile Warehouse)

**Purpose:** Manages user profile data.

**Database:** `lumadesk_user_db`  
**Table:** `profiles (user_id, name, email, phone, address, employee_id, team_id)`

**Core Responsibilities:**
- `POST /internal/api/users` – Called by auth-service to create a user profile.
- `GET /api/users/me` – Returns user profile.
- `PUT /api/users/me` – Updates profile details.

**Key Interactions:**
- Called By: `auth-service`, `gateway`

---

### 4.3. ticket-service (The Core Engine)

**Purpose:** Handles the entire ticket lifecycle.

**Database:** `lumadesk_ticket_db`  
**Tables:** `tickets`, `ticket_comments`, `ticket_assignment_logs`

**Core Responsibilities:**
- Create, update, triage, assign, and manage ticket lifecycle.
- Logs ticket assignment history.
- Adds comments to tickets.

**Key Interactions:**
- Calls: `ai-agent-service`, `notification-service`
- Called By: `gateway`

---

### 4.4. feedback-service (The Suggestion Box)

**Purpose:** Manages customer feedback for resolved tickets.

**Database:** `lumadesk_feedback_db`

**Core Responsibilities:**
- `POST /api/feedback` – Submits feedback (1 per ticket).
- `GET /api/feedback` – Retrieves feedback.

**Key Interactions:**
- Calls: `ticket-service`
- Called By: `gateway`, `analytics-service`

---

### 4.5. notification-service (The Messenger)

**Purpose:** Handles all outgoing communications.

**Database:** `lumadesk_notify_db`

**Core Responsibilities:**
- `POST /api/notify/email` – Sends email notifications.
- `POST /api/notify/sms` – Sends SMS via external provider.

**Key Interactions:**
- Called By: `auth-service`, `ticket-service`, `feedback-service`

---

### 4.6. analytics-service (The Report Generator)

**Purpose:** Provides aggregated data and reports.

**Database:** `lumadesk_analytics_db` (Read-optimized)

**Core Responsibilities:**
- Periodic ETL job imports from `ticket-service` and `feedback-service`.
- Provides analytics endpoints (SLA rate, trends, heatmaps).

**Key Interactions:**
- Calls: `ticket-service`, `feedback-service`
- Called By: `gateway`

---

### 4.7. ai-agent-service (The AI Translator)

**Purpose:** Isolates external AI APIs and caches responses.

**Cache:** `Redis`

**Core Responsibilities:**
- Suggest triage and resolution using external AI.
- Caches responses to minimize latency and cost.

**Key Interactions:**
- Calls: External AI APIs
- Called By: `ticket-service`

---

## 5. Key End-to-End Flows

### 5.1. Flow: User Registration

1. Client → `POST /api/auth/register`
2. Gateway → Routes to auth-service (JWT bypassed).
3. auth-service → Saves to DB and calls user-service to create profile.
4. user-service → Saves to `lumadesk_user_db`.
5. auth-service → Returns 201 → Gateway → Client.

### 5.2. Flow: Authenticated Request (Create Ticket)

1. Client → `POST /api/tickets` (with JWT).
2. Gateway → Validates JWT and enriches headers.
3. ticket-service → Saves ticket, calls notification-service.
4. ticket-service → Returns 201 → Gateway → Client.


- **Logging:**  
  Centralized logging will be achieved without ELK. Each of the 8 services will have its own `logback-spring.xml` file configured to write logs to a single, shared file (e.g., `lumadesk-central.log`). The service name will be included in each log line for easy tracing.
