# 🗂️ Declutter

> **A minimal, modern desktop application designed with a sleek matte black finish and native Windows caption controls to instantly transform chaotic folders (Desktop, Downloads, Documents) into cleanly categorized project and topic-based workspaces.**

[![Electron](https://img.shields.io/badge/Electron-45.2-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Download Portable](https://img.shields.io/badge/Download-Declutter--Portable.exe-0A84FF?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/Archbishop-0/Declutter-Organizer-/releases/latest/download/Declutter-Portable.exe)

---

## ✨ Features

- 🖤 **Matte Black Dark Aesthetic**:
  - Deep carbon matte surfaces (`#09090b` / `#111114`) with anti-reflective micro-borders.
  - Native Windows-style window controls placed on the top-right (Minimize `—`, Maximize/Restore `□`/`❐`, and Close `✕` with signature crimson hover).
  - Clean sidebar with quick-access bookmarks for Desktop, Downloads, and Documents.
  - Dark Mode and Light Mode support with smooth transitions.

- 🧠 **Intelligent Project & Topic Clustering**:
  - **Smart Topic Matching**: Filters files into topics like `Finance/Invoices`, `Studies/Research & Thesis`, `Development/Projects`, `Creative/Design Assets`, `Media/Screenshots`, `Software & Installers`.
  - **Project Auto-Clustering**: Detects multi-file project stems (e.g., `Apollo_v1.pdf`, `Apollo_specs.docx` → `Projects/Project - Apollo`).
  - **Timeline Sorting**: Optional grouping by Year and Month (`Timeline/2024/November`).
  - **File Type Fallback**: Categorizes unassigned files by type (Documents, Images, Developer, Audio, Video, Archives).

- 🛡️ **Safety-First Architecture**:
  - **Interactive Dry-Run Preview**: Inspect every planned file move before a single file is touched. Search, expand folders, and deselect individual files.
  - **One-Click Instant Rollback / Undo**: Every run is logged with full original path tracking. Revert any past cleanup with one click.
  - **Collision Prevention**: Automatically handles name collisions by appending `(1)`, `(2)` instead of overwriting.
  - **System Protection**: Automatically skips system files (`.git`, `node_modules`, `desktop.ini`, `.DS_Store`).

- 🧹 **Junk & Temporary File Quarantine**:
  - Automatically isolates incomplete downloads (`.crdownload`, `.part`), temporary files (`.tmp`), and logs into a dedicated cleanup folder.

- ⚙️ **Custom Topic Rule Builder**:
  - Create your own custom topic rules directly in the app with custom keywords, extensions, target subfolders, and color tags.

---

## 🖥️ UI Overview

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 📁 Declutter                            [↩ Undo] [⚙] [☼]  [ — ] [ □ ] [ ✕ ]│
 ├────────────────┬───────────────────────────────────────────────────────┤
 │ LOCATIONS      │  [📁 Target: C:/Users/byte/Desktop]  [Reveal] [Rescan]│
 │  🖥️ Desktop    │                                                       │
 │  📥 Downloads  │  ┌───────────┬───────────┬───────────┬───────────┐    │
 │  📄 Documents  │  │ 42 Items  │  1.2 GB   │ 5 Folders │  2 Junk   │    │
 │  📁 Custom...  │  └───────────┴───────────┴───────────┴───────────┘    │
 │                │                                                       │
 │ MODES          │  PROPOSED CATEGORIES:                                 │
 │  📂 Smart Topic│  • Finance/Invoices & Receipts (6)                    │
 │  ✨ Proj Cluster│ • Studies/Research & Notes (12)                      │
 │  📑 File Types │  • Development/Projects & Scripts (15)                │
 │  📅 Timeline   │  • Media/Screenshots (7)                              │
 │                │  • Cleanup/Temporary & Junk (2)                       │
 │ [x] Clean Junk │                                                       │
 │                │  [ ✨ Review Plan & Execute Moves (42 Files) → ]      │
 └────────────────┴───────────────────────────────────────────────────────┘
```

---

## 💾 Downloads & Executables

Pre-compiled standalone Windows executables are located in the `release/` directory:

- **Portable Executable (`Declutter-Portable.exe`)**: No installation needed. Double-click and run directly from anywhere (USB drive, Desktop, Downloads).
- **Windows Setup Installer (`Declutter-Setup-1.0.0.exe`)**: Standard NSIS installer that creates desktop and start menu shortcuts.

To compile executables yourself:
```bash
npm run dist
```

---

## 🚀 Quick Start from Source

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Archbishop-0/Declutter-Organizer-.git
cd Declutter-Organizer-
npm install
```

### 2. Run the Desktop App
Launch the desktop application:
```bash
npm run app
```
*(This builds the assets and opens the native window).*

Or run in hot-reloading development mode:
```bash
npm run dev
```

### 3. Build Executable (.exe)
```bash
npm run dist
```
Produces `Declutter-Portable.exe` and `Declutter-Setup-1.0.0.exe` in `release/`.

---

## 📦 Project Architecture

```
Organizer/
├── electron/
│   ├── main.cjs            # Electron main process (safe IPC, native fs, undo history)
│   └── preload.cjs         # Context bridge exposing window.electronAPI
├── src/
│   ├── components/
│   │   ├── TitleBar.tsx    # macOS traffic lights, theme switcher, undo shortcut
│   │   ├── Sidebar.tsx     # Finder-style navigation and organizing modes
│   │   ├── FolderPicker.tsx# Drag-and-drop target folder selector
│   │   ├── StatsOverview.tsx# File distribution metrics and category pills
│   │   ├── PreviewPlanModal.tsx # Dry-run interactive approval modal
│   │   ├── TopicRuleEditor.tsx  # Custom topic rules manager
│   │   ├── UndoHistoryModal.tsx # 1-click rollback history
│   │   └── SettingsModal.tsx    # Conflict resolution & safety preferences
│   ├── services/
│   │   ├── defaultRules.ts # Preconfigured topics and extensions
│   │   └── organizerEngine.ts # Heuristics, stem extraction, clustering
│   ├── types/
│   │   └── index.ts        # TypeScript data definitions
│   ├── App.tsx             # Root application orchestrator
│   ├── index.css           # Apple typography and frosted glass styling
│   └── main.tsx            # React 19 entry point
├── test/
│   └── engine.test.cjs     # Automated unit test suite
├── package.json
└── README.md
```

---

---

## 📄 License
This project is open-source and available under the [MIT License](LI
