# Requirements Specification: Administrator Operations Module

## 1. Problem Statement
Auto repair shop managers currently lack a centralized, real-time overview of shop operations, leading to inefficiencies in tracking vehicles, repair statuses, and customer communications. Specifically, managers struggle to monitor ongoing work, identify newly arrived vehicles that lack mechanic assignments, and track additional repairs uncovered during vehicle inspections. 

Furthermore, the lack of a structured system for managing and recording customer approvals for cost estimates creates operational bottlenecks and financial risks. There is no automated mechanism to highlight stagnant cases where vehicles occupy shop space because customers have delayed repair authorizations for more than three days, resulting in lost productivity and delayed shop turnover.

---

## 2. Proposed Solution
The **Administrator Operations Module** will serve as a centralized dashboard tailored for shop managers to oversee and control daily operations. The solution will include:

*   **Real-Time Live Dashboard:** A multi-section view displaying work currently in progress, pending inspections, and additional repairs discovered during diagnostics, including their specific customer approval status.
*   **Intake & Assignment Tracker:** A dedicated section showing newly arrived vehicles, highlighting whether a mechanic has been assigned to start the diagnostic or repair process.
*   **Streamlined Estimate Authorization:** An interface allowing the manager to review and digitally approve cost estimates on behalf of or alongside the customer, creating a permanent, auditable authorization record.
*   **Automated Stagnation Alerts:** A high-visibility alert system that flags any vehicle remaining in the shop for more than three consecutive days without customer approval for necessary repairs.

---

## 3. Acceptance Criteria (Gherkin Specifications)

### Scenario 1: Displaying current work, additional repairs, and assignment status
```gherkin
Given the manager is logged into the Administrator Operations Module dashboard
When the dashboard loads
Then the manager should see a list of "Work in Progress" with their current operational status
And the manager should see any "Additional Repairs" identified during inspections
And each additional repair must explicitly display its approval status as "Pending", "Approved", or "Rejected"
And the manager should see a list of "Newly Arrived Vehicles"
And each new vehicle must clearly display whether a mechanic has been "Assigned" or "Unassigned"
```

### Scenario 2: Authorizing cost estimates with audit records
```gherkin
Given the manager is reviewing a pending cost estimate for a vehicle
When the manager clicks the "Approve Estimate" button after receiving customer confirmation
Then the system must update the estimate status to "Authorized"
And the system must generate a permanent record containing the administrator's ID, the timestamp of approval, and the customer authorization type
And the vehicle status must automatically transition to "Ready for Assignment" or "Work in Progress"
```

### Scenario 3: Alerting for unapproved repairs exceeding three days
```gherkin
Given a vehicle has a cost estimate pending customer approval
When the current date is more than three days past the estimate creation date without any approval action
Then the system must flag the vehicle with a high-priority "Stagnation Alert" on the manager's dashboard
And the alert must display the exact number of days elapsed since the estimate was sent
```
