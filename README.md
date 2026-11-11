<div align="center">

# 🗂️ Declutter

**A minimal, modern workspace organizer with a matte black finish and native Windows caption controls.**  
*Transform chaotic Desktop, Downloads, and Documents folders into structured, project-based workspaces in seconds.*

---

[![Release](https://img.shields.io/github/v/release/Archbishop-0/Declutter-Organizer?color=3b82f6&label=Release&style=flat-square)](https://github.com/Archbishop-0/Declutter-Organizer/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D4?logo=windows&logoColor=white&style=flat-square)](https://github.com/Archbishop-0/Declutter-Organizer/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-45.2-47848F?logo=electron&logoColor=white&style=flat-square)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com/)

<br />

<!-- Action Download Badges -->
<a href="https://github.com/Archbishop-0/Declutter-Organizer/releases/latest/download/Declutter-Setup-1.0.0.exe">
  <img src="https://img.shields.io/badge/Download-Installer_(.exe)-2ea44f?style=for-the-badge&logo=windows&logoColor=white" alt="Download Installer" />
</a>
&nbsp;
<a href="https://github.com/Archbishop-0/Declutter-Organizer/releases/latest/download/Declutter-Portable.exe">
  <img src="https://img.shields.io/badge/Download-Portable_(.exe)-0A84FF?style=for-the-badge&logo=windows&logoColor=white" alt="Download Portable" />
</a>

<br /><br />

[Overview](#-overview) •
[Key Features](#-key-features) •
[Interface](#-interface) •
[Downloads](#-downloads) •
[Quick Start](#-quick-start) •
[Safety & Reliability](#-safety--reliability) •
[Architecture](#-architecture) •
[License](#-license)

</div>

---

## 📖 Overview

Are your **Desktop** and **Downloads** cluttered with hundreds of loose PDFs, screenshots, installers, and code snippets? 

**Declutter** scans messy directories, analyzes file stems and metadata, and automatically generates an intuitive, organized folder hierarchy. Every action is previewed before execution, with zero risk of accidental data loss.

| Before Declutter 🌪️ | After Declutter 🗂️ |
|---|---|
| • 100+ unorganized files on Desktop | • `Finance/Invoices & Receipts` |
| • Broken partial downloads (`.crdownload`) | • `Studies/Research & Notes` |
| • Scattered thesis chapters & code scripts | • `Development/Projects & Scripts` |
| • Duplicate filenames & temporary `.tmp` files | • `Projects/Project - Apollo` *(Auto-clustered)* |
| • Frustrating manual search for documents | • `Cleanup/Temporary & Junk` *(Quarantined)* |

---

## ✨ Key Features

### 🖤 Matte Black Carbon Aesthetic
- **Anti-Reflective Palette**: Velvety dark matte surfaces (`#09090b` / `#111114`) with subtle micro-borders (`rgba(255, 255, 255, 0.07)`).
- **Native Windows 11/10 Caption Buttons**: Top-right Minimize (`—`), dynamic Maximize/Restore (`□`/`❐`), and Close (`✕`) with signature crimson hover feedback.
- **Finder-Inspired Sidebar**: Seamless quick-access bookmarks for Desktop, Downloads, Documents, or custom external drives.

### 🧠 Intelligent Categorization Engine
- **Topic Keyword & Extension Matching**: Curated rules for common workflows:
  - 💼 `Finance/Invoices & Receipts` (`invoice`, `receipt`, `tax`, `statement`, `salary`)
  - 🎓 `Studies/Research & Notes` (`thesis`, `assignment`, `lecture`, `paper`, `lab`)
  - 💻 `Development/Projects` (`.ts`, `.py`, `.rs`, `.cpp`, `docker`, `api`, `sql`)
  - 📸 `Media/Screenshots` (`screenshot`, `capture`, `snip`, `screengrab`)
  - 🎨 `Creative/Design Assets` (`.fig`, `.psd`, `.ai`, `.sketch`, `mockup`)
  - 📦 `Software & Installers` (`.exe`, `.msi`, `.dmg`, `.pkg`, `.iso`)
  - 📚 `Reading/Books & Guides` (`.epub`, `.pdf`, `manual`, `handbook`)
- **Smart Project Auto-Clustering**: Automatically detects multi-file naming stems (e.g. `ClientAlpha_Quote.pdf`, `ClientAlpha_Specs.docx` → `Projects/Project - Client Alpha`).
- **Timeline Organization Mode**: Chronological sorting by Year and Month (`Timeline/2026/November`).
- **Custom Topic Builder**: Define your own custom topics, keywords, extensions, and color tags with the built-in rule editor.

### 🛡️ Safety-First Architecture
- **Interactive Dry-Run Approval Modal**: Inspect every file's proposed destination before a single move occurs. Search, collapse groups, and deselect files to leave them in place.
- **1-Click Rollback / Undo System**: Every organization run logs complete source and destination manifests. Revert any past cleanup with one click.
- **Collision Protection**: Automatically renames duplicates with `(1)`, `(2)` to prevent accidental overwrites.
- **System Safeguards**: Automatically skips system entries (`desktop.ini`, `thumbs.db`, `.git`, `node_modules`, `.DS_Store`).

### 🧹 Temporary & Junk Quarantine
- Detects incomplete downloads (`.crdownload`, `.part`), temporary files (`.tmp`), and leftover dumps, isolating them into a dedicated cleanup folder.

---

## 🖥️ Interface

```text
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │ 📁 Declutter                                  [↩ Undo] [⚙] [☼]  [ — ] [ □ ] [ ✕ ]│
 ├────────────────┬────────────────────────────────────────────────────────────────┤
 │ LOCATIONS      │  📁 Target: C:/Users/byte/Desktop             [Reveal] [Rescan]│
 │  🖥️ Desktop    │                                                                │
 │  📥 Downloads  │  ┌────────────┬────────────┬────────────┬────────────┐         │
 │  📄 Documents  │  │  42 Items  │   1.2 GB   │ 5 Folders  │   2 Junk   │         │
 │  📁 Custom...  │  └────────────┴────────────┴────────────┴────────────┘         │
 │                │                                                                │
 │ MODES          │  PROPOSED CATEGORIES:                                          │
 │  📂 Smart Topic│  • Finance/Invoices & Receipts (6 items)                       │
 │  ✨ Proj Cluster│ • Studies/Research & Notes (12 items)                         │
 │  📑 File Types │  • Development/Projects & Scripts (15 items)                   │
 │  📅 Timeline   │  • Media/Screenshots (7 items)                                 │
 │                │  • Cleanup/Temporary & Junk (2 items)                          │
 │ [x] Clean Junk │                                                                │
 │                │  [ ✨ Review Plan & Execute Moves (42 Files) → ]               │
 └────────────────┴────────────────────────────────────────────────────────────────┘
```

---

## 💾 Downloads

Pre-compiled production binaries are available under [GitHub Releases](https://github.com/Archbishop-0/Declutter-Organizer/releases):

| Package | Format | Size | Description |
|---|---|---|---|
| **[Declutter-Setup-1.0.0.exe](https://github.com/Archbishop-0/Declutter-Organizer/releases/latest/download/Declutter-Setup-1.0.0.exe)** | Installer | ~117 MB | Standard Windows Setup Wizard with custom install path selection and desktop shortcuts. |
| **[Declutter-Portable.exe](https://github.com/Archbishop-0/Declutter-Organizer/releases/latest/download/Declutter-Portable.exe)** | Portable | ~106 MB | Single standalone executable. Zero installation required. Runs directly from any drive or folder. |

---

## 🚀 Quick Start from Source

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or newer)
- [npm](https://www.npmjs.com/) (v9.0 or newer)

### 1. Clone the Repository
```bash
git clone https://github.com/Archbishop-0/Declutter-Organizer.git
cd Declutter-Organizer
npm install
```

### 2. Run the Desktop App
```bash
# Launch the desktop app with Electron
npm run app

# Or run in development mode with hot-reloading
npm run dev
```

### 3. Build Windows Executables
```bash
npm run dist
```
Generates both `Declutter-Portable.exe` and `Declutter-Setup-1.0.0.exe` in the `release/` directory.

---

## 🛡️ Safety & Reliability

| Protection Layer | Mechanism |
|---|---|
| **Dry-Run Preview** | Full user approval modal showing source → destination paths prior to moving files. |
| **Instant Rollback** | Persistent `.declutter-history.json` logs transactions for 1-click restore. |
| **Name Collision Prevention** | Non-destructive renaming (`file (1).ext`) avoids overwriting existing files. |
| **System Entry Filtering** | Blocks modification of critical system files, dotfiles, and repositories. |
| **Sandboxed IPC Bridge** | Context-isolated preload bridge exposing strictly audited filesystem operations. |

---

## 📦 Architecture

```
Declutter-Organizer/
├── electron/
│   ├── main.cjs            # Electron main process (IPC handlers, file ops, undo manifest)
│   └── preload.cjs         # Context isolation bridge exposing safe window.electronAPI
├── src/
│   ├── components/
│   │   ├── TitleBar.tsx    # Windows-style caption buttons, title, quick actions
│   │   ├── Sidebar.tsx     # Matte carbon navigation and organization modes
│   │   ├── FolderPicker.tsx# Target folder selector and drag-and-drop dropzone
│   │   ├── StatsOverview.tsx# File distribution metrics and category summary cards
│   │   ├── PreviewPlanModal.tsx # Interactive dry-run approval modal
│   │   ├── TopicRuleEditor.tsx  # In-app custom topic rules builder
│   │   ├── UndoHistoryModal.tsx # 1-click rollback history modal
│   │   └── SettingsModal.tsx    # Conflict resolution & safety preferences
│   ├── services/
│   │   ├── defaultRules.ts # Curated rule presets (Finance, Studies, Dev, Media, etc.)
│   │   └── organizerEngine.ts # Project stem detection, clustering, classification heuristics
│   ├── types/
│   │   └── index.ts        # TypeScript data definitions
│   ├── App.tsx             # Root application orchestrator
│   ├── index.css           # Matte black styles, custom scrollbar, base resets
│   └── main.tsx            # React 19 entry point
├── test/
│   └── engine.test.cjs     # Automated unit test suite
├── package.json
└── README.md
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).  
Developed with pride by [Archbishop](https://github.com/Archbishop-0).
