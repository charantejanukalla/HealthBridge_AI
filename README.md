# HealthBridge AI - Healthcare NGO Support Platform

HealthBridge AI is a complete, professional, production-quality healthcare support web application designed specifically for Non-Governmental Organizations (NGOs), emergency volunteers, patients, and partner hospitals. It operates as a high-fidelity SaaS administrative dashboard to streamline patient triage assessments, coordinate volunteer dispatches, monitor regional hospital bed availability, and analyze clinical metrics.

---

## 1. Project Overview

NGOs in developing regions often struggle to coordinate emergency medical transit, match incoming distress reports to volunteers with specialized skills, and monitor hospital vacancy limits. HealthBridge AI acts as a central hub for all four stakeholders:
- **NGO Coordinators**: Manage intake triages, review AI summaries, assign volunteers, and monitor hospital capacities.
- **Patients**: Submit details of symptoms and emergencies via a secure intake portal.
- **Volunteers**: Register profiles, list clinical or logistics skills, and accept caseload dispatches.
- **Partner Hospitals**: Update bed vacancies and emergency coordinate lines dynamically.

---

## 2. Features

- **Triage Dashboard**: Displays key operational statistics (Total Patients, Active Urgent Cases, Onboarded Volunteers, Partner Hospitals) and shows a live patient pipeline table.
- **Full Triage Search & Filters**: Search patients by name or symptoms, and filter lists dynamically by severity (`Emergency`, `High`, `Medium`, `Low`) or progress state (`Pending`, `Assigned`, `In Progress`, `Resolved`).
- **Patient Intake Form**: High-validation client-side registration form capturing demographics, locations, symptoms, and priority triage levels.
- **AI Patient Summary Generator**: Instantly compiles unstructured patient intake answers into a structured clinical brief. Includes immediate copying to clipboard and downloading as a text file.
- **AI FAQ Chatbot Assistant**: A dynamic chatbot that provides instant answers to standard NGO queries using keyword matching. Equipped with fast suggestion chips.
- **Interactive Care Assignment Modals**: Let coordinators select active volunteers from a dynamic dropdown and update patient status in real-time.
- **Partner Hospital Directory**: Shows hospital cards displaying location coordinates, beds available, and specialties. Includes a simulated real-time bed reservation portal.
- **Analytics & Report Generation**: Visualizes metrics with Chart.js:
  - Line graph for monthly request volume.
  - Doughnut chart for priority breakdowns.
  - Bar chart for volunteer caseload resolutions.
  - Stacked bar chart for triage priority status progression.
  - Horizontal bar chart for case density maps.
- **Operational Data Export**: Export patient records immediately to a structured `.csv` database file or print the analytics report.
- **Notification center**: Real-time alerts for incoming emergency triages.

---

## 3. Tech Stack

- **Core Structure**: HTML5 (Semantic Layout, native elements like `<dialog>` and `<fieldset>`).
- **Styling**: Vanilla CSS3 (Custom properties, CSS Grid, Flexbox, Glassmorphism, animations, responsive design).
- **Interactivity & State**: Vanilla JavaScript (ES6+, in-memory application state, event routing).
- **Visuals & Iconography**:
  - **Chart.js** via CDN for high-performance interactive charts.
  - **Lucide Icons** via CDN for crisp vector svgs.
  - **Google Fonts (Outfit)** for modern SaaS typography.
- **Backend**: Serverless client-side application. Uses local Javascript arrays and in-memory updates.

---

## 4. AI FAQ Assistant

The AI FAQ Assistant provides quick response guidance to patients, volunteers, and hospitals. Key questions answered:
1. *How do I request medical support?*
2. *Can I register as a volunteer?*
3. *Is emergency support available?*
4. *How can I contact the NGO?*
5. *How are patients prioritized?*
6. *Can hospitals join the network?*
7. *How can I donate?*
8. *Is patient data secure?*

---

## 5. AI Patient Summary Generator

When a coordinator submits a patient request, the AI engine processes the name, age, gender, medical issue, and location, compiling a concise summary like this:

> **Smart Clinical Summary**
> *Patient Ravi Kumar, age 65, reported symptoms of High Fever and Cough. The request has been marked as High Priority. Immediate volunteer follow-up is recommended. If symptoms worsen, referral to a partner hospital is advised.*

---

## 6. NGO Use Case

### Scenario: Triage Escalation
1. A patient registers symptoms of an **Asthma Attack** in Banjara Hills.
2. The platform raises a real-time **Emergency alert** in the topbar and flags the row in red on the dashboard.
3. The coordinator views the **AI Triage Summary**, which directs immediate paramedic dispatch.
4. The coordinator opens the **Manage Case** modal, selects volunteer **Sneha Patil** (who is certified in CPR and is nearby), and marks the status as **Assigned**.
5. When the patient stabilizes, the volunteer marks the case as **Resolved**, updating the global NGO metrics.

---

## 7. Installation & Local Execution

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge).
- (Optional) A local web server or VS Code extension like **Live Server**.

### Running the App
1. Clone or download the project files.
2. Navigate to the project directory:
   ```bash
   cd "HealthBridge AI"
   ```
3. Open `index.html` directly in your browser:
   - Double-click the file in your file manager, or
   - Start a local server:
     ```bash
     npx serve
     ```
     Then open `http://localhost:3000` or the output URL.

---

## 8. Deployment to Vercel

You can deploy HealthBridge AI to Vercel in seconds since it is a static frontend project:

### Option A: Using the Vercel CLI
1. Open your terminal in the project directory.
2. Install the Vercel CLI if you haven't already:
     ```bash
     npm install -g vercel
     ```
3. Run the deployment command:
     ```bash
     vercel
     ```
4. Follow the prompts:
   - Set up and deploy: **Yes**
   - Which scope: Select your personal team account
   - Link to existing project: **No**
   - Project name: `healthbridge-ai`
   - Directory: `./` (current directory)
   - Auto-detected settings: Accept defaults (Vercel automatically detects HTML/CSS/JS)
5. The CLI will output a live inspection link and a production deployment URL (e.g. `https://healthbridge-ai.vercel.app`).

### Option B: Deploying via GitHub Git Integration
1. Initialize a Git repository and commit the code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of HealthBridge AI application"
   ```
2. Create a new repository on GitHub and push your local commits.
3. Go to [Vercel](https://vercel.com) and log in.
4. Click **Add New...** -> **Project**.
5. Import your GitHub repository.
6. Click **Deploy**. Vercel will automatically host the static page.

---

## 9. Future Enhancements

- **Persistent Database**: Integration with Firebase FireStore or PostgreSQL for persistent state saving.
- **SMS & WhatsApp Dispatch**: Auto-dispatch SMS/WhatsApp notifications to assigned volunteers using Twilio APIs.
- **Geocoding Maps**: Integrate Mapbox or Google Maps API to plot active patient emergency locations and dispatch routes.
- **Clinical WebRTC Video**: Enable secure video calls between remote doctors and field volunteers inside the patient drawer.

---

*Developed by **Sai Charan Teja Nukalla***
