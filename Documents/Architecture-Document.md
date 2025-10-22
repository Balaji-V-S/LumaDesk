# LumaDesk - High-Level Design Document

**Project Name:** LumaDesk  
**Version:** 1.0  
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

## 2. Core Components & Responsibilities
The system is divided into two primary categories of services:

### 2.1. Infrastructure Services
These services provide the foundational support for the architecture.

- **API Gateway:**  
  The single point of entry for all client requests. Responsible for request routing, authentication (by calling the Auth Service), and rate limiting.

- **Discovery Server:**  
  A "phone book" (using Eureka) that allows services to find and communicate with each other dynamically without hardcoded addresses.

- **Config Server (Future Scope):**  
  A central server to manage configuration for all services. For the capstone, configuration will be managed in each service's local `application.properties` file.

### 2.2. Application Services (Lean MVP Set)
These services contain the core business logic of LumaDesk.

- **User & Auth Service:**  
  Manages user identity, roles, permissions, and is responsible for issuing and validating JWTs.

- **Ticket Service:**  
  The heart of the application. Handles the complete lifecycle of tickets, including creation, status updates, and comments. The heart of the application. Handles the complete lifecycle of tickets, including creation, status updates, and comments. For the initial build, it also contains the internal business logic for applying SLA policies and routing tickets to the correct initial queue.

  It also makes two synchronous, internal REST calls (via Feign):  
  - Calls the **AI Service** to get a suggestion for the ticket's category.  
  - Calls the **Notification Service** to send a "ticket received" confirmation email.

- **AI Service:**  
  A dedicated service that acts as a wrapper for calls to external Generative AI models for tasks like suggesting resolutions.

- **Analytics & Reporting Service:**  
  Responsible for aggregating data for dashboards and reports. Operates in the background to avoid impacting live performance.

- **Notification Service:**  
  A single-responsibility service for sending all user communications (e.g., emails).

---

## 3. End-to-End Lifecycle Flows

### 3.1. Flow: User Authentication
1. Client sends username/password to the API Gateway.  
2. Gateway routes the request to the User & Auth Service.  
3. User & Auth Service validates credentials against its database, generates a JWT, and returns it.  
4. The JWT is sent back through the Gateway to the Client, which stores it for future requests.

### 3.2. Flow: New Ticket Creation
1. A logged-in Client sends a "create ticket" request with their JWT to the API Gateway.

2. The Gateway intercepts the request, validates the JWT with the User & Auth Service, and upon success, routes the request to the Ticket Service.

3. The Ticket Service receives the request and creates a new ticket record in the database with a "New" status.

4. The Ticket Service then immediately applies its internal business logic:

- SLA Application: It determines the ticket's priority and assigns the corresponding SLA (e.g., sets a resolve_by timestamp).

- Routing Logic: It determines the correct initial assignment queue (e.g., "L1 Support Queue") and updates the ticket. 

5. The Ticket Service then makes two synchronous, internal REST calls (via Feign):

- It calls the AI Service to get a suggestion for the ticket's category.
- It calls the Notification Service to send a "ticket received" confirmation email.

6. The Ticket Service returns the new Ticket ID in a response back through the Gateway to the Client.

---

## 4. Data & Logging Strategy (for Capstone Project)

- **Database:**  
  A single MySQL instance will be used. The architecture will follow a "Shared Database, Separate Tables" pattern. Each service is the sole owner of its tables (e.g., user-auth-service owns the users table).

- **Logging:**  
  Centralized logging will be achieved without ELK. Each of the 8 services will have its own `logback-spring.xml` file configured to write logs to a single, shared file (e.g., `lumadesk-central.log`). The service name will be included in each log line for easy tracing.
