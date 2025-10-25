# LumaDesk – Role-Based Functional Breakdown

This document outlines the pages, features, and role-based functionality in the ticketing platform.  
There are 10 user roles, each with specific dashboards, permissions, and workflows.

---

## Shared Pages (All Roles)

These are foundational pages accessible to everyone. Content and actions may differ by role.

- **Login Page** – Entry point for all roles.
- **Dashboard (Home Page)** – First page after login; role-specific content.
- **My Profile** – View or edit personal details and change password.
- **Ticket Details Page** – Consistent layout across roles; actions vary by user type.
- **Global Search** – Search tickets (by ID) or customers (by phone/email).

---

## ROLE_CUSTOMER

**Goal:** Self-service for reporting and tracking issues.

### Dashboard
- List of **My Open Tickets** (statuses: New, In Progress, Resolved, Reopened)
- List of **My Closed Tickets**
- Primary action: **Report a New Issue**

### AI Chatbot (Component)
- Floating widget available on all pages.
- Guides users through troubleshooting before ticket creation.

### Create Ticket Page
- Fields: Issue Type, Description, Attachments.
- **Edge Case (Journey 1B):**
  - Before submission, shows AI-generated troubleshooting tips.
  - Includes a "Cancel, I fixed it!" button.

### Ticket Details Page (Customer View)
- Shows ticket status, visible notes, and resolution summary.
- **Edge Case (ON_HOLD):**
  - Displays “Add Information” prompt.
  - Submitting information changes status to *In Progress* and alerts the engineer.

### Resolution Confirmation
- Triggered when a ticket is marked as **RESOLVED**.
- Prompts:
  - **Yes, Confirm Closure** → Opens Feedback page.
  - **No, Reopen Ticket** → Opens Reopen page.
- **Edge Case:** Auto-closes ticket after 48 hours if no customer response.

### Feedback Page
- Triggered after confirming closure.
- Contains:
  - 5-star rating input
  - Comment box

---

## ROLE_SUPPORT_AGENT

**Goal:** Create tickets on behalf of customers quickly and accurately.

### Dashboard
- Prominent **Find Customer** search bar.
- **Create New Ticket** button.
- List of **Tickets Created Today**.

### Create Ticket Page
- Auto-fills customer details after search.
- Fields: Issue Type, Description.
- **AI Assist (Side Panel):**
  - Suggests Severity, Priority, Category, and Team.
  - Agent can accept suggestions to auto-fill the form.

---

## ROLE_TRIAGE_OFFICER

**Goal:** Assign new and escalated tickets to the correct teams.

### Triage Dashboard
- Kanban or list view of tickets with status **PENDING_TRIAGE** or **ESCALATED**.
- Excludes tickets automatically handled by the rule-based system.

### Ticket Details Page
**Key Action Panel:**
- Dropdowns to set or change:
  - Severity
  - Priority
  - Assigned Team (NOC, Field, Tech)
  - Assigned Engineer (optional)
- **Assign** button changes ticket status to *ASSIGNED*.

---

## ROLE_TECH_SUPPORT_ENGINEER / ROLE_NOC_ENGINEER / ROLE_FIELD_ENGINEER

**Goal:** Resolve assigned tickets efficiently.  
These three roles share a nearly identical interface.

### Resolver Dashboard (My Queue)
- Displays all tickets assigned to the engineer or their team.
- Sorted by **SLA Urgency** (tickets breaching soon appear at the top).

### Ticket Details Page (Resolver View)
**Status Actions:**
- **Start Work** → Changes status to *In Progress*.
- **Place On Hold** → Requires a reason (e.g., "Waiting for Customer", "Waiting for Parts") and pauses SLA timer.
- **Mark as Resolved** → Requires Resolution Notes and Root Cause.

**Data Actions:**
- Add Work Note (internal only)
- Add Customer Note (visible to customer)
- Upload Logs or Photos

**AI Assist Tab:**
- **Get Resolution Suggestions** → Retrieves known fixes based on ticket data.

**Escalation Action:**
- **Escalate / Re-assign** → Sends the ticket directly to another team (bypasses Triage).

**Edge Case (Field Engineer):**
- Must be mobile-responsive and support offline mode.
- Service worker caches the page and queues actions until reconnected.

---

## ROLE_TEAM_LEAD

**Goal:** Monitor team performance and manage SLA breaches.

### Dashboard
- **SLA Breach Alert:** List of tickets nearing SLA breach.
- **Team Queue:** Overview of tickets assigned to team members.
- **Reopened Tickets:** Quick access to tickets reopened by customers.

### Ticket Details Page
- Full access to all resolver actions.
- **Override Actions:**
  - Re-assign ticket between team members.
  - Escalate ticket (add urgent note).
  - Change ticket priority.

---

## ROLE_MANAGER

**Goal:** View high-level metrics and team performance.

### Dashboard
Read-only view focused on analytics.

**Widgets:**
- Chart: Open vs. Resolved vs. Overdue Tickets (by Team)
- Chart: Tickets by Location or Category
- Key Metrics:
  - Overall SLA Met Percentage
  - Average CSAT Score
- Table: All Overdue Tickets

### Reports Page
- Generate and export reports (FR-14).
- **Filters:** Date Range, Team, Location.
- **Reports:**
  - SLA Performance
  - Team Resolution Times
  - Full Feedback Log
- **Export Options:** CSV or PDF.

---

## ROLE_NOC_ADMIN

**Goal:** Monitor network health using ticket data.

### Dashboard
- **Ticket Heatmap:** Visual map showing service areas color-coded by ticket density.
- Additional widgets for:
  - Core Switch Issues
  - Outages
  - Network KPIs

---

## ROLE_CXO

**Goal:** View executive-level business health.

### Executive Dashboard
Read-only, top-level summary view.

**KPIs:**
- Total Ticket Volume (Today / Week / Month)
- Average Resolution Time (Global)
- Overall CSAT Score
- SLA Met Percentage

**Charts:**
- Ticket Volume vs. Resolution Time (12-month trend)
- CSAT Trend (12-month trend)
- AI-Assisted vs. Manual Resolution Percentage (AI ROI metric)

### Reports Page
- View pre-generated daily or weekly summary reports in PDF format.
- No report generation permissions.

---

## Summary Table

| Role | Goal |
|------|------|
| Customer | Report and track issues |
| Support Agent | Create tickets for customers |
| Triage Officer | Assign and prioritize tickets |
| Tech/NOC/Field Engineer | Resolve assigned tickets |
| Team Lead | Manage team performance and SLA compliance |
| Manager | View analytics and reports |
| NOC Admin | Monitor network health |
| CXO | Monitor business KPIs |

---

**Document Version:** 1.0  
**Author:** [Your Name or Team]  
**Last Updated:** October 2025
