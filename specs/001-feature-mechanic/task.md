### Milestone 1: Database Configuration and Business Logic (Supabase)

#### T001: Data Modeling and Triggers for Statuses and Timings
*   **Description:** Create or update tables in Supabase to support the status lifecycle (`Under Review`, `Awaiting Approval`, `Under Repair`, `Ready`) and the logging of additional repairs associated with a vehicle license plate. Implement database logic to pause the work timer if the status changes to `Awaiting Approval`.
*   **Dependencies:** None
*   **Checkpoint:** Vehicle and additional repair tables created. Script successfully executed to automatically pause/adjust the timer upon a status change.

#### T002: Automated Notification Webhook/Queue
*   **Description:** Configure a database function or hook that triggers automatically when a vehicle’s status changes to `Awaiting Approval`, adding a notification for the client to the queue.
*   **Dependencies:** T001
*   **Checkpoint:** A record is created in the notification queue after manually setting a test entry to the `Awaiting Approval` status.


### Milestone 2: Highly Accessible User Interface Components (Mobile-First)

#### T003: Highly Accessible "One-Touch" Button Component
*   **Description:** Develop a base touch-button component optimized for mechanics. It must strictly adhere to a minimum height of 60px and feature high-contrast styling based on the current status (e.g., red for "waiting," green for "ready").
*   **Dependencies:** None
*   **Checkpoint:** Visual and code-based testing confirms that the component height is ≥ 60px and that colors provide sufficient contrast for mobile environments. #### T004: Vehicle Control Panel Container and Layout
*   **Description:** Create a vehicle view/card that arranges "One-Touch" buttons in a vertical stack with sufficient spacing to prevent accidental presses when hands are dirty.
*   **Dependencies:** T003
*   **Checkpoint:** Correct rendering in a smartphone emulator, validating the vertical layout and the safety spacing between status buttons.

#### T005: Additional Repair Entry Modal with Oversized Numeric Keypad
*   **Description:** Design and implement a floating modal that includes an integrated, large-sized numeric keypad (avoiding reliance on the native system keyboard, if possible) and a simple input field for a brief description.
*   **Dependencies:** None
*   **Checkpoint:** A functional mobile modal that allows for the entry of a description and an amount using large buttons.


### Milestone 3: Integration of Workflows, Functionalities, and Concurrency Control

#### T006: "One-Touch" Update Workflow Integration (Scenario 1)
*   **Description:** Connect the control panel buttons to the Supabase client. Upon pressing the "Under Repair" button, update the state in the user interface and persist it to the database immediately.
*   **Dependencies:** T001, T004
*   **Checkpoint:** Clicking the button in the UI updates the record in the database, and the interface reflects the new state in real time.

#### T007: Implementation of a Visual Confirmation Message (Flash/Toast)
*   **Description:** Add a visual confirmation (a toast or flash notification) to immediately inform the mechanic that the state change was successful.
*   **Dependencies:** T006
*   **Checkpoint:** The visual alert appears and then automatically disappears after the state-change button is pressed.

#### T008: Integration of Additional Repair Workflow and Work-Pause Mechanism (Scenario 3)
*   **Description:** Link the modal form (T005) to the database. Upon confirming the submission—including the cost and description—the expense must be recorded, the vehicle's status updated to `Awaiting Approval`, and the pause trigger activated.
*   **Dependencies:** T001, T002, T005
*   **Checkpoint:** Successful form submission results in an automatic status change to `Awaiting Approval` and pauses the vehicle's timer.

#### T009: Pending State Handling and Anti-Double-Click Lock (Scenario 4)
*   **Description:** Implement logic to immediately disable the "Request Approval" button while the request to Supabase is in a `pending` state. Display a loading spinner inside the button.
*   **Dependencies:** T008
*   **Checkpoint:** When clicked rapidly multiple times, the button locks upon the first tap, displays the spinner, and only a single record is inserted into the database.


### Milestone 4: Automated Acceptance Testing (Gherkin/E2E)

#### T010: E2E Test Automation for Status Updates (Scenarios 1 & 2)
*   **Description:** Write and execute automated tests (e.g., using Playwright, Cypress, or Cucumber) to validate the status update workflow and the dimensions of the touch target (60px).
*   **Dependencies:** T006, T007
*   **Checkpoint:** The test suite passes successfully, validating the steps for Scenarios 1 and 2 from the Gherkin file.

#### T011: E2E Test Automation for Additional Repairs and Concurrency (Scenarios 3 & 4)
*   **Description:** Write automated tests to validate that submitting an additional repair freezes the work timers and that double-clicks are successfully prevented by the frontend.
*   **Dependencies:** T009
*   **Checkpoint:** The integration and behavioral test suite passes successfully, validating the steps for Scenarios 3 and 4.
