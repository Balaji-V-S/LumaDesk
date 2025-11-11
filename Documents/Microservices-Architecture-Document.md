# LumaDesk - System Design Document
**Version:** 3.1
**Status:** In Testing  
**Last Updated:** November 9, 2025

---

## 1. Executive Summary

**LumaDesk** is a cloud-native, microservices-based network ticketing application designed for a broadband provider. It provides a complete, end-to-end solution for capturing, triaging, assigning, resolving, and analyzing customer-reported network issues.

The system is built on a **Java (Spring Boot)** backend using a strict **database-per-service** model, with all communication centralized through an **API Gateway** that handles authentication. The frontend is a modern **React (Vite)** single-page application (SPA) featuring a role-based UI for 10 distinct user types, from customers to C-level executives.

This document outlines the complete business and technical architecture, from initial business requirements to the specific implementation details of the frontend and backend.

---

## 2. Business Requirements

### 2.1. Stakeholders
* Customers (Residential & Business)
* Support Executives (L1)
* Triage Officers
* Technical Support Engineers (L2/L3)
* NOC Engineers & Admins
* Field Engineers
* Team Leads & Managers
* CXOs / Executives
* System Administrators

### 2.2. Core Objectives
* **Capture:** Allow customers and agents to raise service tickets from any device.
* **Track:** Provide real-time status updates, assignment history, and SLA monitoring.
* **Resolve:** Equip engineers with the tools and information to diagnose and fix issues efficiently.
* **Analyze:** Offer managers and executives dashboards and reports on ticket volume, resolution times, and team performance.
* **Assist:** (Future Scope) Integrate AI to suggest triage categories and potential resolutions.

### 2.3. Business Requirements Specification (BRS)

| ID | Requirement Description |
| :--- | :--- |
| BRS-01 | System must allow customers or agents to raise tickets from web/mobile. |
| BRS-02 | System must assign a unique ticket ID and log timestamps. |
| BRS-03 | System must allow setting and viewing priority and severity for every ticket. |
| BRS-04 | System must allow routing tickets to appropriate resolver groups (field/NOC/L1). |
| BRS-05 | System must support status transitions (New, Assigned, In Progress, Resolved, Closed). |
| BRS-06 | System must track SLAs and raise alerts for potential breaches. |
| BRS-07 | Users must be notified at key stages (assignment, resolution, closure). |
| BRS-08 | System must support customer confirmation and ticket re-opening. |
| BRS-09 | Feedback and ratings must be collected post-resolution. |
| BRS-10 | A dashboard must display ticket metrics and reports. |
| BRS-11 | Integration of Gen AI for triaging and resolution suggestion is desired. |

---

## 3. Epics & User Stories
### EPIC 1: Ticket Creation & Categorization
* **US 1.1:** As a **customer**, I want to raise a ticket via mobile/web.
* **US 1.2:** As a **support agent**, I want to log a ticket on behalf of a customer.
* **US 1.3:** As the **system**, I want to auto-categorize the ticket based on keywords.
* **US 1.4:** As the **system**, I want to assign a unique Ticket ID and timestamp.

### EPIC 2: Ticket Assignment & SLA Tracking
* **US 2.1:** As a **triage officer**, I want to assign severity and priority to tickets.
* **US 2.2:** As the **system**, I want to route tickets to the appropriate team (Field Engineer, NOC).
* **US 2.3:** As a **manager**, I want to track SLA countdowns per ticket.
* **US 2.4:** As a **resolver**, I want to view all open tickets assigned to me, prioritized by SLA.

### EPIC 3: Ticket Diagnosis and Resolution
* **US 3.1:** As a **resolver**, I want to update ticket status ("In Progress", "On Hold").
* **US 3.2:** As a **resolver**, I want to record actions taken (e.g., port reset, ONT replaced).
* **US 3.3:** As the **system**, I want to attach logs and diagnostic reports to a ticket.
* **US 3.4:** As a **field engineer**, I want to update the ticket via mobile after an on-site visit.

### EPIC 4: Ticket Closure and Feedback
* **US 4.1:** As a **resolver**, I want to mark the ticket as resolved.
* **US 4.2:** As the **system**, I want to notify the customer with a resolution summary.
* **US 4.3:** As a **customer**, I want to confirm the issue is resolved, or reopen it.
* **US 4.4:** As a **customer**, I want to provide feedback or rate the service.

### EPIC 5: Dashboard, Reports & Alerts
* **US 5.1:** As a **manager**, I want to view open, resolved, and overdue tickets by team.
* **US 5.2:** As a **team lead**, I want to be alerted if an SLA is about to breach.
* **US 5.3:** As a **NOC admin**, I want to view ticket heatmaps for frequent outage zones.
* **US 5.4:** As a **CXO**, I want daily reports on ticket volume and resolution time.

### EPIC 6: AI-Powered Support
* **US 6.1:** As a **support agent**, I want AI to suggest severity and probable root cause.
* **US 6.2:** As a **resolver**, I want to ask AI for possible resolution steps.
* **US 6.3:** As the **system**, I want to auto-categorize and auto-resolve simple issues.
* **US 6.4:** As a **customer**, I want to interact with a chatbot for self-troubleshooting.

---

## 4. Backend System Architecture

### 4.1. Architecture Philosophy
The backend follows a strict **microservices architecture**.
* **Single Responsibility:** Each service has one job (e.g., auth, tickets).
* **Autonomy:** Services are developed, deployed, and scaled independently.
* **Decentralized Data:** Each service owns its own database. There is **no database sharing**.
* **API-First:** Services communicate via REST APIs (using Spring Cloud Webclient) or future event-driven methods.

### 4.2. Architecture Diagram

[Link to LumaDesk Architecture Diagram]

(This section links to the definitive architecture diagram, which outlines the flow between the client, API Gateway, infrastructure services, and the various application microservices and their dedicated databases.)

### 4.3. Infrastructure Services

### API Gateway (Spring Cloud Gateway)
**Role:** The single entry point to the system.

**Responsibilities:**
- Routing incoming traffic to respective services.
- Handling **security** and **rate limiting**.

**Security:**
- Performs **local JWT validation** on all incoming requests using a shared secret.
- **Whitelisted routes** (e.g., `/api/auth/login`, `/api/auth/register`) bypass JWT validation.

**Header Enrichment:**
- Injects headers before forwarding requests:
  - `X-User-Id`
  - `X-User-Roles`

---

### Discovery Server (Eureka)
**Role:** The **service registry** (acts like a "phone book").

**Responsibilities:**
- All microservices **register on startup**.
- Enables **service discovery** for the API Gateway and Webclient clients.

---

### Config Server (Spring Cloud Config)
**Role:** Centralized configuration management.

**Responsibilities:**
- Stores shared configuration properties for all services, such as:
  - Database URLs
  - JWT secrets
  - API keys

---

### 4.4. Application Services

### auth-service (The Gatekeeper)
**Manages:**
- User identity (email, password)
- Roles
- Account status

**Key APIs:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `PUT /api/auth/users/{userId}/role` (Admin only)

**Interactions:**
- Calls **user-service** via Webclient during user registration.

---

### user-service (The Profile Warehouse)
**Manages:**
- User profile data (name, phone, address, `employee_id`, `team_id`)

**Key APIs:**
- `GET /api/users/me`
- `PUT /api/users/me`
- `POST /internal/api/users` *(internal-only)*

**Interactions:**
- Called by **auth-service** during registration.

---

### ticket-service (The Core Engine)
**Manages:**
- Full ticket lifecycle:
  - Status
  - Priority
  - Comments
  - Assignment history

**Key APIs:**
- `POST /api/tickets`
- `GET /api/tickets/{ticketId}`
- `PUT /api/tickets/{ticketId}/assign`
- `POST /api/tickets/{ticketId}/comments`

**Interactions:**
- Calls **ai-agent-service** for AI-based suggestions.
- Calls **notification-service** for user alerts.

---

### feedback-service (The Suggestion Box)
**Manages:**
- Customer feedback for resolved tickets.
- Feedback includes **1–5 star ratings** and **comments**.

**Key APIs:**
- `POST /api/feedback`
- `GET /api/feedback?ticketId={ticketId}`

---

### notification-service (The Messenger)
**Manages:**
- In-app user notifications.

**Key APIs:**
- `POST /api/notify/push`
- `POST /api/notify/push-batch`
- `GET /api/notifications/me`

**Interactions:**
- Called by **ticket-service**, **feedback-service**, and others.

---

### analytics-service (The Report Generator)
**Manages:**
- Aggregated, **read-only data** for dashboards.
- Runs background ETL jobs to collect and process data from other services.

**Key APIs:**
- `GET /api/analytics/sla-compliance`
- `GET /api/analytics/heatmap`

---

### ai-agent-service (The AI Translator)
**Manages:**
- Acts as an **anti-corruption layer** between internal services and external AI models (e.g., Gemini, OpenAI).
- Formats prompts and parses responses from AI providers.

**Key APIs:**
- `POST /api/ai/suggest-triage`
- `POST /api/ai/suggest-resolution`

---

## Summary
| Service | Role | Key Responsibility |
|----------|------|--------------------|
| API Gateway | Entry point | Routing, JWT validation, header enrichment |
| Eureka | Service registry | Enables discovery between services |
| Config Server | Configuration center | Centralized property management |
| auth-service | Gatekeeper | Authentication, user roles |
| user-service | Profile warehouse | User profile management |
| ticket-service | Core engine | Ticket lifecycle & AI suggestions |
| feedback-service | Suggestion box | Feedback collection |
| notification-service | Messenger | User notifications |
| analytics-service | Report generator | Data aggregation for dashboards |
| ai-agent-service | AI translator | Interface with AI models |


---

## 5. Data Architecture

## auth-service (`lumadesk_auth_db`)

### Table: `users`
| Column | Type | Description |
|--------|------|-------------|
| `user_id` | **PK**, UUID or Long | Unique identifier for each user |
| `email` | String, **Unique** | User’s email address |
| `password_hash` | String | Hashed user password |
| `role` | String, Enum | User role (e.g., ADMIN, AGENT, CUSTOMER) |
| `account_status` | String, Enum(`ACTIVE`, `LOCKED`) | Current account state |
| `created_at` | Timestamp | Record creation time |
| `updated_at` | Timestamp | Last update time |

---

## user-service (`lumadesk_user_db`)

### Table: `profiles`
| Column | Type | Description |
|--------|------|-------------|
| `user_id` | **PK**, FK to `auth_db.users.user_id` | Matches `user_id` in `auth-service` |
| `name` | String | Full name of the user |
| `email` | String | Replicated for convenience |
| `phone` | String | Contact phone number |
| `address` | String | Address of the user |
| `pin_code` | String | Postal code |
| `employee_id` | String, Nullable | Internal employee reference |
| `team_id` | String, Nullable | Team identifier |
| `created_at` | Timestamp | Record creation time |
| `updated_at` | Timestamp | Last update time |

---

## ticket-service (`lumadesk_ticket_db`)

### Table: `tickets`
| Column | Type | Description |
|--------|------|-------------|
| `ticket_id` | **PK**, String (e.g., `"T-1001"`) | Unique ticket identifier |
| `title` | String | Short summary of the issue |
| `description` | Text | Detailed description |
| `status` | String, Enum(`NEW`, `ASSIGNED`, `IN_PROGRESS`, `ON_HOLD`, `RESOLVED`, `CLOSED`, `REOPENED`) | Current ticket state |
| `priority` | String, Enum(`LOW`, `MEDIUM`, `HIGH`, `URGENT`) | Urgency level |
| `severity` | String, Enum | Technical/business impact |
| `category` | String | Ticket category |
| `creator_user_id` | String, FK to `user.user_id` | User who created the ticket |
| `customer_user_id` | String, FK to `user.user_id` | Customer for whom the ticket was created |
| `assigned_agent_id` | String, Nullable, FK to `user.user_id` | Assigned agent |
| `assigned_team_id` | String, Nullable | Assigned team |
| `sla_due_date` | Timestamp, Nullable | SLA target due date |
| `created_at` | Timestamp | Ticket creation time |
| `updated_at` | Timestamp | Last update time |
| `@Version` | Long | Used for **Optimistic Locking** |

---

### Table: `ticket_comments`
| Column | Type | Description |
|--------|------|-------------|
| `comment_id` | **PK** | Unique identifier for each comment |
| `ticket_id` | FK | Associated ticket |
| `author_user_id` | FK | Comment author |
| `body` | Text | Comment content |
| `created_at` | Timestamp | Creation time |

---

### Table: `ticket_assignment_logs`
| Column | Type | Description |
|--------|------|-------------|
| `log_id` | **PK** | Unique identifier for each log entry |
| `ticket_id` | FK | Associated ticket |
| `from_agent_id` | String, Nullable | Previous agent (if reassigned) |
| `to_agent_id` | String, Nullable | New agent |
| `timestamp` | Timestamp | When the assignment occurred |

---

## notification-service (`lumadesk_notify_db`)

### Table: `notifications`
| Column | Type | Description |
|--------|------|-------------|
| `notification_id` | **PK** | Unique notification ID |
| `recipient_user_id` | String, Indexed | The individual who receives the notification |
| `sent_by_user_id` | String | The user who triggered it |
| `subject` | String | e.g., `"Ticket Resolved"` |
| `message` | Text | Notification message content |
| `resource_type` | String | e.g., `"TICKET"` |
| `resource_id` | String | e.g., `"T-1001"` |
| `is_read` | Boolean, default: `false` | Whether the user has read the notification |
| `created_at` | Timestamp | Notification creation time |

---

## Summary

| Service | Database | Key Table | Primary Entity |
|----------|-----------|------------|----------------|
| **auth-service** | `lumadesk_auth_db` | `users` | Authentication & roles |
| **user-service** | `lumadesk_user_db` | `profiles` | User profile data |
| **ticket-service** | `lumadesk_ticket_db` | `tickets`, `ticket_comments`, `ticket_assignment_logs` | Ticket lifecycle |
| **notification-service** | `lumadesk_notify_db` | `notifications` | In-app notifications |

---

## 6. Core End-to-End Flows

## 6.1. Flow: User Registration (Compensating Transaction)

**Flow Overview:**
1. **Client** → `POST /api/auth/register` (with name, email, password, phone, etc.)
2. **API Gateway** → Bypasses JWT validation (public route) and routes to `auth-service`.
3. **auth-service** → Starts a transaction.
4. **auth-service** → Validates data and hashes password.
5. **auth-service** → Saves new user to `lumadesk_auth_db` (default role: `ROLE_CUSTOMER`).
6. **auth-service** → [Webclient Call] → `POST /internal/api/users` (sends `userId`, name, email, phone to `user-service`).
7. **user-service** → Saves profile to `lumadesk_user_db`. Returns **201 Created** to `auth-service`.
8. **auth-service** → Receives success response, commits transaction, and returns **201 Created** to the client.

**Failure Handling (Compensating Transaction):**
- **(6a)**: `user-service` is down or returns `500`.
- **(6b)**: `auth-service` catches Webclient exception.
- **(6c)**: `auth-service` **rolls back** transaction (deletes user from `lumadesk_auth_db`).
- **(6d)**: `auth-service` returns **503 Service Unavailable** to client — _“Please try again later.”_

---

## 6.2. Flow: Authenticated Request (e.g., Create Ticket)

**Flow Overview:**
1. **Client** → `POST /api/tickets` (with `{ title, description }` and `Authorization: Bearer <token>`).
2. **API Gateway** → Intercepts request (not a public route).
3. **API Gateway** → Validates JWT locally (signature, expiration).
4. **API Gateway** → Extracts JWT claims, adds headers:
   - `X-User-Id: 123`
   - `X-User-Roles: ROLE_CUSTOMER`
5. **API Gateway** → Routes enriched request to `ticket-service`.
6. **ticket-service** → Receives and trusts enriched headers.
7. **ticket-service** → Reads `X-User-Id`, sets:
   - `creator_user_id = "123"`
   - `customer_user_id = "123"`
8. **ticket-service** → Saves new ticket to `lumadesk_ticket_db`.
9. **ticket-service** → [Webclient Call] → `notification-service` to create a notification.
10. **ticket-service** → Returns **201 Created** with ticket data to client.

---

## 6.3. Flow: Role Promotion (Admin)

**Scenario:** An Admin promotes a user to a new role.

**Flow Overview:**
1. **Admin UI** → Admin clicks “Promote User”.
2. **Client** → `PUT /api/auth/users/123/role` (with `{ role: "ROLE_FIELD_ENGINEER" }` and Admin JWT).
3. **API Gateway** → Validates Admin JWT, routes to `auth-service`.
4. **auth-service** → Updates user role in `lumadesk_auth_db` for user `123`.
5. **Client** → `PUT /api/admin/users/123` (with `{ employee_id: "E-456", team_id: "FIELD_OPS" }` and Admin JWT).
6. **API Gateway** → Validates Admin JWT, routes to `user-service`.
7. **user-service** → Updates user profile in `lumadesk_user_db`.
8. User `123` logs out and logs back in → receives new JWT with role `ROLE_FIELD_ENGINEER`.

---

## 6.4. Flow: Workgroup Notification (New Triage Ticket)

**Scenario:** A new ticket is created and assigned to a triage team.  
The system must notify all users with role `ROLE_TRIAGE_OFFICER`.

**Flow Overview:**
1. **ticket-service** → New ticket created with:
   - `status = NEW`
   - `assigned_team = TRIAGE_QUEUE`
2. **ticket-service** → [Webclient Call] → `GET /api/users/internal?role=ROLE_TRIAGE_OFFICER` (to `user-service`).
3. **user-service** → Queries `lumadesk_auth_db` or local cache, returns:
   ```json
   ["201", "205", "209"]

---

## 7. Authentication & Authorization (RBAC)

# 7.1. Roles

This section defines the key user roles in the Lumadesk platform and their core responsibilities.

---

## ROLE_CUSTOMER
- The end-user of the system.  
- Permissions:
  - Create new support tickets.  
  - View and comment on their own tickets.  

---

## ROLE_SUPPORT_AGENT
- L1 support staff (first line of customer support).  
- Permissions:
  - Create and edit tickets on behalf of customers.  
  - View assigned or customer-related tickets.  

---

## ROLE_TRIAGE_OFFICER
- Ticket triage specialist.  
- Permissions:
  - Review new tickets.  
  - Assign priority, severity, and route tickets to appropriate teams or agents.  

---

## ROLE_TECH_SUPPORT_ENGINEER
- L2/L3 remote support engineer.  
- Permissions:
  - Work on tickets routed to their queue.  
  - Provide resolutions or escalate complex cases.  

---

## ROLE_NOC_ENGINEER
- Network Operations Center engineer.  
- Permissions:
  - Handle backend infrastructure or outage-related tickets.  
  - Monitor system and network health incidents.  

---

## ROLE_FIELD_ENGINEER
- On-site technician.  
- Permissions:
  - Handle on-site visit tickets.  
  - Update ticket statuses and notes after field work.  

---

## ROLE_TEAM_LEAD
- Leads a specific functional team (e.g., Field Engineers).  
- Permissions:
  - Assign tickets to team members.  
  - Monitor and manage team workload and performance.  

---

## ROLE_MANAGER
- Manages multiple teams or departments.  
- Permissions:
  - View analytics and reports.  
  - Manage staffing and workload balance.  
  - Handle ticket escalations.  

---

## ROLE_NOC_ADMIN
- Network Operations Administrator.  
- Permissions:
  - Oversee NOC operations.  
  - View and manage network health dashboards.  
  - Respond to major outage alerts.  

---

## ROLE_CXO
- Executive-level leadership role.  
- Permissions:
  - View high-level summary reports and performance metrics.  
  - Monitor SLA compliance and organizational performance.  

---

## Summary Table

| Role | Description | Example Responsibilities |
|------|--------------|---------------------------|
| ROLE_CUSTOMER | End-user | Create and view own tickets |
| ROLE_SUPPORT_AGENT | L1 support | Create or edit customer tickets |
| ROLE_TRIAGE_OFFICER | Ticket triage | Assign priority and route tickets |
| ROLE_TECH_SUPPORT_ENGINEER | L2/L3 support | Resolve or escalate tickets |
| ROLE_NOC_ENGINEER | Network operations | Handle backend or outage tickets |
| ROLE_FIELD_ENGINEER | On-site technician | Manage on-site visits |
| ROLE_TEAM_LEAD | Team lead | Assign and monitor team work |
| ROLE_MANAGER | Department manager | Reports and escalations |
| ROLE_NOC_ADMIN | NOC administrator | Manage network dashboards |
| ROLE_CXO | Executive | Access business-level reports |

---

## 8. Frontend Architecture

### 8.1. Stack
Framework: **React 18+ (Vite)**  
Styling: **TailwindCSS 4.0**  
Animation: **framer-motion**  
Icons: **lucide-react**  
Routing: **react-router-dom v6**  
API: **axios**  

### 8.2. Folder Structure
```
LumaDesk-frontend/
│
├── public/
│   └── assets/ (lumadesk-logo.png, etc.)
│
├── src/
│   ├── api/
│   │   └── axiosInstance.jsx
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── config/
│   │   │   └── roleRoutes.js
│   │   ├── layout/
│   │   │   ├── NavBar.jsx
│   │   │   └── SideBar.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       └── DataTable.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   │
│   ├── lib/
│   │   └── utils.js
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── CustomerDashboard.jsx
│   │   ├── UnauthorizedPage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css
│
└── package.json
```

### 8.3. Core Frontend Concepts

**State Management (AuthContext)**  
- Located in `src/context/AuthContext.jsx`.  
- Manages: `user`, `token`, `isAuthenticated`, and `isLoading`.  
- Provides global functions: `login()` and `logout()`.  
- On load, hydrates state from `localStorage`.  
- `login(authData)` expects: `{ token, userId, role, fullName }` from API.  
- Custom hook `useAuth()` gives access to this context.  

**Routing (`src/App.jsx`)**  
- Uses `react-router-dom`.  
- Public routes: `/login`, `/register`.  
- Protected route: `/dashboard/*`, wrapped in `ProtectedRoute`.  

**Protected Routing (`src/components/auth/ProtectedRoute.jsx`)**  
- Uses `useAuth()` hook.  
- Handles `isLoading` (shows spinner).  
- Redirects unauthenticated users to `/login`.  
- Future: Validate `allowedRoles` → redirect to `/unauthorized`.  

**Role-Based Layouts (`src/layouts/DashboardLayout.jsx`)**  
- Main shell for all roles.  
- Renders `NavBar` + `SideBar`.  
- Uses nested `<Routes>` for role-specific views.  
- Uses `user.role` from `useAuth()` to filter accessible routes.  

**Navigation Config (`src/components/config/roleRoutes.js`)**  
- Central object mapping roles → navigation items (path, label, icon).  
- `SideBar.jsx` dynamically imports config and renders appropriate links.  

**Design System (`src/components/ui/`)**  
- Custom animated components: `Button.jsx`, `Input.jsx`, etc.  
- Built using TailwindCSS + framer-motion for fluid UI.  

---

## 9. System Requirements (SRS)

### 9.1. Functional Requirements

| ID | Requirement |
| :-- | :-- |
| FR-01 | Role-based login for all 10 roles. |
| FR-02 | Ticket creation form (for Customer and Agent). |
| FR-03 | Auto-generation of unique Ticket ID (e.g., T-1001). |
| FR-04 | Assignment engine (Triage) to allocate tickets. |
| FR-05 | Ability to edit status, priority, and add comments. |
| FR-06 | SLA timers per ticket based on priority. |
| FR-07 | SLA alerts (in-app) for nearing deadlines. |
| FR-08 | Ticket resolution form to capture final action. |
| FR-09 | Notification engine (in-app) for status changes. |
| FR-10 | Reopen ticket if unresolved by customer. |
| FR-11 | Feedback module (1–5 rating + comment). |
| FR-12 | Admin dashboard with charts and filters. |
| FR-13 | AI prompt-based triage/resolution suggestions. |
| FR-14 | Export reports as CSV/PDF. |

### 9.2. Non-Functional Requirements

| ID | Requirement |
| :-- | :-- |
| NFR-01 | System should support 1000 concurrent users. |
| NFR-02 | 99.9% uptime for all services. |
| NFR-03 | API response time < 2s for key ops. |
| NFR-04 | Passwords hashed (BCrypt), SSL in transit. |
| NFR-05 | Maintain audit trail for ticket state changes. |
| NFR-06 | Responsive UI (Mobile, Tablet, Desktop). |
| NFR-07 | Modular architecture for future scalability. |

---

## 10. API Endpoint Overview (High-Level)

| Service | Method | Path | Description |
| :-- | :-- | :-- | :-- |
| API Gateway | (All) | /api/... | Routes and validates JWT. |
| auth-service | POST | /api/auth/login | (Public) Authenticates and issues JWT. |
| auth-service | POST | /api/auth/register | (Public) Creates new customer + profile. |
| auth-service | PUT | /api/auth/users/{id}/role | (Admin) Updates a user's role. |
| user-service | GET | /api/users/me | Gets logged-in user profile. |
| user-service | PUT | /api/users/me | Updates logged-in user profile. |
| user-service | POST | /internal/api/users | (Internal) Creates user profile. |
| ticket-service | POST | /api/tickets | Creates a new ticket. |
| ticket-service | GET | /api/tickets | Lists tickets for user/agent. |
| ticket-service | GET | /api/tickets/{id} | Gets ticket details. |
| ticket-service | PUT | /api/tickets/{id}/assign | (Agent+) Assigns ticket to agent/team. |
| ticket-service | POST | /api/tickets/{id}/comments | Adds a comment to ticket. |
| feedback-service | POST | /api/feedback | (Customer) Submits ticket feedback. |
| notify-service | GET | /api/notifications/me | Gets unread notifications. |
| notify-service | POST | /api/notify/push-batch | (Internal) Creates bulk notifications. |
| ai-agent-service | POST | /api/ai/suggest-triage | (Agent+) Suggests category/priority. |
| analytics-service | GET | /api/analytics/sla-compliance | (Manager+) Gets SLA report data. |

---

**End of Document**  
© 2025 LumaDesk System Design Documentation v3.0
