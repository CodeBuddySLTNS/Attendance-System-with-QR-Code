# User Guide

The Attendance System with QR Code keeps the class list, QR credentials, and attendance logs in one place. Follow the steps below to go from account creation to exporting attendance reports.

## STEP 1 — Access the system
1. Open a Chromium-based browser (Chrome, Edge, Arc, Brave) for the best QR-scanner support.
2. Go to the deployed URL configured in `system.config.json` or run `npm run dev` inside `client/` for a local session.
3. Choose **Sign Up** to create a teacher/admin account or **Login** if your credentials already exist.

## STEP 2 — Manage departments & students (Admin)
1. Go to `Students` after logging in as an admin.
2. Click **Add Student** to encode a learner manually (Student ID optional, department + year required).
3. Use **Upload Excel** when importing multiple entries at once. The spreadsheet must contain the columns `Name`, `Department`, and `Year`.
4. Hover over any student row to:
   - **Generate QR** – opens a dialog with the encoded QR and download button.
   - **Edit** – update IDs, department/year, or upload a profile photo.
   - **Delete** – permanently remove the student from the database.

## STEP 3 — Create classes (Teacher)
1. Teachers land on **My Classes** after logging in.
2. Click **New Class** to define the class label (e.g., `BSIT 3A`), pick the department, year level, and meeting time.
3. Save the dialog—it appears in the class list instantly. Use the card to open the class workspace.

## STEP 4 — Add students to a class
1. Inside a class, switch to the **Students** tab.
2. Use **Add Student** to search the global student list. Filter by name or student number.
3. Select one or more students, then click **Add Selected**.
4. Use **Remove** beside any listed student to detach them from the class.

## STEP 5 — Record attendance with QR
1. Switch to the **Scan** tab.
2. If multiple cameras exist, choose one from the dropdown. On phones/tablets, the rear camera is selected automatically.
3. Hold the student’s QR code (downloaded earlier or on their ID) in front of the camera. A successful scan:
   - Shows the student photo/name on the right panel.
   - Sends an “IN” record with the current date and Manila time zone.
4. Repeat for every learner entering the room.

## STEP 6 — Review and export attendance
1. Open the **Attendance** tab inside a class.
2. Pick a specific date to see the daily table. Use the trash icon to remove an incorrect log.
3. Toggle **Show all days** to load the attendance matrix (students vs. dates).
4. Use **Export Daily** for spreadsheets filtered to the selected date, or **Export Matrix** for the full grid.

## STEP 7 — Sign out / switch accounts
1. Click your profile menu (top-right in the layout).
2. Choose **Logout** to clear the session before another teacher/admin logs in.

---

### Quick Tips
- **Camera blocked?** Allow camera permissions in the browser address bar, then refresh.
- **Red toast errors** usually mean the QR belongs to a student not enrolled in the open class. Add them first under the **Students** tab.
- **Bulk upload failed rows** are logged in the browser console. Check department spelling or year values.
- **Save often.** Dialogs such as Add/Edit Student close automatically only after a successful API response. If it stays open, fix the validation errors shown in red.
- **Time zone awareness.** Attendance timestamps use Asia/Manila; adjust exported sheets accordingly if you operate elsewhere.


