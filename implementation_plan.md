# Plan: Standalone Local Inventory System (.exe)

This plan compiles a React (Vite) frontend and an Express backend into a single standalone Windows executable (`inventory.exe`). It runs a local SQLite database, auto-detects the PC's IP to display a connection QR code, and allows mobile devices on the same Wi-Fi to scan barcodes via their camera with PIN authentication and JIT registration.

## Scope

- **In**:
  - React/Vite + Vanilla CSS frontend served statically by Express.
  - Node.js Express API using `better-sqlite3` and `drizzle-orm` for local SQLite operations.
  - Automatic PC local IP detection to generate the connection QR code.
  - PIN-secured role selection ("PC Dashboard" vs "Mobile Scanner").
  - Mobile scanner page with `@zxing/library` supporting "Add" and "Subtract" modes.
  - JIT (Just-In-Time) product registration modal on mobile when scanning a new barcode.
  - PC Dashboard listing all items with manual editing/deleting and an SVG-based activity logs report.
  - Compilation of the entire application into a single executable (`inventory.exe`) using `pkg`.

- **Out**:
  - External cloud hosting (no Vercel, no cloud Turso).
  - External barcode database lookups (only JIT user prompt).
  - Multi-user account registration (access is managed via a shared PIN).

## UI & UX Specifications

Based on design interviews, the application will follow these guidelines:

**Color Theme & Style**
- **Light Mode Only**: Clean, airy background (`#f8fafc` to `#f1f5f9` gradients) with subtle frosted glass panels.
- **Accents**: Muted professional colors (corporate blue `#0ea5e9`, soft emerald `#10b981`) to ensure a business-minded but premium feel.
- **Glassmorphism**: Backdrop blur (`backdrop-filter: blur(12px)`) with semi-transparent white backgrounds (`rgba(255, 255, 255, 0.7)`) and very light borders (`rgba(255, 255, 255, 0.3)`).

**PC Layout (Multi-Layered Spatial Design)**
- **Sidebar**: Static glassmorphic navigation.
- **Header/KPIs**: Floating KPI charts and activity logs with slight 3D depth/parallax effect on scroll.
- **Data Table**: A clean frosted glass pane below the charts holding the inventory grid to ensure maximum data readability without overwhelming 3D effects.

**Mobile Layout (Scanner-First)**
- **Camera View**: Full screen or top-anchored camera feed.
- **Bottom Sheet**: A frosted glass bottom sheet covering the lower half of the screen, housing the Add/Subtract toggles, recent scans, and the JIT modal.
- **FAB**: A persistent floating action button.

## Design & Code Quality Constraints

> [!IMPORTANT]
> **Code Atomization**: To maintain code readability and simplify maintenance:
> - No single code file may exceed **300 lines of code**.
> - No single function or React component function may exceed **50 lines of code**.
> - Zod validation schemas must be used for all inputs and API request validation to secure the system.

---

## Action Items

[ ] **Step 1: Project Initialization**: Create a unified `package.json` with dependencies for React, Vite, Express, TypeScript, Drizzle ORM, better-sqlite3, `@zxing/library`, and `pkg`.
[ ] **Step 2: Database Schema & Client**: Set up Drizzle ORM schemas (`products` and `logs` tables) and database client initialization (`better-sqlite3`).
[ ] **Step 3: Express Backend API**: Write the Express server (`src/server.ts`) to serve static client assets, handle API requests (`/api/products`, `/api/scan`, `/api/logs`), and auto-detect the local IP address for the QR code.
[ ] **Step 4: Shared CSS & Design Tokens**: Implement a premium, Light mode CSS design system in `src/client/index.css` with clean airy backgrounds, corporate blue accents, subtle frosted glass panels, and GSAP/parallax-ready utility classes.
[ ] **Step 5: Frontend Authentication & Router**: Create a simple client-side router/view selector for Login (PIN verification), PC Dashboard, and Mobile Scanner.
[ ] **Step 6: Mobile Scanner Layout (Bottom-Sheet design)**: Implement a full-screen camera background with a frosted glass bottom sheet for the "Add/Subtract" toggles, persistent floating action button, recent scans list, and the JIT registration modal.
[ ] **Step 7: PC Dashboard Layout (Multi-layered Spatial)**: Create the desktop view with a static glassmorphic sidebar, parallax/3D floating KPI charts and logs in the main area, and a readable frosted glass pane below for the inventory grid.
[ ] **Step 8: Standalone Executable Packaging**: Configure `pkg` in `package.json` to bundle the compiled Vite client assets and Express server code, then compile it into a single executable.
[ ] **Step 9: Validation**: Run the compiled executable, scan QR from a phone, perform mock scans, check database entries, and verify data updates in real-time.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to compile the Vite client.
- Run `npm run build:server` to compile the Express TypeScript server.
- Run `npm run package` to compile the final standalone `inventory.exe` using `pkg`.

### Manual Verification
1. Run `inventory.exe` on the host PC. Confirm it starts the local server, creates `inventory.db` in the local directory, and opens `http://localhost:3000` automatically.
2. Verify that the PC screen displays a correct local network QR code (e.g. `http://192.168.x.x:3000/`) and a 4-digit PIN.
3. Using a mobile phone connected to the same Wi-Fi, scan the QR code and verify it prompts for the PIN.
4. Enter the PIN on the phone, toggle "Add" mode, and scan a barcode. Verify that the JIT registration modal appears on the phone, prompting for a product name.
5. Create the product on the phone, scan it again, then toggle "Subtract" and scan. Verify that the inventory count on the PC dashboard increases and decreases accordingly.
6. Verify that the activity logs and SVG charts on the PC dashboard show the scans correctly.
