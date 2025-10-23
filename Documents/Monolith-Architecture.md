# LumaDesk - Software Design Document (SDD)
**Version:** 2.0 (Monolithic Architecture)
**Date:** October 22, 2025
**Status:** In Development

---

## 1. Introduction

### 1.1. Purpose
This document provides a detailed technical design for the **LumaDesk Intelligent Helpdesk Platform**. It describes the software architecture, module design, database schema, API specifications, and security implementation for the **Modular Monolith** version of the application. This document is intended for the development team to ensure a consistent and high-quality implementation.

### 1.2. Scope
This document covers the entire backend system for LumaDesk. This includes:
* User Authentication and Authorization
* Ticket Lifecycle Management
* SLA and Routing Logic
* Analytics and Reporting
* AI Integration
* Notifications

This document **does not** cover the frontend (web/mobile) client implementation or the underlying infrastructure/deployment pipeline.

### 1.3. Architecture Overview
LumaDesk will be built as a **Modular Monolith**. This approach was chosen to maximize development speed and simplicity for the capstone project, while maintaining a clean, separated codebase that mimics microservice boundaries.

The application is a single Spring Boot project, but its internal structure is divided into distinct feature modules (Java packages). This allows for strong encapsulation and makes it possible to refactor a module into a separate microservice in the future with minimal effort.

---

## 2. System Architecture

### 2.1. Monolithic Architecture Diagram
```

+-------------------------------------------------+
|               LumaDesk Application              |
|              (Single Spring Boot JAR)           |
|                                                 |
| +-----------+   +-------------+   +-----------+ |
| | API Layer |   |  Security   |   |  Config   | |
| |(Controllers)|   | (Spring Sec)  |   | (Logging) | |
| +-----+-----+   +-------------+   +-----------+ |
|       |                                         |
|       v                                         |
| +---------------------------------------------+ |
| |                Service Layer                | |
| | +---------+ +---------+ +-------------+   | |
| | | Ticket- | |  User-  | | Notification|   | |
| | | Service |<-+->| Service | | Service     |   | |
| | +---------+ +---------+ +-------------+   | |
| |     |           |               ^         | |
| | +---------+ +---------+         |         | |
| | |   AI-   | | Analytics|        /          | |
| | | Service | | Service |       /           | |
| | +---------+ +---------+      /            | |
| +----------------------------|--------------+ |
|                              |                |
|                              v                |
| +---------------------------------------------+ |
| |             Data Access Layer               | |
| |          (All Repositories)                 | |
| +---------------------------------------------+ |
|                              |                |
|                              v                |
|                 +-----------------------+       |
|                 |    Single MySQL DB    |       |
|                 +-----------------------+       |
|                                                 |
+-------------------------------------------------+

```

### 2.2. Package (Module) Structure
The root package `com.lumadesk` will contain the following top-level packages, each representing a logical module.

* **`com.lumadesk.config`**: Contains all cross-cutting configuration beans (e.g., `SecurityConfig`, `OpenApiConfig`, `LoggingAspect`).
* **`com.lumadesk.auth`**: Manages user identity, roles, permissions, and authentication.
* **`com.lumadesk.tickets`**: Manages the complete ticket lifecycle, comments, SLA, and routing logic.
* **`com.lumadesk.analytics`**: Manages data aggregation for dashboards and reports.
* **`com.lumadesk.notifications`**: A decoupled module for sending emails. It will be called directly by other services.
* **`com.lumadesk.ai`**: A wrapper module for making external HTTP calls to a Generative AI model.
* **`com.lumadesk.shared.exception`**: Contains global exception handlers (`@ControllerAdvice`) and custom exceptions.

---

## 3. Database Design

* **Database:** Single MySQL Server instance
* **Schema Name:** `lumadesk_db`
* **Framework:** Spring Data JPA (Hibernate)

### 3.1. Entity Relationship Diagram (ERD)
```

+--------------+ 1..* 1 +--------------+
|     User     |-----------+>|    Ticket    | (CreatedBy)
+--------------+           +--------------+
| 1..* | 1..*
|                          |
|     +--------------+     |
'---->|   Comment    |<----'
(Author) +--------------+ (Ticket)
1..* 1

```

### 3.2. Key Entity Definitions

#### `User` (in `auth` module)
* **Table:** `users`
* **Description:** Stores all user accounts, from Customers to CXOs.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | **Primary Key** | Unique user identifier |
| `first_name` | `String` | Not Null | User's first name |
| `last_name` | `String` | Not Null | User's last name |
| `email` | `String` | Not Null, **Unique** | Login username |
| `password` | `String` | Not Null | Bcrypt-hashed password |
| `role` | `String` | Not Null | Stores the user's role (e.g., "ROLE_CUSTOMER", "ROLE_AGENT_L1") |

#### `Ticket` (in `tickets` module)
* **Table:** `tickets`
* **Description:** The core entity for the helpdesk.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | **Primary Key** | Unique ticket identifier |
| `title` | `String` | Not Null | Short summary of the issue |
| `description` | `String(2000)`| Not Null | Full details of the issue |
| `status` | `String` | Not Null | e.g., "NEW", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED" |
| `priority` | `String` | Not Null | e.g., "P1", "P2", "P3", "P4" |
| `category` | `String` | Nullable | e.g., "Hardware", "Software" (can be set by AI) |
| `created_at` | `Instant` | Not Null | Timestamp of creation |
| `updated_at` | `Instant` | Not Null | Timestamp of last update |
| `sla_due_date`| `Instant` | Nullable | Calculated deadline for resolution |
| `created_by_id` | `Long` | **FK (users.id)** | The user who created the ticket |
| `assigned_to_id`| `Long` | **FK (users.id)** | The agent working on the ticket (nullable) |

#### `Comment` (in `tickets` module)
* **Table:** `comments`
* **Description:** Stores all correspondence related to a ticket.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | **Primary Key** | Unique comment identifier |
| `body` | `String(2000)`| Not Null | The content of the comment |
| `created_at` | `Instant` | Not Null | Timestamp of creation |
| `author_id` | `Long` | **FK (users.id)** | The user who wrote the comment |
| `ticket_id` | `Long` | **FK (tickets.id)**| The ticket this comment belongs to |

---

## 4. Security Design

### 4.1. Authentication
* **Strategy:** JWT (JSON Web Tokens)
* **Flow:**
    1.  Client `POSTS` email and password to `/api/auth/login`.
    2.  `AuthController` uses Spring Security's `AuthenticationManager` to validate.
    3.  `AuthenticationManager` uses the `UserDetailsServiceImpl` (from `auth` module) to load the `User` from the database and check the password.
    4.  If successful, `AuthController` calls `JwtUtil` to generate an access token.
    5.  Token is returned to the client, who must send it in the `Authorization: Bearer <token>` header for all future requests.

### 4.2. Authorization
* **Strategy:** Role-based access control (RBAC) using Spring Security's `SecurityFilterChain` and method-level security (`@PreAuthorize`).

### 4.3. Roles & Permissions Matrix
This matrix defines the 8 core roles and their primary permissions.

| Role | Access | Description |
| :--- | :--- | :--- |
| **ROLE_CUSTOMER** | `Create/Read (Own)` | Can create new tickets and view/comment on their own tickets. |
| **ROLE_AGENT_L1** | `Read/Update` | First-line support. Can view, comment on, and resolve assigned L1 tickets. |
| **ROLE_TRIAGE** | `Read/Update` | Can view all "NEW" tickets, set priority/category, and assign to L1/L2/L3. |
| **ROLE_AGENT_L2** | `Read/Update` | NOC Engineer. Handles escalated, complex remote issues. |
| **ROLE_AGENT_L3** | `Read/Update` | Field Engineer. Handles escalated, on-site hardware issues. |
| **ROLE_TEAM_LEAD** | `Read (Team)` | Can view all tickets assigned to their team (e.g., all L2 agents). |
| **ROLE_MANAGER** | `Read (All) + Analytics` | Can view all tickets in the system. Primary user of the `/api/analytics` endpoints. |
| **ROLE_CXO_ADMIN**| `Read (All) + Analytics` | C-level exec. Views high-level analytics. Admin can manage user accounts. |

---

## 5. API Specification (Key Endpoints)

This defines the primary REST API contract.

### 5.1. Auth Module (`/api/auth`)
| Method | Endpoint | Description | Security |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Creates a new CUSTOMER account. | `PermitAll` |
| `POST` | `/api/auth/login` | Authenticates a user and returns a JWT. | `PermitAll` |
| `GET` | `/api/auth/me` | Returns the profile of the currently logged-in user. | `Authenticated` |

### 5.2. Ticket Module (`/api/tickets`)
| Method | Endpoint | Description | Security |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/tickets` | Creates a new ticket. | `CUSTOMER` |
| `GET` | `/api/tickets` | Gets a list of tickets (filtered by user role). | `Authenticated` |
| `GET` | `/api/tickets/{id}` | Gets a single ticket by its ID. | `Authenticated` |
| `PUT` | `/api/tickets/{id}/status` | Updates a ticket's status (e.g., "IN_PROGRESS"). | `AGENT_L1`, `L2`, `L3` |
| `PUT` | `/api/tickets/{id}/assign` | Assigns a ticket to a team or agent. | `TRIAGE`, `TEAM_LEAD` |
| `POST` | `/api/tickets/{id}/comments`| Adds a new comment to a ticket. | `Authenticated` |
| `GET` | `/api/tickets/{id}/comments`| Gets all comments for a ticket. | `Authenticated` |

### 5.3. Analytics Module (`/api/analytics`)
| Method | Endpoint | Description | Security |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/summary` | Gets high-level counts (New, In Progress, Resolved). | `MANAGER`, `CXO_ADMIN`|
| `GET` | `/api/analytics/sla-report` | Gets a report of tickets that met/missed SLA. | `MANAGER`, `CXO_ADMIN`|
| `GET` | `/api/analytics/csat-report`| Gets the average customer satisfaction score. | `MANAGER`, `CXO_ADMIN`|

---

## 6. Logging & Error Handling

### 6.1. Logging
* **Framework:** SLF4J with Logback (default in Spring Boot).
* **Strategy:**
    1.  **AOP (Aspect-Oriented Programming):** A `LoggingAspect` will be implemented to automatically log the entry and exit of all methods in the `service` and `controller` packages. This provides a baseline trace without cluttering business logic.
    2.  **Manual Logging:** Manual `log.error()` and `log.warn()` will be used within `try-catch` blocks and for specific, critical business logic events (e.g., "SLA breached for ticket T-123").
* **Configuration:** All logging is controlled by `application.properties`, including setting the log level (`logging.level.com.lumadesk=DEBUG`) and the log file (`logging.file.name=lumadesk.log`).

### 6.2. Error Handling
* **Strategy:** A single `GlobalExceptionHandler` class annotated with `@ControllerAdvice`.
* **Flow:**
    1.  A service throws a custom exception (e.g., `TicketNotFoundException`).
    2.  The `@ControllerAdvice` class catches this exception.
    3.  It formats a standardized JSON error response (e.g., `{ "timestamp": "...", "status": 404, "error": "Not Found", "message": "Ticket with ID 123 not found" }`) and returns it to the client with the correct HTTP status code.
