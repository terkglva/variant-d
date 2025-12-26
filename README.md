# Final Exam — React (Variant D)

You are given a React technical task using a ready starter project (React 18+, JavaScript).  
The project already includes a mock API, Redux Toolkit, basic layout, and one finished feature as an example.

This exam is **open book**: you may use the internet and your previous homework.  
**Phones, chats, and talking to other students are not allowed.**

> ⚠️ IMPORTANT RULES
> - **Changing mock server code or `db.json` data is strictly prohibited.**
> - You may be asked to **explain any line of your code** during the defense.

---

## How to run the project

### 1) Install dependencies
```bash
npm install
```

### 2) Run frontend + mock API together
The project includes a combined command to start server and client:

Run it with:
```bash
npm run all
```

- Mock API will run on the port defined in `server.cjs`
- React application will run on the Vite dev server

---

## Mock API (do not change)

### Available endpoints

- `GET /calls?page=&limit=&status=&from=&to=`
- `POST /calls/:id/start`
- `POST /calls/:id/finish`
- `GET /calls/:id/transcript`

> ❗ Backend logic and mock data **must not be modified**.  
> All fixes must be done on the frontend side only.

---

## Technical Task (25 points total)

Your task is to finish and refactor one feature so it works consistently with the rest of the application.

### A) Expand Date filter (5 points)
In the scheduled calls list, improve the Date filter by adding the following presets:

- **Today** — from `00:00` of the current date
- **This week** — from `00:00` Monday of the current week
- **This month** — from `00:00` of the first day of the current month

The filter must work correctly together with:
- status filter
- pagination

---

### B) Call lifecycle actions (10 points)
Implement call lifecycle actions:

- **Start call** → status changes to `in_progress` 
- **Finish call** → status changes to `completed`

Requirements:
- UI must update correctly after each action.
- All logic must use **Redux Toolkit async thunks**.
- **No API calls inside React components** (no `fetch` / `axios` in components).

---

### C) Transcript bug fix (5 points)
Find and fix a bug related to loading call transcripts:

- Endpoint: `GET /calls/:id/transcript`
- Ensure the **correct transcript** is displayed for the selected call.

⚠️ This is a **frontend-only fix**. Backend code must not be changed.

---

### D) UI consistency (5 points)
Keep UI styling consistent with the rest of the app:
- layout
- paddings
- buttons
- dropdowns
- table styles

---

## Defense (15 points)

During the defense you must show that your code works and explain what you did.

### Practical questions — 10 points
- 4 questions total
- 1 question for each task requirement
- **2.5 points per question**

### Theoretical question — 5 points
- One question about:
    - React
    - Redux Toolkit
    - async HTTP
    - SPA navigation

---

Good luck!
