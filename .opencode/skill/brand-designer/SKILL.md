# Skill: Brand & UI Designer for Mechanic Workshop App

## Agent Profile
You are a UI/UX designer. Your goal is to structure visual components and styles based on an industrial, high-contrast, and high-impact brand identity inspired by the aesthetics of **Fullmetal Alchemist** (metallic lettering, steel textures, alchemist red, and gold accents).

---

## 1. General Design Guidelines (Brand & UI Style Guide)

### Color Palette
*   **Background:** `#1A1512` (Deep, dark brown, almost automotive black).
*   **Containers & Cards:** `#261F1A` (Medium brown to add depth over the dark background).
*   **Primary Accent Color:** `#CC2229` (Bright Alchemist Red for critical alerts, approvals, and active states).
*   **Secondary Accent Color:** `#E5A93C` (Metallic Gold for pending/waiting states and warnings).
*   **Success / Ready State:** `#2ECC71` (High-visibility Neon Green).
*   **Primary Text:** `#F5F0EB` (Bone white for maximum readability on dark surfaces).
*   **Secondary Text:** `#9C8E85` (Warm gray for labels and secondary details).

### Branding & Typography
*   **Logo Concept:** Inspired by the *Fullmetal Alchemist* logotype. Sharp serif typography with a polished chrome/silver metallic look (`#E5E5E5`), featuring a horizontal line or a heraldic element (resembling the Flamel cross) slicing through the letters. A subtle crimson glow emanates behind the text.
*   **Component Style:** Sharp borders or slightly rounded corners (`border-radius: 4px`), with thin silver outlines (`#4A3F35`) to emulate polished metal.

---

## 2. Views Components Specification

### View 1: Mechanic Dashboard (Mobile-First / Protected Access)
*   **Layout:** Single-column grid fully optimized for one-handed mobile touch interactions.
*   **Vehicle Cards:**
    *   **Header:** License plate in massive monospace typography, Model in primary white text.
    *   **Status Badge:** Dynamic color-coded badge based on the current status.
*   **"One-Touch" Action Buttons (Immediate Status Control):**
    *   A row of 4 thumb-accessible buttons per card:
        *   `[In Review]` (Metallic gray)
        *   `[Awaiting Approval]` (Gold `#E5A93C`)
        *   `[In Repair]` (Red `#CC2229`)
        *   `[Ready]` (Green `#2ECC71`)
    *   *Behavior:* Clicking a button instantly updates the `status` column in the database synchronously.
*   **"Add Additional Repair" Action:**
    *   A prominent floating action button or card footer button.
    *   **Simple Modal:** Text Input (Concept/Description) + Numeric Input (Amount $).
    *   *Automation Trigger:* Saving this record automatically triggers a webhook/function that mutates the car's status to `Awaiting Approval`.

### View 2: Customer Public Portal (Mobile-First)
*   **Dynamic Route:** `/cliente/[order_id]`
*   **Giant Visual Indicator (Stepper/Traffic Light):**
    *   A high-contrast visual tracker dividing the process into: `Checked In` ➔ `In Review` ➔ `In Repair` ➔ `Ready`.
    *   Vibrant color (`#2ECC71` or `#CC2229`) for the active stage; inactive stages fade into `#4A3F35`.
*   **Conditional Budget Approval Banner:**
    *   *Visibility Rule:* Visible only if `status == 'Awaiting Approval'`.
    *   **Design:** Dark red background with gold borders, featuring high-priority alert text detailing the concept and the **Additional Amount ($)**.
    *   **Giant [Approve Budget] Button:** Solid green color. When pressed:
        1. Triggers a quick native confirmation dialog.
        2. Captures customer metadata: current `timestamp`, `IP Address` (via API integration), and `userAgent`.
        3. Inserts an audit log into Supabase: `auditoria_aprobaciones`.
        4. Freezes the screen with a loading overlay to prevent transaction duplication (double-clicking).
    *   **[Reject] Button:** Smaller secondary link or gray/red button to initiate direct contact.

### View 3: Admin Dashboard (Desktop / Tablet View)
*   **Layout:** Split-screen panel (Navigation sidebar + Wide grid content area).
*   **Quick Intake Form:**
    *   Required Fields: Customer Name, Phone (with direct WhatsApp API link), License Plate, Model, and Initial Fault Description.
    *   Input Fields Styling: Background `#261F1A`, text `#F5F0EB`, and red active border `#CC2229`.
*   **History & Audit Log (Data Table):**
    *   Highly detailed technical table filtered by vehicle.
    *   Displays full lifecycle traceability of the vehicle's stay.
    *   **Digital Proof:** Highlighted column with a "Security" icon containing the raw audit string from Supabase (`Date`, `Time`, `IP`, `Approval Status`) to serve as operational/legal evidence against complaints.

---

## 3. Automation & Data Rules
1.  **Status Mapping:** Ensure strict string matches for statuses: `In Review`, `Awaiting Approval`, `In Repair`, `Ready`.
2.  **Mechanic Modal Logic:** `onClick(Save Repair) => { insert(Repair); update(Vehicle, status='Awaiting Approval'); revalidate(); }`.
3.  **Public Portal Security:** The public view must not require a JWT session token, but the micro-routed `order_id` must use an unguessable UUID v4 to guarantee privacy by design.

