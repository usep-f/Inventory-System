# Source Directory Structure & Architecture Guidelines

This document details the component-based, atomized directory structure for the standalone inventory system's `src` folder and defines development constraints (atomization, linting, validation).

---

## 1. Directory Structure

```text
src/
├── client/                      # Vite + React Frontend
│   ├── components/              # Atomic, reusable UI components (presentational)
│   │   ├── Button.tsx           # Standard interactive buttons
│   │   ├── Card.tsx             # Panel containers (glassmorphism style)
│   │   ├── Input.tsx            # Secured input fields with inline feedback
│   │   └── Modal.tsx            # Overlay modals used for JIT and edits
│   │
│   ├── features/                # Feature-centric modules
│   │   ├── auth/                # PIN Authentication features
│   │   │   ├── LoginForm.tsx
│   │   │   └── RoleSelector.tsx
│   │   ├── dashboard/           # Desktop management features
│   │   │   ├── InventoryTable.tsx
│   │   │   └── ProductModal.tsx
│   │   ├── scanner/             # Mobile camera scanner features
│   │   │   ├── BarcodeScanner.tsx
│   │   │   └── JitModal.tsx
│   │   └── reports/             # Analytics and charting features
│   │       ├── ActivityFeed.tsx
│   │       └── StatCharts.tsx
│   │
│   ├── hooks/                   # Custom React hooks (logic reuse)
│   │   ├── useScanner.ts        # Encapsulates zxing-js camera stream & scan cycle
│   │   └── useAudio.ts          # Encapsulates auditory scanner feedback (beeps)
│   │
│   ├── context/                 # Context providers for global states
│   │   └── AuthContext.tsx      # Holds session info (role, PIN, local network IP)
│   │
│   ├── App.tsx                  # Client router and main shell
│   ├── index.css                # Global Vanilla CSS style tokens
│   └── main.tsx                 # Client main DOM bootstrap
│
├── server/                      # Node.js + Express Backend
│   ├── routes/                  # Express route controllers (< 150 lines each)
│   │   ├── auth.ts              # Handles session PIN verification
│   │   ├── products.ts          # Handles product CRUD (add, edit, delete)
│   │   └── scans.ts             # Handles scan operations (JIT, add/subtract count)
│   │
│   ├── db.ts                    # SQLite database client initialization
│   ├── index.ts                 # Express core application & IP listener
│   └── schema.ts                # Database models (Drizzle) & validation (Zod)
```

---

## 2. Core Code Quality Rules

### Rule A: Code Atomization
To prevent files from becoming complex and hard to maintain:
- **File Limit**: No single code file (`.ts`, `.tsx`, `.css`) may exceed **300 lines of code** (excluding comments).
- **Function Limit**: No single function or React functional component may exceed **50 lines of code**. If a component or function exceeds this, it **MUST** be broken down into sub-components, helper files, or custom hooks.

### Rule B: Zod Input Validation
Security is enforced at all boundaries using Zod schemas defined in `src/server/schema.ts`:
1. **Server API level**: All Express request bodies and query parameters **MUST** be parsed and validated using `.parse()` or `.safeParse()` prior to executing any DB query.
2. **Client Form level**: All forms (JIT modal, edit product, PIN entry) **MUST** validate inputs against corresponding Zod schemas before firing fetch queries, showing validation states instantly in the UI.

### Rule C: ESLint Constraints
The repository uses a strict ESLint standard:
- Running `npm run lint` **MUST** report **0 warnings and 0 errors** before any build or packaging step.
- CommonJS rules apply to the server compiled directory, while Vite configurations apply to the client files.
