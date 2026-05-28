# DriveClone

> Cloud file management platform with nested folders, authenticated uploads/downloads, expiring public sharing links, and direct-to-storage architecture using Supabase.

## Live Demo

[https://file-uploader-sand-five.vercel.app/](#)

---

## Features

* Nested folder hierarchy with breadcrumb navigation
* Secure authentication using Passport.js and PostgreSQL sessions
* Direct-to-storage uploads using Supabase signed URLs
* Expiring public share links with subtree authorization
* File downloads through signed download URLs
* Recursive folder structure using materialized paths
* Toast notifications, loading states, and validation pipelines

---

## Tech Stack

### Backend

* Express.js
* Prisma ORM
* PostgreSQL (Supabase)
* Passport.js
* express-session
* connect-pg-simple
* bcrypt
* express-validator

### Frontend

* EJS
* Tailwind CSS
* Vanilla JavaScript

### Storage & Deployment

* Supabase Storage
* Vercel

---

## Architecture Highlights

### Direct-to-Storage Upload Pipeline

Files are uploaded directly to Supabase Storage using signed upload URLs instead of routing binary uploads through the Express server.

This reduces server load and separates:

* metadata persistence (PostgreSQL)
* binary storage (Supabase Storage)

---

### Public Folder Sharing

Folders can be shared publicly using expiring tokenized URLs.

Access inside shared folders is secured using materialized path validation:

```js
folder.path.startsWith(sharedRoot.path)
```

This ensures public links cannot escape the allowed subtree.

---

## Database Design

### Core Models

* User
* Folder
* File
* SharedFolder
* Session

### Folder Hierarchy

Folders use:

* self-referencing recursive relations
* materialized paths for traversal and authorization

---

## Screenshots

### Application UI

<img width="1920" height="973" alt="{B2D70872-634F-41B8-A261-CC03E7ED7651}" src="https://github.com/user-attachments/assets/9b52c48d-7337-46e1-aa18-c2e61055c287" />


### System Architecture

<img width="1892" height="713" alt="{CB2CFFEA-7825-4513-8CA1-ECD3E11587DB}" src="https://github.com/user-attachments/assets/d185ad2d-bf0b-4252-96b2-382b1a7279b9" />


### Database ERD

<img width="1783" height="726" alt="{384B0576-8C66-403A-8A0C-B495BF316826}" src="https://github.com/user-attachments/assets/6380cb17-8ea0-4072-b835-f269887c8486" />


---

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=

DIRECT_URL=

SUPABASE_URL=

SUPABASE_SECRET_KEY=

SESSION_SECRET=
```

---

## Run Locally

Clone the repository:

```bash
git clone <your-repo-url>
```

Move into project directory:

```bash
cd <project-name>
```

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Start development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Future Improvements

* Drag and drop uploads
* Multi-user collaboration
* File previews
* Search functionality
* Folder permissions
* Storage usage analytics
