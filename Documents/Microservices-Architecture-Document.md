# LumaDesk - System Design Document
**Version:** 3.0  
**Status:** In Development  
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
 **US 1.1:** As a **customer**, I want to raise a ticket via mobile/web. 
 **US 1.2:** As a **support agent**, I want to log a ticket on behalf of a customer.  **US 1.3:** As the **system**, I want to auto-categorize the ticket based on keywords. 
 **US 1.4:** As the **system**, I want to assign a unique Ticket ID and timestamp.
  ### EPIC 2: Ticket Assignment & SLA Tracking 
  **US 2.1:** As a **triage officer**, I want to assign severity and priority to tickets. * **US 2.2:** As the **system**, I want to route tickets to the appropriate team (Field Engineer, NOC). * **US 2.3:** As a **manager**, I want to track SLA countdowns per ticket. * **US 2.4:** As a **resolver**, I want to view all open tickets assigned to me, prioritized by SLA. ### EPIC 3: Ticket Diagnosis and Resolution * **US 3.1:** As a **resolver**, I want to update ticket status ("In Progress", "On Hold"). * **US 3.2:** As a **resolver**, I want to record actions taken (e.g., port reset, ONT replaced). * **US 3.3:** As the **system**, I want to attach logs and diagnostic reports to a ticket. * **US 3.4:** As a **field engineer**, I want to update the ticket via mobile after an on-site visit. ### EPIC 4: Ticket Closure and Feedback * **US 4.1:** As a **resolver**, I want to mark the ticket as resolved. * **US 4.2:** As the **system**, I want to notify the customer with a resolution summary. * **US 4.3:** As a **customer**, I want to confirm the issue is resolved, or reopen it. * **US 4.4:** As a **customer**, I want to provide feedback or rate the service. ### EPIC 5: Dashboard, Reports & Alerts * **US 5.1:** As a **manager**, I want to view open, resolved, and overdue tickets by team. * **US 5.2:** As a **team lead**, I want to be alerted if an SLA is about to breach. * **US 5.3:** As a **NOC admin**, I want to view ticket heatmaps for frequent outage zones. * **US 5.4:** As a **CXO**, I want daily reports on ticket volume and resolution time. ### EPIC 6: AI-Powered Support * **US 6.1:** As a **support agent**, I want AI to suggest severity and probable root cause. * **US 6.2:** As a **resolver**, I want to ask AI for possible resolution steps. * **US 6.3:** As the **system**, I want to auto-categorize and auto-resolve simple issues. * **US 6.4:** As a **customer**, I want to interact with a chatbot for self-troubleshooting.
---

## 4. Backend System Architecture

### 4.1. Architecture Philosophy The backend follows a strict **microservices architecture**. * **Single Responsibility:** Each service has one job (e.g., auth, tickets). * **Autonomy:** Services are developed, deployed, and scaled independently. * **Decentralized Data:** Each service owns its own database. There is **no database sharing**. * **API-First:** Services communicate via REST APIs (using Spring Cloud Feign) or future event-driven methods.


---

## 5. Data Architecture

(Full schema definitions for all microservices and data flow interactions)

---

## 6. Core End-to-End Flows

(Complete flows for registration, authentication, ticket creation, role promotion, notification broadcast)

---

## 7. Authentication & Authorization (RBAC)

(Full role listing and permissions matrix for all 10 user types)

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
