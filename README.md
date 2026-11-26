# Annual Report Portal

A desktop-based annual report management system designed to help educational institutions manage departments, collect annual reports, and streamline the report submission and approval process.

## Overview

The **Annual Report Portal** is built to centralize institutional annual reporting. It allows administrators to manage departments, track report submissions, and review, approve, or reject reports through a unified desktop application.

The application uses Electron and React for the desktop interface, Node.js and Express for backend APIs, and PostgreSQL for persistent data storage.

## Features

### 1. Dashboard
- Displays total registered departments.
- Tracks submitted reports.
- Shows reports awaiting review.
- Displays approved reports.
- Provides department-wise submission progress.
- Shows recent report submissions.

### 2. Department Management
- Create new departments.
- View all registered departments.
- Edit department information.
- Delete departments.
- Track department reporting progress.
- Search departments.

### 3. Annual Report Management
- Create annual reports.
- Associate reports with departments.
- Add report titles, categories, academic years, and descriptions.
- Edit draft reports.
- Delete draft reports.
- Submit reports for review.
- Track report statuses.

### 4. Review & Approval
- View submitted reports.
- Move submitted reports into review.
- Approve reports.
- Reject reports with a rejection reason.
- Track approval and rejection statuses.

### 5. Database Integration
- PostgreSQL database for persistent storage.
- Prisma ORM for database operations.
- REST APIs built with Express.
- Department and report data remains available after application restarts.

## Technology Stack

| Technology | Purpose |
|---|---|
| Electron | Desktop application |
| React | Frontend interface |
| Vite | Frontend development
