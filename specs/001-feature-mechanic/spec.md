# Requirements Specification: Mechanic Operations Module

## 1. Problem Statement
The workshop mechanics currently operate in a fast-paced, high-friction environment. They manage vehicle statuses exclusively via their mobile devices, often while working under vehicles or with greasy, dirty hands. 

The current manual tracking leads to two major operational bottlenecks:
* Mechanics are constantly interrupted by phone calls from customers asking for vehicle status updates.
* Work grinds to a halt whenever an unexpected defect is discovered, as updating the system or notifying the administration to get customer approval takes too much effort on a mobile screen.

To solve this, the mechanics need a highly accessible, mobile-first interface featuring oversized touch targets ("One-Touch" actions) that allow them to update vehicle progress and log additional repairs instantly, requiring near-zero text input.

---

## 2. Proposed Solution
A mobile-first, high-contrast dashboard tailored for standard smartphone screens. The interface eliminates complex dropdowns, nested menus, and typing requirements for core workflows. 

Key features include:
* Large, dedicated status action cards with clear color-coded indicators.
* A streamlined modal to quickly input additional repair costs using oversized numeric pads.
* Direct integration with the status pipeline to freeze timelines and trigger automated client notifications via the backend.

---

## 3. Acceptance Criteria (Gherkin Specifications)

### Scenario 1: Successful "One-Touch" Vehicle Status Update
```gherkin
Given a mechanic is authenticated and viewing the Mobile Dashboard
And a vehicle with License Plate "ABC-123" is currently in "En Revisión" status
When the mechanic taps the oversized "En Reparación" button on the vehicle card
Then the vehicle status must immediately update to "En Reparación" in the UI
And the database record for "ABC-123" must reflect "En Reparación"
And a visual confirmation message must briefly flash on the screen
```

### Scenario 2: High-Accessibility UI Safeguards for Dirty Hands
```gherkin
Given the mechanic is interacting with the status update panel on a mobile device
When the interface renders the action buttons for "En Revisión", "Esperando Aprobación", "En Reparación", and "Listo"
Then each button must have a minimum touch target height of 60 pixels
And the buttons must be stacked vertically or spaced out to prevent accidental adjacent taps
And the color scheme must use high-contrast badges (e.g., Red for Waiting Approval, Green for Ready)
```

### Scenario 3: Logging an Additional Repair Triggers Work Freeze
```gherkin
Given a vehicle with License Plate "XYZ-789" is currently in "En Reparación" status
When the mechanic taps the "Agregar Reparación Adicional" button
And enters an additional cost of "15000" and a short description "Cambio de pastillas de freno"
And taps the "Solicitar Aprobación" confirm button
Then the vehicle status must automatically change to "Esperando Aprobación"
And the work timer for this vehicle must be paused in the database
And an automated notification hook must be queued for the customer
```

### Scenario 4: Prevention of Accidental Double Submissions
```gherkin
Given the mechanic has just tapped the "Solicitar Aprobación" button for an additional repair
When the network request to Supabase is in a pending state
Then the submission button must become immediately disabled
And a loading spinner must display inside the button
And no duplicate repair entries or status logs can be generated in the database
```

