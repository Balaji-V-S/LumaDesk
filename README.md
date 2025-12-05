<a href="https://balajivs.me"><img src="https://github.com/Balaji-V-S/Balaji-V-S/blob/main/Github%20Readme%20watermark.png" align="right" width="140" /></a>

# LumaDesk: Intelligent Helpdesk Platform (Microservices)

**LumaDesk: The Intelligent Helpdesk Platform for Modern Support Teams**

![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)
![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.x-blue.svg)
![Architecture](https://img.shields.io/badge/Architecture-Microservices-purple.svg)
![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)

---

## 1. 🚀 Project Overview

LumaDesk is a high-performance, resilient, and scalable helpdesk application built on a **microservices architecture**. It leverages **Spring Cloud**, **Spring Boot**, and **JWT** security to provide a robust, API-first backend.

This system follows **Domain-Driven Design (DDD)** principles, ensuring each microservice has a clear **Bounded Context**, a single responsibility, and a decoupled data model.  
It’s designed for **production-level scalability, resilience, and independent deployability**.

The backend is consumed by any modern frontend — the primary one being a **React** application communicating through a single **API Gateway**.

---

## 2. 📚 Table of Contents

- [Architecture Diagram](#-architecture-diagram)
- [Core Architectural Concepts](#-core-architectural-concepts)
- [Service Breakdown (9 Services)](#-service-breakdown-9-services)
  - [Infrastructure Services (3)](#infrastructure-services)
  - [Business Services (6)](#business-services)
- [Technology Stack](#-technology-stack)
- [Database Strategy](#-database-strategy)
- [Logging & Monitoring Strategy](#-logging--monitoring-strategy)
- [API Flow Example: User Login](#-api-flow-example-user-login)
- [Getting Started & Running](#-getting-started--running)
- [License](#-license)

---

## 🏗️ Architecture Diagram

```
+------------------+
| Frontend (React) |
+--------+---------+
         |
         v
+--------+---------+      +-------------------+
|   API Gateway    |----->| Discovery Server  |
|  (Spring Cloud)  |      |     (Eureka)      |
+--------+---------+      +-------------------+
         |
         |----------------------------------------------+
         |                        |                     |
         v                        v                     v
+--------+---------+    +---------+--------+    +-------+----------+
|  Auth Service    |    |   User Service   |    |  Ticket Service  |
| (JWT, Roles)     |    | (Profile Data)   |    | (Lifecycle, SLA) |
+--------+---------+    +------------------+    +------------------+
         |                        |                     |
         v                        v                     v
+--------+---------+    +------------------+    +------------------+
| lumadesk_auth_db |    | lumadesk_user_db |    | lumadesk_ticket_db|
+------------------+    +------------------+    +------------------+
         |
         |----------------------------------------------+
         |                        |                     |
         v                        v                     v
+--------+---------+    +---------+--------+    +-------+----------+
| Feedback Service |    | Analytics Service|    |   AI Service     |
+------------------+    +------------------+    +------------------+
         |                        |                     |
         v                        v                     v
+--------+---------+    +---------+--------+    +-------+----------+
| lumadesk_feed_db |    | lumadesk_ana_db  |    | Notification Svc |
+------------------+    +------------------+    +------------------+
```

---

## 🧩 Core Architectural Concepts

### API Gateway
- Unified entry point for all client requests.
- Handles routing, CORS, JWT validation, and Swagger aggregation.

### Service Discovery (Eureka)
- The “phone book” of the ecosystem.
- Each service registers and discovers others dynamically via `lb://service-name`.

### Centralized Config Server
- Manages externalized configuration for all services from a Git repo.

### Domain-Driven Design (DDD)
- Each microservice represents a **Bounded Context** aligned with business capabilities.

### Security (JWT)
- Tokens issued by `auth-service` include `userId` and `roles`.

### Inter-Service Communication
- Uses **Spring Cloud OpenFeign** for declarative REST clients.

---

## 🏛️ Service Breakdown (9 Services)

### Infrastructure Services

1. **`discovery-server` (Eureka)**
2. **`config-server`**
3. **`api-gateway`**

### Business Services

4. **`auth-service`**
5. **`user-service`**
6. **`ticket-service`**
7. **`feedback-service`**
8. **`analytics-service`**
9. **`ai-service`**

---

## 🧰 Technology Stack

- **Language:** Java 17  
- **Frameworks:** Spring Boot 3.x, Spring Cloud 2023.x  
- **Security:** Spring Security + JWT (`jjwt`)  
- **Databases:** MySQL 8  
- **Inter-Service:** Feign Client  
- **Logging:** SLF4J + Logback  
- **Monitoring:** ELK Stack  
- **Frontend:** React + Axios

---

## 🗃️ Database Strategy

Each service owns its **logical database** (schema):

| Service | Schema Name |
|----------|--------------|
| Auth Service | `lumadesk_auth_db` |
| User Service | `lumadesk_user_db` |
| Ticket Service | `lumadesk_ticket_db` |
| Feedback Service | `lumadesk_feed_db` |
| Analytics Service | `lumadesk_ana_db` |

> No direct joins! Services communicate via APIs, not cross-schema queries.

---

## 📊 Logging & Monitoring Strategy

**Centralized Observability** using **ELK Stack**.

---

## 🔐 API Flow Example: User Login

1. React client → `POST /api/auth/login`
2. Gateway routes request → `auth-service`
3. `auth-service` validates credentials and issues JWT.
4. Returns `AuthResponse (token, role, name)` to frontend.

---

## ⚙️ Getting Started & Running

1. **Clone Repository**
   ```bash
   git clone https://github.com/<your-username>/LumaDesk-microservices.git
   cd LumaDesk-microservices
   ```
2. **Create Config Repo**
   - Create a private GitHub repo: `lumadesk-config`  
3. **Setup Databases**
   ```sql
   CREATE DATABASE lumadesk_auth_db;
   CREATE DATABASE lumadesk_user_db;
   CREATE DATABASE lumadesk_ticket_db;
   CREATE DATABASE lumadesk_feed_db;
   CREATE DATABASE lumadesk_ana_db;
   ```
4. **Build & Run**
   ```bash
   mvn clean install
   ```
