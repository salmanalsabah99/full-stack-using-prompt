#Voice-to-Code
**Status:** Work in progress
**Type:** Prompt-to-code experiment / Full-stack via voice / Cursor playground

---

##What this is

This project explores whether a full-stack app can be built entirely through spoken logic.

I’m using ChatGPT’s speech-to-text to speak through every piece of the app — describing logic, structure, and flow out loud, in detail. These spoken instructions are converted into written prompts by ChatGPT, and then passed into Cursor to generate both the frontend and backend code.

It’s not casual conversation — I’m articulating clear development logic, like:
“When the TaskBoard loads, fetch all TaskLists from the backend and render each one in a horizontally scrollable column. Add a button to create a new TaskList that sends a POST request and updates the layout immediately.”

This prompt becomes the blueprint for actual code — no manual typing, no boilerplate, just direct translation from thought to instruction to implementation.
---

##Why I’m doing this
- I want to think in logic, speak in code, and skip the keyboard.
- Prompting is becoming its own kind of engineering — I want to stretch it.
- I’m testing if natural speech can reduce dev time while improving clarity.
- I’m exploring the boundaries of what Cursor + GPT can build when guided precisely.

---

##Current Focus: Helper App
The project being built is a Notion-style productivity tool, featuring:
- TaskBoard (Kanban-style layout)
- Calendar
- Notes
- Visual Prioritization View (priority orbit)

Every component is built using only prompts — and every prompt is generated from speech.

---

##Process
The entire development process is prompt-driven, and every prompt is derived from spoken logic.

1. I speak the logic of what I want — including layout, state behavior, component structure, backend flow, etc.
2. ChatGPT transcribes and refines the logic into a prompt.
3. I paste the prompt into Cursor to generate or modify the code.
4. I review and iterate only through further spoken logic — no manual editing unless debugging.

---

##Prompting Styles
We use two kinds of prompts:

##1. Natural Prompt – Styling & Design
Rebuild the TaskBoard UI in a clean, minimal way using the current file structure already in place. Do not create new directories or components unless necessary.

✅ CORE FUNCTIONALITY
1. Fetch and Render Lists
- Load all TaskLists from the backend (MySQL)
- Use the real backend API (TRPC or REST)
- Display each list as a glassmorphic vertical column with its title

2. Add New List
- Add a “+ Add List” button at the end of the board
- Clicking the button:
  - Sends a request to create a new TaskList
  - Appends it immediately to the list layout

3. No Drag, No Grid Layout
- Do not include drag-and-drop behavior yet
- Just use a simple flex-based horizontal layout that wraps when needed

✅ VISUAL DESIGN
- Background: Starry Night theme (from-indigo-900 via-sky-800 to-sky-700)
- List cards: bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg text-white
- Header: Center-aligned gradient text “Task Board”

  
##2. Logic-Heavy Prompt – Functionality Bug Fix
Fix the task deletion bug where the first attempt shows “Task not found” and only the retry works.

✅ Problem
- When clicking "Delete", the backend returns: "Task not found"
- On retry, the task is deleted successfully

✅ Root Cause
- The frontend is likely optimistically updating the UI before the backend has completed the delete
- The task ID might be missing, stale, or removed from memory before the mutation executes

✅ Required Fix
1. Disable Optimistic Deletion
- Do not remove the task from state until the backend confirms success

2. Confirm Task ID
```ts
if (!taskId) {
  console.warn("No task ID provided to delete");
  return;
}
```

3. Await the Delete Mutation
```ts
try {
  await deleteTask({ id });
  setTasks(prev => prev.filter(t => t.id !== id));
} catch (error) {
  showErrorToast("Failed to delete task. Try again.");
}
```

4. Ensure Fresh State
- Check that task IDs are passed correctly through props
- Avoid stale component references

✅ Result
- Task deletes immediately on first attempt
- No error toast unless there’s a real backend failure

---
##Visual Progress
You can include screenshots here to show how the app has evolved. This is a space to celebrate progress, show off cool UI work, and visually track the growth of the project.

(Insert images here in GitHub using Markdown once uploaded.)
