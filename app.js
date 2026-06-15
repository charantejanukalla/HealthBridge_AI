/* ==========================================================================
   HealthBridge AI - Application Logic
   Designed by Sai Charan Teja Nukalla
   ========================================================================== */

// Global Application State
const State = {
  patients: [],
  volunteers: [],
  hospitals: [],
  activities: [],
  notifications: [],
  currentPage: 1,
  rowsPerPage: 8,
  activeView: 'dashboard'
};

// Global Chart References
let monthlyChart = null;
let priorityChart = null;
let activityChart = null;
let progressionChart = null;
let densityChart = null;

// ==========================================================================
// Mock Data Generation
// ==========================================================================

function initMockData() {
  // 1. Initial 4 Hospitals
  State.hospitals = [
    {
      id: 'hosp-1',
      name: 'Apollo Hospital',
      location: 'Jubilee Hills, Hyderabad',
      contact: '+91 40 2360 7777',
      beds: 18,
      emergency: 'Yes',
      specs: ['Trauma Care', 'Cardiology', 'ICU', 'Pulmonology']
    },
    {
      id: 'hosp-2',
      name: 'Care Hospital',
      location: 'Banjara Hills, Hyderabad',
      contact: '+91 40 6165 6565',
      beds: 9,
      emergency: 'Yes',
      specs: ['Pediatrics', 'Nephrology', 'Cardiac Care', 'Orthopedics']
    },
    {
      id: 'hosp-3',
      name: 'Community Health Center',
      location: 'Begumpet, Hyderabad',
      contact: '+91 40 2776 1122',
      beds: 4,
      emergency: 'No',
      specs: ['General Medicine', 'Maternity', 'Vaccination', 'Outpatient']
    },
    {
      id: 'hosp-4',
      name: 'Sunshine Medical Center',
      location: 'Gachibowli, Hyderabad',
      contact: '+91 40 4455 5555',
      beds: 15,
      emergency: 'Yes',
      specs: ['Orthopedics', 'Physiotherapy', 'Emergency Surgery', 'Rheumatology']
    }
  ];

  // 2. Initial 10 Volunteers
  State.volunteers = [
    { id: 'vol-1', name: 'Amit Sharma', email: 'amit.sharma@example.com', phone: '9876543201', city: 'Hyderabad', availability: 'Full-time', skills: ['First Aid / CPR', 'Emergency Driving'], activeCases: 2, resolvedCases: 14 },
    { id: 'vol-2', name: 'Sneha Patil', email: 'sneha.p@example.com', phone: '9876543202', city: 'Hyderabad', availability: 'Part-time', skills: ['Medical Professional (MD/RN)', 'Pediatrics Specialist'], activeCases: 1, resolvedCases: 22 },
    { id: 'vol-3', name: 'Rohan Sen', email: 'rohan.sen@example.com', phone: '9876543203', city: 'Secunderabad', availability: 'Weekends', skills: ['First Aid / CPR', 'Crisis Counseling'], activeCases: 0, resolvedCases: 8 },
    { id: 'vol-4', name: 'Ananya Iyer', email: 'ananya.i@example.com', phone: '9876543204', city: 'Hyderabad', availability: 'Evenings', skills: ['Language Translation', 'Logistics Coordination'], activeCases: 1, resolvedCases: 12 },
    { id: 'vol-5', name: 'Vikram Malhotra', email: 'vikram.m@example.com', phone: '9876543205', city: 'Hyderabad', availability: 'Full-time', skills: ['Emergency Driving', 'Logistics Coordination'], activeCases: 2, resolvedCases: 19 },
    { id: 'vol-6', name: 'Deepika Nair', email: 'deepika.n@example.com', phone: '9876543206', city: 'Secunderabad', availability: 'Part-time', skills: ['Medical Professional (MD/RN)', 'Crisis Counseling'], activeCases: 0, resolvedCases: 15 },
    { id: 'vol-7', name: 'Rahul Verma', email: 'rahul.v@example.com', phone: '9876543207', city: 'Hyderabad', availability: 'Weekends', skills: ['First Aid / CPR', 'Language Translation'], activeCases: 0, resolvedCases: 6 },
    { id: 'vol-8', name: 'Sai Krishna', email: 'sai.krishna@example.com', phone: '9876543208', city: 'Secunderabad', availability: 'Evenings', skills: ['Logistics Coordination'], activeCases: 1, resolvedCases: 11 },
    { id: 'vol-9', name: 'Sandeep Chowdary', email: 'sandeep.c@example.com', phone: '9876543209', city: 'Hyderabad', availability: 'Full-time', skills: ['First Aid / CPR', 'Emergency Driving'], activeCases: 2, resolvedCases: 25 },
    { id: 'vol-10', name: 'Pooja Hegde', email: 'pooja.h@example.com', phone: '9876543210', city: 'Hyderabad', availability: 'Part-time', skills: ['Crisis Counseling', 'Pediatrics Specialist'], activeCases: 0, resolvedCases: 9 }
  ];

  // 3. Initial 20 Patient Requests
  State.patients = [
    { id: 'pat-1', name: 'Ravi Kumar', age: 65, gender: 'Male', phone: '9876543221', email: 'ravi.k@example.com', location: 'Jubilee Hills', issue: 'High Fever and Cough', priority: 'High', status: 'Assigned', assignedVolunteer: 'Amit Sharma', notes: 'Patient has diabetes history. Reporting fever for 4 days.', dateCreated: '2026-06-10T10:30:00Z' },
    { id: 'pat-2', name: 'Sunita Devi', age: 42, gender: 'Female', phone: '9876543222', email: 'sunita.d@example.com', location: 'Banjara Hills', issue: 'Severe Asthma Attack', priority: 'Emergency', status: 'In Progress', assignedVolunteer: 'Sneha Patil', notes: 'Needs immediate oxygen inhaler delivery. Standard medicines depleted.', dateCreated: '2026-06-15T18:45:00Z' },
    { id: 'pat-3', name: 'Rajesh Patel', age: 58, gender: 'Male', phone: '9876543223', email: 'rajesh.p@example.com', location: 'Gachibowli', issue: 'Chronic Renal Failure Consultation', priority: 'Medium', status: 'Pending', assignedVolunteer: 'None', notes: 'Requesting dialysis appointment confirmation at partner clinic.', dateCreated: '2026-06-14T09:15:00Z' },
    { id: 'pat-4', name: 'Lakshmi Bai', age: 70, gender: 'Female', phone: '9876543224', email: 'lakshmi.b@example.com', location: 'Secunderabad', issue: 'Suspected Bone Fracture', priority: 'High', status: 'Assigned', assignedVolunteer: 'Rohan Sen', notes: 'Slipped in bathroom. Pain in left hip joint. Needs transit aid.', dateCreated: '2026-06-15T14:20:00Z' },
    { id: 'pat-5', name: 'Vikram Singh', age: 29, gender: 'Male', phone: '9876543225', email: 'vikram.s@example.com', location: 'Madhapur', issue: 'Dengue Symptoms', priority: 'High', status: 'In Progress', assignedVolunteer: 'Vikram Malhotra', notes: 'Platelet count dropping. High body pain and fever.', dateCreated: '2026-06-15T10:10:00Z' },
    { id: 'pat-6', name: 'Priya Sharma', age: 34, gender: 'Female', phone: '9876543226', email: 'priya.s@example.com', location: 'Begumpet', issue: 'Pregnancy Routine Checkup', priority: 'Low', status: 'Resolved', assignedVolunteer: 'Deepika Nair', notes: 'Scheduled checkup coordinated at Community Health Center.', dateCreated: '2026-06-08T08:00:00Z' },
    { id: 'pat-7', name: 'Suresh Naidu', age: 52, gender: 'Male', phone: '9876543227', email: 'suresh.n@example.com', location: 'Kukatpally', issue: 'Cardiac Pain Triage', priority: 'Emergency', status: 'Resolved', assignedVolunteer: 'Sandeep Chowdary', notes: 'Acute chest pain. Transferred to Apollo Hospital ICU.', dateCreated: '2026-06-12T11:40:00Z' },
    { id: 'pat-8', name: 'Anil Verma', age: 48, gender: 'Male', phone: '9876543228', email: 'anil.v@example.com', location: 'Secunderabad', issue: 'Severe Hypertension', priority: 'Medium', status: 'Pending', assignedVolunteer: 'None', notes: 'Blood pressure reading 170/110. Medication assistance needed.', dateCreated: '2026-06-15T20:05:00Z' },
    { id: 'pat-9', name: 'Kavitha Reddy', age: 25, gender: 'Female', phone: '9876543229', email: 'kavitha.r@example.com', location: 'Gachibowli', issue: 'General Pediatric Immunization', priority: 'Low', status: 'Resolved', assignedVolunteer: 'Pooja Hegde', notes: 'Child vaccination cycle completed.', dateCreated: '2026-06-05T15:30:00Z' },
    { id: 'pat-10', name: 'Sandeep Gupta', age: 60, gender: 'Male', phone: '9876543230', email: 'sandeep.g@example.com', location: 'Madhapur', issue: 'Severe Gastrointestinal Infection', priority: 'Medium', status: 'Assigned', assignedVolunteer: 'Ananya Iyer', notes: 'Severe dehydration. Rehydration salts and basic medicines dispatched.', dateCreated: '2026-06-15T12:00:00Z' },
    { id: 'pat-11', name: 'Meena Joshi', age: 67, gender: 'Female', phone: '9876543231', email: 'meena.j@example.com', location: 'Banjara Hills', issue: 'Chronic Arthritis Flareup', priority: 'Low', status: 'Pending', assignedVolunteer: 'None', notes: 'Requesting physiotherapist home visit coordinates.', dateCreated: '2026-06-15T17:50:00Z' },
    { id: 'pat-12', name: 'Ravi Teja', age: 12, gender: 'Male', phone: '9876543232', email: 'ravi.t@example.com', location: 'Begumpet', issue: 'High Fever & Throat Infection', priority: 'Medium', status: 'Resolved', assignedVolunteer: 'Deepika Nair', notes: 'Antibiotics prescribed by medical volunteer. Recovered.', dateCreated: '2026-06-09T16:15:00Z' },
    { id: 'pat-13', name: 'Sneha Rao', age: 31, gender: 'Female', phone: '9876543233', email: 'sneha.r@example.com', location: 'Jubilee Hills', issue: 'Acute Appendicitis Suspect', priority: 'High', status: 'Assigned', assignedVolunteer: 'Amit Sharma', notes: 'Severe pain in right lower abdomen. Needs hospital scan transit.', dateCreated: '2026-06-15T15:30:00Z' },
    { id: 'pat-14', name: 'Manoj Mishra', age: 45, gender: 'Male', phone: '9876543234', email: 'manoj.m@example.com', location: 'Secunderabad', issue: 'Post-Surgery Wound Dressing', priority: 'Medium', status: 'Assigned', assignedVolunteer: 'Sai Krishna', notes: 'Requires clean dressing kit and volunteer assistance.', dateCreated: '2026-06-14T11:00:00Z' },
    { id: 'pat-15', name: 'Divya Pillai', age: 50, gender: 'Female', phone: '9876543235', email: 'divya.p@example.com', location: 'Kukatpally', issue: 'Severe Migraine Checkup', priority: 'Low', status: 'Resolved', assignedVolunteer: 'Pooja Hegde', notes: 'Painkillers delivered. Advised neurological clinic visit.', dateCreated: '2026-06-11T09:40:00Z' },
    { id: 'pat-16', name: 'Harish Choudhary', age: 39, gender: 'Male', phone: '9876543236', email: 'harish.c@example.com', location: 'Madhapur', issue: 'Dermatological Allergy Response', priority: 'Low', status: 'Pending', assignedVolunteer: 'None', notes: 'Severe hives, requests antihistamines.', dateCreated: '2026-06-15T20:30:00Z' },
    { id: 'pat-17', name: 'Geetha Nair', age: 72, gender: 'Female', phone: '9876543237', email: 'geetha.n@example.com', location: 'Banjara Hills', issue: 'Hypertensive Emergency', priority: 'Emergency', status: 'In Progress', assignedVolunteer: 'Sandeep Chowdary', notes: 'Loss of balance, extreme blood pressure spike. Transit initialized.', dateCreated: '2026-06-15T19:50:00Z' },
    { id: 'pat-18', name: 'Vijay Yadav', age: 22, gender: 'Male', phone: '9876543238', email: 'vijay.y@example.com', location: 'Gachibowli', issue: 'Deep Laceration Wound', priority: 'High', status: 'Assigned', assignedVolunteer: 'Vikram Malhotra', notes: 'Accident while handling kitchen tools. Needs stiches.', dateCreated: '2026-06-15T16:10:00Z' },
    { id: 'pat-19', name: 'Swapna Sen', age: 56, gender: 'Female', phone: '9876543239', email: 'swapna.s@example.com', location: 'Jubilee Hills', issue: 'Urinary Tract Infection', priority: 'Medium', status: 'Resolved', assignedVolunteer: 'Ananya Iyer', notes: 'Provided test kits and lab coordinate coordination.', dateCreated: '2026-06-10T14:15:00Z' },
    { id: 'pat-20', name: 'Aditya Das', age: 35, gender: 'Male', phone: '9876543240', email: 'aditya.d@example.com', location: 'Secunderabad', issue: 'Chronic Otitis (Ear Pain)', priority: 'Low', status: 'Pending', assignedVolunteer: 'None', notes: 'Infection follow-up. Doctor consult required.', dateCreated: '2026-06-15T20:45:00Z' }
  ];

  // 4. Initial Activities Feed
  State.activities = [
    { type: 'emergency', text: 'Critical case registered: Sunita Devi (Severe Asthma Attack) in Banjara Hills.', time: '10 mins ago' },
    { type: 'assignment', text: 'Volunteer Rohan Sen assigned to Lakshmi Bai (Suspected Bone Fracture).', time: '1 hr ago' },
    { type: 'hospital', text: 'Apollo Hospital updated available beds: 18 beds vacant.', time: '3 hrs ago' },
    { type: 'registration', text: 'New volunteer onboarded: Pooja Hegde registered in Hyderabad.', time: '5 hrs ago' },
    { type: 'resolved', text: 'Patient Suresh Naidu (Cardiac Pain) successfully transferred & resolved.', time: '1 day ago' }
  ];

  // 5. Initial Notifications
  State.notifications = [
    { id: 'nt-1', text: 'Emergency: Sunita Devi reporting respiratory distress!', read: false, time: '10m ago' },
    { id: 'nt-2', text: 'New Patient request filed: Aditya Das (Low)', read: false, time: '25m ago' },
    { id: 'nt-3', text: 'Beds updated for Care Hospital: 9 beds available.', read: true, time: '2h ago' }
  ];
}

// ==========================================================================
// SPA Router & Navigation Logic
// ==========================================================================

function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sidebar = document.getElementById('app-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle-btn');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetView = link.getAttribute('data-view');
      
      // Close mobile sidebar on navigate
      sidebar.classList.remove('mobile-open');
      
      // Toggle Active Link classes
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Switch active view
      switchView(targetView);
    });
  });

  // Mobile sidebar toggle
  sidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('mobile-open');
  });

  // Close sidebar on click outside
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && e.target !== sidebarToggle) {
      sidebar.classList.remove('mobile-open');
    }
  });

  // Topbar quick button listener
  document.getElementById('dashboard-new-request-btn').addEventListener('click', () => {
    const supportNavBtn = document.getElementById('nav-btn-patients');
    supportNavBtn.click();
  });
}

function switchView(viewName) {
  State.activeView = viewName;
  
  // Hide all panels, show targets
  const viewPanels = document.querySelectorAll('.view-panel');
  viewPanels.forEach(panel => {
    panel.classList.remove('active-view');
  });
  
  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) {
    targetPanel.classList.add('active-view');
  }

  // Trigger page-specific draws
  if (viewName === 'dashboard') {
    renderDashboardStats();
    renderPatientTable();
    renderActivityFeed();
    updateDashboardCharts();
  } else if (viewName === 'hospitals') {
    renderHospitals();
  } else if (viewName === 'volunteer') {
    renderVolunteerMetrics();
  } else if (viewName === 'reports') {
    updateReportsCharts();
  }
}

// ==========================================================================
// Dashboard Stats and Table Operations
// ==========================================================================

function renderDashboardStats() {
  const totalPatients = State.patients.length;
  const activeCases = State.patients.filter(p => (p.priority === 'Emergency' || p.priority === 'High') && p.status !== 'Resolved').length;
  const totalVolunteers = State.volunteers.length;
  const totalHospitals = State.hospitals.length;

  document.getElementById('stat-total-patients').textContent = totalPatients;
  document.getElementById('stat-active-cases').textContent = activeCases;
  document.getElementById('stat-registered-volunteers').textContent = totalVolunteers;
  document.getElementById('stat-partner-hospitals').textContent = totalHospitals;
}

function renderActivityFeed() {
  const feedContainer = document.getElementById('recent-activity-feed');
  feedContainer.innerHTML = '';

  State.activities.slice(0, 5).forEach(act => {
    const item = document.createElement('div');
    item.className = 'activity-item';

    let colorClass = 'activity-icon-badge icon-blue';
    let iconName = 'info';

    if (act.type === 'emergency') {
      colorClass = 'activity-icon-badge icon-red';
      iconName = 'alert-triangle';
    } else if (act.type === 'assignment') {
      colorClass = 'activity-icon-badge icon-yellow';
      iconName = 'user-check';
    } else if (act.type === 'registration') {
      colorClass = 'activity-icon-badge icon-green';
      iconName = 'user-plus';
    } else if (act.type === 'resolved') {
      colorClass = 'activity-icon-badge icon-blue';
      iconName = 'check';
    }

    item.innerHTML = `
      <div class="${colorClass}">
        <i data-lucide="${iconName}"></i>
      </div>
      <div class="activity-details">
        <span class="activity-title">${act.text}</span>
        <span class="activity-meta">${act.time}</span>
      </div>
    `;
    feedContainer.appendChild(item);
  });
  lucide.createIcons();
}

function renderPatientTable() {
  const tbody = document.getElementById('patient-table-body');
  const searchVal = document.getElementById('table-search-input').value.toLowerCase();
  const priorityVal = document.getElementById('table-filter-priority').value;
  const statusVal = document.getElementById('table-filter-status').value;

  // Filter logic
  let filtered = State.patients.filter(pat => {
    const matchesSearch = pat.name.toLowerCase().includes(searchVal) || 
                          pat.issue.toLowerCase().includes(searchVal) ||
                          pat.location.toLowerCase().includes(searchVal);
    
    const matchesPriority = priorityVal === 'all' || pat.priority === priorityVal;
    const matchesStatus = statusVal === 'all' || pat.status === statusVal;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Sorting: Pending/Emergency first
  filtered.sort((a, b) => {
    if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
    if (b.status === 'Resolved' && a.status !== 'Resolved') return -1;
    
    const priorityWeights = { 'Emergency': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorityWeights[b.priority] - priorityWeights[a.priority];
  });

  // Pagination bounds
  const totalEntries = filtered.length;
  const totalPages = Math.ceil(totalEntries / State.rowsPerPage) || 1;
  if (State.currentPage > totalPages) State.currentPage = totalPages;

  const startIdx = (State.currentPage - 1) * State.rowsPerPage;
  const endIdx = startIdx + State.rowsPerPage;
  const paginated = filtered.slice(startIdx, endIdx);

  tbody.innerHTML = '';

  if (paginated.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 32px; color: var(--text-light);">No matching patient records found.</td></tr>`;
    document.getElementById('table-entries-count').textContent = `Showing 0 of 0 entries`;
    setupPaginationButtons(1, 1);
    return;
  }

  paginated.forEach(pat => {
    const tr = document.createElement('tr');

    const priorityClass = pat.priority.toLowerCase();
    const statusClass = pat.status.toLowerCase().replace(' ', '-');

    tr.innerHTML = `
      <td><span class="patient-cell-name">${pat.name}</span></td>
      <td>${pat.age}</td>
      <td>${pat.issue}</td>
      <td>
        <span class="badge-priority ${priorityClass}">
          ${pat.priority}
        </span>
      </td>
      <td>
        <span class="badge-status ${statusClass}">
          ${pat.status}
        </span>
      </td>
      <td>
        <span class="assigned-vol-name">${pat.assignedVolunteer}</span>
      </td>
      <td class="text-right">
        <button class="btn btn-secondary btn-table-action" onclick="openAssignmentModal('${pat.id}')" title="Manage Case" aria-label="Manage Patient Case">
          <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
          Manage
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Entries text
  const displayedCount = Math.min(endIdx, totalEntries);
  document.getElementById('table-entries-count').textContent = `Showing ${totalEntries === 0 ? 0 : startIdx + 1} to ${displayedCount} of ${totalEntries} entries`;

  setupPaginationButtons(State.currentPage, totalPages);
  lucide.createIcons();
}

function setupPaginationButtons(current, total) {
  const container = document.getElementById('table-pagination');
  container.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'pagination-btn';
  prevBtn.textContent = 'Previous';
  prevBtn.disabled = current === 1;
  prevBtn.addEventListener('click', () => {
    State.currentPage--;
    renderPatientTable();
  });
  container.appendChild(prevBtn);

  for (let i = 1; i <= total; i++) {
    const pBtn = document.createElement('button');
    pBtn.className = `pagination-btn ${current === i ? 'active' : ''}`;
    pBtn.textContent = i;
    pBtn.addEventListener('click', () => {
      State.currentPage = i;
      renderPatientTable();
    });
    container.appendChild(pBtn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'pagination-btn';
  nextBtn.textContent = 'Next';
  nextBtn.disabled = current === total;
  nextBtn.addEventListener('click', () => {
    State.currentPage++;
    renderPatientTable();
  });
  container.appendChild(nextBtn);
}

// Global Filter event binds
function setupTableFilters() {
  const searchInput = document.getElementById('table-search-input');
  const prioritySelect = document.getElementById('table-filter-priority');
  const statusSelect = document.getElementById('table-filter-status');

  searchInput.addEventListener('input', () => {
    State.currentPage = 1;
    renderPatientTable();
  });

  prioritySelect.addEventListener('change', () => {
    State.currentPage = 1;
    renderPatientTable();
  });

  statusSelect.addEventListener('change', () => {
    State.currentPage = 1;
    renderPatientTable();
  });

  // Global search input in top bar
  const globalSearch = document.getElementById('global-search');
  globalSearch.addEventListener('input', () => {
    const val = globalSearch.value;
    
    // Auto shift to dashboard if typing search from other pages
    if (State.activeView !== 'dashboard') {
      const dashLink = document.querySelector('[data-view="dashboard"]');
      dashLink.click();
    }
    
    // Mirror into table search input
    document.getElementById('table-search-input').value = val;
    State.currentPage = 1;
    renderPatientTable();
  });
}

// ==========================================================================
// Patient Assignment & Details Modal Dialog
// ==========================================================================

let activeModalPatientId = null;

window.openAssignmentModal = function(patientId) {
  const patient = State.patients.find(p => p.id === patientId);
  if (!patient) return;

  activeModalPatientId = patientId;
  
  // Set modal texts
  document.getElementById('case-patient-name').textContent = patient.name;
  
  const priorityBadge = document.getElementById('case-patient-priority');
  priorityBadge.textContent = patient.priority;
  priorityBadge.className = `badge-status-pill emergency ${patient.priority.toLowerCase()}`;
  
  document.getElementById('case-patient-age-gender').textContent = `${patient.age} / ${patient.gender}`;
  document.getElementById('case-patient-location').textContent = patient.location;
  document.getElementById('case-patient-phone').textContent = patient.phone;
  document.getElementById('case-patient-issue').textContent = patient.issue;
  document.getElementById('case-patient-notes').textContent = patient.notes || 'None provided.';

  // Fill volunteers dropdown list
  const volSelect = document.getElementById('assign-volunteer-select');
  volSelect.innerHTML = '<option value="None">Leave Unassigned</option>';
  
  State.volunteers.forEach(vol => {
    const isSelected = patient.assignedVolunteer === vol.name ? 'selected' : '';
    volSelect.innerHTML += `<option value="${vol.name}" ${isSelected}>${vol.name} (${vol.availability} - Active Cases: ${vol.activeCases})</option>`;
  });

  // Set status dropdown selection
  document.getElementById('assign-status-select').value = patient.status;

  // Open modal natively
  const modal = document.getElementById('patient-assignment-modal');
  modal.showModal();
  lucide.createIcons();
};

function setupAssignmentModalActions() {
  const modal = document.getElementById('patient-assignment-modal');
  const saveBtn = document.getElementById('save-case-assignment-btn');

  saveBtn.addEventListener('click', () => {
    if (!activeModalPatientId) return;

    const patient = State.patients.find(p => p.id === activeModalPatientId);
    if (patient) {
      const prevVol = patient.assignedVolunteer;
      const prevStatus = patient.status;
      
      const newVol = document.getElementById('assign-volunteer-select').value;
      const newStatus = document.getElementById('assign-status-select').value;

      // Update volunteer caseload counters
      if (prevVol !== 'None' && prevVol !== newVol) {
        const pVolObj = State.volunteers.find(v => v.name === prevVol);
        if (pVolObj) pVolObj.activeCases = Math.max(0, pVolObj.activeCases - 1);
      }
      if (newVol !== 'None' && prevVol !== newVol) {
        const nVolObj = State.volunteers.find(v => v.name === newVol);
        if (nVolObj) nVolObj.activeCases++;
      }
      
      // Update patient properties
      patient.assignedVolunteer = newVol;
      patient.status = newStatus;

      // Increment volunteer resolved caseload count if marked resolved
      if (newStatus === 'Resolved' && prevStatus !== 'Resolved' && newVol !== 'None') {
        const nVolObj = State.volunteers.find(v => v.name === newVol);
        if (nVolObj) {
          nVolObj.activeCases = Math.max(0, nVolObj.activeCases - 1);
          nVolObj.resolvedCases++;
        }
      }

      // Add activity entry
      let activityText = `Patient ${patient.name} updated: Status is now "${newStatus}"`;
      if (newVol !== 'None' && prevVol !== newVol) {
        activityText = `Volunteer ${newVol} assigned to Patient ${patient.name}.`;
      }
      State.activities.unshift({
        type: newStatus === 'Resolved' ? 'resolved' : 'assignment',
        text: activityText,
        time: 'Just now'
      });

      // Notification
      addNotification(`Case updated for ${patient.name}: Status is now ${newStatus}`);

      // Refresh UI Elements
      renderDashboardStats();
      renderPatientTable();
      renderActivityFeed();
      updateDashboardCharts();
    }

    modal.close();
  });
}

// ==========================================================================
// Patient Support Form & AI Summary Generator
// ==========================================================================

function setupPatientForm() {
  const form = document.getElementById('patient-support-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset validations
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      input.classList.remove('invalid');
      
      // Basic check
      if (!input.value) {
        input.classList.add('invalid');
        isValid = false;
      }
      
      // Email check
      if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          input.classList.add('invalid');
          isValid = false;
        }
      }
      
      // Phone check
      if (input.type === 'tel' && input.value) {
        const phoneClean = input.value.replace(/[\s\-\(\)\+]/g, '');
        if (phoneClean.length < 10) {
          input.classList.add('invalid');
          isValid = false;
        }
      }

      // Age check
      if (input.id === 'patient-age' && input.value) {
        const ageVal = parseInt(input.value);
        if (isNaN(ageVal) || ageVal < 0 || ageVal > 130) {
          input.classList.add('invalid');
          isValid = false;
        }
      }
    });

    if (!isValid) return;

    // Build Patient Intake object
    const newPatient = {
      id: `pat-${Date.now()}`,
      name: document.getElementById('patient-full-name').value.trim(),
      age: parseInt(document.getElementById('patient-age').value),
      gender: document.getElementById('patient-gender').value,
      phone: document.getElementById('patient-phone').value.trim(),
      email: document.getElementById('patient-email').value.trim(),
      location: document.getElementById('patient-location').value.trim(),
      priority: document.getElementById('patient-priority').value,
      issue: document.getElementById('patient-medical-issue').value.trim(),
      notes: document.getElementById('patient-notes').value.trim(),
      status: 'Pending',
      assignedVolunteer: 'None',
      dateCreated: new Date().toISOString()
    };

    // Save to State
    State.patients.unshift(newPatient);

    // Update system log & activity feed
    State.activities.unshift({
      type: newPatient.priority === 'Emergency' ? 'emergency' : 'assignment',
      text: `New intake received: ${newPatient.name} (${newPatient.priority} Priority - ${newPatient.issue})`,
      time: 'Just now'
    });

    addNotification(`Support requested for ${newPatient.name} (${newPatient.priority})`);

    // Dynamic AI Summary compilation
    compileAISummary(newPatient);

    // Reset Form fields
    form.reset();
  });

  // Clear validation styles on form reset
  form.addEventListener('reset', () => {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.classList.remove('invalid');
    });
  });
}

function compileAISummary(patient) {
  // Hide placeholder, show AI clinical card
  document.getElementById('ai-summary-placeholder').classList.add('hidden');
  const summaryCard = document.getElementById('ai-summary-card');
  summaryCard.classList.remove('hidden');

  // AI Logic generation simulation
  let recommendedAction = "Immediate volunteer coordinator follow-up is recommended.";
  let recommendedSLA = "Immediate Response (within 30 minutes)";

  if (patient.priority === 'Low') {
    recommendedAction = "Coordinate a standard clinic consultation referral. Home visit scheduled within 24-48 hours.";
    recommendedSLA = "Routine Response (within 24 hours)";
  } else if (patient.priority === 'Medium') {
    recommendedAction = "Assign field rescue volunteer to conduct basic vitals test. Telehealth doctor consult is advised.";
    recommendedSLA = "Standard Response (within 12 hours)";
  } else if (patient.priority === 'High') {
    recommendedAction = "High urgency case. Deploy field rescuer with oxygen and vital kit support immediately. Referral to a partner hospital is advised if symptoms persist.";
    recommendedSLA = "Urgent Response (within 2 hours)";
  } else if (patient.priority === 'Emergency') {
    recommendedAction = "Critical triage threat. Contact nearest partner hospital ambulance desk instantly. Route paramedic volunteer to coordinates.";
    recommendedSLA = "Emergency Response (immediate)";
  }

  const aiText = `
    <p><strong>Clinical Brief:</strong> Patient <strong>${patient.name}</strong>, aged <strong>${patient.age} (${patient.gender})</strong>, reports symptoms of <strong>${patient.issue}</strong> in region <strong>${patient.location}</strong>.</p>
    <p><strong>Prioritization & Assessment:</strong> Intake has been triage-classified as <strong>${patient.priority} Priority</strong> based on acute symptom reports.</p>
    <p><strong>Action Directive:</strong> ${recommendedAction} Ensure patient contacts phone number <strong>${patient.phone}</strong> is verified before dispatching.</p>
    ${patient.notes ? `<p><strong>NGO Internal Notes:</strong> <em>"${patient.notes}"</em></p>` : ''}
  `;

  document.getElementById('ai-summary-content-text').innerHTML = aiText;

  // Set card metadata
  const priorityChip = document.getElementById('summary-meta-priority');
  priorityChip.innerHTML = `<span class="chip-dot dot-${patient.priority === 'Emergency' || patient.priority === 'High' ? 'red' : patient.priority === 'Medium' ? 'yellow' : 'green'}"></span> Priority: ${patient.priority}`;
  document.getElementById('summary-meta-sla').textContent = recommendedSLA;

  // Wire buttons
  const copyBtn = document.getElementById('ai-copy-summary');
  const downloadBtn = document.getElementById('ai-download-summary');

  // Clear previous listeners (cloning buttons)
  const newCopyBtn = copyBtn.cloneNode(true);
  const newDownloadBtn = downloadBtn.cloneNode(true);
  copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);
  downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);

  // Raw text extract
  const rawTextSummary = `PATIENT SUMMARY REPORT
======================
Patient Name: ${patient.name}
Age/Gender: ${patient.age} / ${patient.gender}
Medical Issue: ${patient.issue}
Location: ${patient.location}
Priority: ${patient.priority}
Contact Phone: ${patient.phone}
SLA directive: ${recommendedSLA}
AI Care Directive: ${recommendedAction}
----------------------
NGO Registry: HealthBridge AI`;

  newCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(rawTextSummary).then(() => {
      newCopyBtn.innerHTML = `<i data-lucide="check"></i> Copied!`;
      lucide.createIcons();
      setTimeout(() => {
        newCopyBtn.innerHTML = `<i data-lucide="copy"></i> Copy Summary`;
        lucide.createIcons();
      }, 2000);
    });
  });

  newDownloadBtn.addEventListener('click', () => {
    const blob = new Blob([rawTextSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HealthBridge_Summary_${patient.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  lucide.createIcons();
}

// ==========================================================================
// Volunteer Onboarding Form & Metrics
// ==========================================================================

function setupVolunteerForm() {
  const form = document.getElementById('volunteer-reg-form');
  const successBanner = document.getElementById('volunteer-success-banner');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validation
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      input.classList.remove('invalid');
      if (!input.value) {
        input.classList.add('invalid');
        isValid = false;
      }

      if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          input.classList.add('invalid');
          isValid = false;
        }
      }

      if (input.type === 'tel' && input.value) {
        const phoneClean = input.value.replace(/[\s\-\(\)\+]/g, '');
        if (phoneClean.length < 10) {
          input.classList.add('invalid');
          isValid = false;
        }
      }
    });

    // Extract skills checked
    const skillsChecked = Array.from(form.querySelectorAll('input[name="vol-skills"]:checked')).map(el => el.value);
    const skillsError = document.getElementById('err-vol-skills');
    
    if (skillsChecked.length === 0) {
      skillsError.style.display = 'block';
      isValid = false;
    } else {
      skillsError.style.display = 'none';
    }

    if (!isValid) return;

    // Create record
    const newVol = {
      id: `vol-${Date.now()}`,
      name: document.getElementById('vol-full-name').value.trim(),
      email: document.getElementById('vol-email').value.trim(),
      phone: document.getElementById('vol-phone').value.trim(),
      city: document.getElementById('vol-city').value.trim(),
      availability: document.getElementById('vol-availability').value,
      skills: skillsChecked,
      activeCases: 0,
      resolvedCases: 0,
      dateCreated: new Date().toISOString()
    };

    // Save
    State.volunteers.unshift(newVol);

    // Activity & notifications
    State.activities.unshift({
      type: 'registration',
      text: `New volunteer onboarded: ${newVol.name} (${newVol.availability} Availability)`,
      time: 'Just now'
    });

    addNotification(`Volunteer forces updated: ${newVol.name} joined.`);

    // Show success alert
    successBanner.classList.remove('hidden');
    setTimeout(() => {
      successBanner.classList.add('hidden');
    }, 6000);

    // Reset Form
    form.reset();

    // Redraw metrics
    renderVolunteerMetrics();
  });

  // Clear validation styles on form reset
  form.addEventListener('reset', () => {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.classList.remove('invalid');
    });
    document.getElementById('err-vol-skills').style.display = 'none';
  });
}

function renderVolunteerMetrics() {
  const activeCount = State.volunteers.length;
  // Available: arbitrarily mock availability ratio for professional SaaS look
  const availCount = Math.ceil(activeCount * 0.65);
  // Doctor/RN count
  const medicalCount = State.volunteers.filter(v => v.skills.includes('Medical Professional (MD/RN)')).length;

  document.getElementById('vol-stat-active-count').textContent = activeCount;
  document.getElementById('vol-stat-avail-count').textContent = availCount;
  document.getElementById('vol-stat-medical-count').textContent = medicalCount;

  // Calculate percentage of skills in volunteer base
  const total = State.volunteers.length;
  const countSkill = (skillName) => State.volunteers.filter(v => v.skills.includes(skillName)).length;

  const faPct = Math.round((countSkill('First Aid / CPR') / total) * 100) || 0;
  const drPct = Math.round((countSkill('Medical Professional (MD/RN)') / total) * 100) || 0;
  const edPct = Math.round((countSkill('Emergency Driving') / total) * 100) || 0;
  const ccPct = Math.round((countSkill('Crisis Counseling') / total) * 100) || 0;

  // Update progress fills
  document.getElementById('skill-val-firstaid').textContent = `${faPct}%`;
  document.querySelector('.skill-progress-bar:nth-child(2) .progress-fill').style.width = `${faPct}%`;

  document.getElementById('skill-val-driving').textContent = `${edPct}%`;
  document.querySelector('.skill-progress-bar:nth-child(3) .progress-fill').style.width = `${edPct}%`;

  document.getElementById('skill-val-doctors').textContent = `${drPct}%`;
  document.querySelector('.skill-progress-bar:nth-child(4) .progress-fill').style.width = `${drPct}%`;

  document.getElementById('skill-val-counseling').textContent = `${ccPct}%`;
  document.querySelector('.skill-progress-bar:nth-child(5) .progress-fill').style.width = `${ccPct}%`;

  // Recently onboarded ul
  const ul = document.getElementById('recently-onboarded-volunteers-ul');
  ul.innerHTML = '';

  State.volunteers.slice(0, 5).forEach(v => {
    const initials = v.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="vol-profile-brief">
        <div class="avatar-initials">${initials}</div>
        <div class="vol-details">
          <span class="vol-name">${v.name}</span>
          <span class="vol-city">${v.city} • ${v.skills[0]}</span>
        </div>
      </div>
      <span class="badge-avail">${v.availability}</span>
    `;
    ul.appendChild(li);
  });
}

// ==========================================================================
// FAQ Chatbot Logic
// ==========================================================================

const FAQ_DATABASE = {
  "hello": "Hello! How can I help you today? You can ask me questions about patient support, volunteer registration, emergency priority rules, partner hospitals, donations, or data security. Select one of the quick chips or type a query.",
  "hi": "Hello! How can I help you today? You can ask me questions about patient support, volunteer registration, emergency priority rules, partner hospitals, donations, or data security. Select one of the quick chips or type a query.",
  "greetings": "Hello! How can I help you today? You can ask me questions about patient support, volunteer registration, emergency priority rules, partner hospitals, donations, or data security. Select one of the quick chips or type a query.",
  "request medical support": "You can request support by going to the **Patient Support** tab in the sidebar, filling out the Patient Intake Form, and clicking **Request Medical Support**. Our system will immediately prioritize your case and notify nearby volunteers.",
  "request support": "You can request support by going to the **Patient Support** tab in the sidebar, filling out the Patient Intake Form, and clicking **Request Medical Support**. Our system will immediately prioritize your case and notify nearby volunteers.",
  "register as a volunteer": "Yes! We welcome volunteers. Go to the **Volunteer Registration** tab, fill out your skills and availability, and register. Once submitted, you'll be listed in our volunteer database for coordination.",
  "register as volunteer": "Yes! We welcome volunteers. Go to the **Volunteer Registration** tab, fill out your skills and availability, and register. Once submitted, you'll be listed in our volunteer database for coordination.",
  "volunteer": "Yes! We welcome volunteers. Go to the **Volunteer Registration** tab, fill out your skills and availability, and register. Once submitted, you'll be listed in our volunteer database for coordination.",
  "emergency support": "Yes, HealthBridge AI provides a dedicated triage process. Cases flagged as **Emergency** trigger real-time notifications for immediate volunteer dispatch. We recommend coordinating with our partner hospitals for acute trauma, cardiac, or respiratory distress.",
  "emergency": "Yes, HealthBridge AI provides a dedicated triage process. Cases flagged as **Emergency** trigger real-time notifications for immediate volunteer dispatch. We recommend coordinating with our partner hospitals for acute trauma, cardiac, or respiratory distress.",
  "contact the ngo": "You can contact HealthBridge AI headquarters directly at +91 40 5550 0199 or email us at support@healthbridge.ngo. We have physical regional clinics in Begumpet, Jubilee Hills, and Gachibowli.",
  "contact": "You can contact HealthBridge AI headquarters directly at +91 40 5550 0199 or email us at support@healthbridge.ngo. We have physical regional clinics in Begumpet, Jubilee Hills, and Gachibowli.",
  "phone": "You can contact HealthBridge AI headquarters directly at +91 40 5550 0199 or email us at support@healthbridge.ngo. We have physical regional clinics in Begumpet, Jubilee Hills, and Gachibowli.",
  "email": "You can contact HealthBridge AI headquarters directly at +91 40 5550 0199 or email us at support@healthbridge.ngo. We have physical regional clinics in Begumpet, Jubilee Hills, and Gachibowli.",
  "address": "You can contact HealthBridge AI headquarters directly at +91 40 5550 0199 or email us at support@healthbridge.ngo. We have physical regional clinics in Begumpet, Jubilee Hills, and Gachibowli.",
  "call": "You can contact HealthBridge AI headquarters directly at +91 40 5550 0199 or email us at support@healthbridge.ngo. We have physical regional clinics in Begumpet, Jubilee Hills, and Gachibowli.",
  "prioritized": "Our system uses four priority levels: **Emergency** (immediate response within 30 minutes), **High** (urgent, within 2 hours), **Medium** (routine clinics/diagnostics, 12 hours), and **Low** (routine followups/inquiries, 24 hours).",
  "priority": "Our system uses four priority levels: **Emergency** (immediate response within 30 minutes), **High** (urgent, within 2 hours), **Medium** (routine clinics/diagnostics, 12 hours), and **Low** (routine followups/inquiries, 24 hours).",
  "hospitals join": "Partner hospitals can join our network by contacting our integrations desk at hospital-network@healthbridge.ngo. Once registered, hospitals can share real-time bed counts and coordinates.",
  "hospital": "Partner hospitals can join our network by contacting our integrations desk at hospital-network@healthbridge.ngo. Once registered, hospitals can share real-time bed counts and coordinates.",
  "donate": "Donations are processed securely through our portal. Go to healthbridge.ngo/donate to make one-off or recurring contributions. 100% of public donations directly fund patients' medicines, diagnostics, and transit costs.",
  "donation": "Donations are processed securely through our portal. Go to healthbridge.ngo/donate to make one-off or recurring contributions. 100% of public donations directly fund patients' medicines, diagnostics, and transit costs.",
  "data secure": "Absolutely. Patient data is encrypted in transit and at rest. Access is restricted strictly to authorized NGO coordinators and assigned case volunteers under strict HIPAA-aligned privacy guidelines.",
  "secure": "Absolutely. Patient data is encrypted in transit and at rest. Access is restricted strictly to authorized NGO coordinators and assigned case volunteers under strict HIPAA-aligned privacy guidelines.",
  "security": "Absolutely. Patient data is encrypted in transit and at rest. Access is restricted strictly to authorized NGO coordinators and assigned case volunteers under strict HIPAA-aligned privacy guidelines.",
  "privacy": "Absolutely. Patient data is encrypted in transit and at rest. Access is restricted strictly to authorized NGO coordinators and assigned case volunteers under strict HIPAA-aligned privacy guidelines.",
  "safe": "Absolutely. Patient data is encrypted in transit and at rest. Access is restricted strictly to authorized NGO coordinators and assigned case volunteers under strict HIPAA-aligned privacy guidelines."
};

function setupChatbot() {
  const container = document.getElementById('chat-messages-container');
  const inputForm = document.getElementById('chatbot-input-form');
  const textInput = document.getElementById('chat-text-input');
  const clearBtn = document.getElementById('clear-chat-btn');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  // Load welcome message
  container.innerHTML = '';
  appendBotMessage("Hello! I am the HealthBridge AI Assistant. I can help answer common questions about patient support requests, volunteer onboarding, prioritization rules, and partner hospitals. Select one of the quick chips below or type a query.");

  // Chip click binds
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const question = chip.getAttribute('data-question');
      handleUserChatQuery(question);
    });
  });

  // Submit input form
  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = textInput.value.trim();
    if (!query) return;
    
    handleUserChatQuery(query);
    textInput.value = '';
  });

  // Clear chat logs
  clearBtn.addEventListener('click', () => {
    container.innerHTML = '';
    appendBotMessage("Chat history cleared. How can I assist you today?");
  });
}

function handleUserChatQuery(text) {
  // Append user bubble
  appendUserMessage(text);
  
  // Simulated thinking delay & loading bubble
  const typingId = appendTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator(typingId);
    
    // Process keyword matching
    const searchString = text.toLowerCase();
    let matchedAnswer = "I couldn't find a precise match for that query in our FAQ database. Please contact our coordinator desk directly at +91 40 5550 0199 or try rephrasing (e.g. ask 'How do I request support?', 'how can I volunteer?', 'emergency support', 'data security').";

    for (let key in FAQ_DATABASE) {
      if (searchString.includes(key)) {
        matchedAnswer = FAQ_DATABASE[key];
        break;
      }
    }

    appendBotMessage(matchedAnswer);
  }, 900);
}

function appendUserMessage(text) {
  const container = document.getElementById('chat-messages-container');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble chat-bubble-user';
  
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  bubble.innerHTML = `
    <div class="bubble-avatar user">U</div>
    <div class="bubble-text">
      <p>${text}</p>
    </div>
  `;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function appendBotMessage(text) {
  const container = document.getElementById('chat-messages-container');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble chat-bubble-bot';

  // Support basic markdown emphasis for headers or bold text
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');

  bubble.innerHTML = `
    <div class="bubble-avatar bot">AI</div>
    <div class="bubble-text">
      <p>${formattedText}</p>
    </div>
  `;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function appendTypingIndicator() {
  const container = document.getElementById('chat-messages-container');
  const bubble = document.createElement('div');
  const id = `typing-${Date.now()}`;
  bubble.className = 'chat-bubble chat-bubble-bot';
  bubble.id = id;

  bubble.innerHTML = `
    <div class="bubble-avatar bot">AI</div>
    <div class="bubble-text typing-indicator-bubble" style="padding: 10px 18px;">
      <span style="font-weight: 500; font-size: 0.85rem; color: var(--text-light);">AI is compiling reply...</span>
    </div>
  `;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ==========================================================================
// Partner Hospitals Network Operations
// ==========================================================================

function renderHospitals() {
  const container = document.getElementById('hospitals-container');
  container.innerHTML = '';

  State.hospitals.forEach(hosp => {
    const card = document.createElement('div');
    card.className = 'hospital-card glass-card';

    const bedStatusClass = hosp.beds > 10 ? 'active' : hosp.beds > 0 ? 'active' : 'full';
    const bedStatusLabel = hosp.beds > 0 ? `${hosp.beds} Beds Available` : 'Fully Booked';

    card.innerHTML = `
      <div class="hospital-card-header">
        <h3>${hosp.name}</h3>
        <span class="hospital-badge-status ${bedStatusClass}">${bedStatusLabel}</span>
      </div>
      <div class="hospital-details-list">
        <div class="hospital-detail-item">
          <i data-lucide="map-pin"></i>
          <span><strong>Location:</strong> ${hosp.location}</span>
        </div>
        <div class="hospital-detail-item">
          <i data-lucide="phone"></i>
          <span><strong>Contact:</strong> ${hosp.contact}</span>
        </div>
        <div class="hospital-detail-item">
          <i data-lucide="shield-alert"></i>
          <span><strong>Emergency Services:</strong> ${hosp.emergency}</span>
        </div>
      </div>
      <div class="hospital-actions-bar">
        <button class="btn btn-secondary" onclick="openHospitalDetails('${hosp.id}')" aria-label="View hospital details">View Details</button>
        <button class="btn btn-primary" onclick="simulateHospitalContact('${hosp.name}', '${hosp.contact}')" aria-label="Contact hospital">Contact</button>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

window.openHospitalDetails = function(hospId) {
  const hosp = State.hospitals.find(h => h.id === hospId);
  if (!hosp) return;

  document.getElementById('modal-hospital-name').textContent = hosp.name;
  document.getElementById('modal-hospital-location').textContent = hosp.location;
  document.getElementById('modal-hospital-contact').textContent = hosp.contact;
  document.getElementById('modal-hospital-beds').textContent = `${hosp.beds} Beds Vacant`;
  document.getElementById('modal-hospital-beds').className = `badge-beds ${hosp.beds > 10 ? '' : 'urgent'}`;
  
  const emergencyStatusBadge = document.getElementById('modal-hospital-emergency');
  emergencyStatusBadge.textContent = hosp.emergency;
  emergencyStatusBadge.className = `badge-status-pill emergency ${hosp.emergency.toLowerCase() === 'yes' ? '' : 'no-services'}`;

  // Populate Specs
  const specsUl = document.getElementById('modal-hospital-specs');
  specsUl.innerHTML = '';
  hosp.specs.forEach(s => {
    specsUl.innerHTML += `<li>${s}</li>`;
  });

  // Simulator Reservation click listener
  const reserveBtn = document.getElementById('modal-reserve-bed-btn');
  const newReserveBtn = reserveBtn.cloneNode(true);
  reserveBtn.parentNode.replaceChild(newReserveBtn, reserveBtn);

  newReserveBtn.addEventListener('click', () => {
    if (hosp.beds > 0) {
      hosp.beds--;
      
      State.activities.unshift({
        type: 'hospital',
        text: `Bed reserved at ${hosp.name} for urgent NGO patient transfer.`,
        time: 'Just now'
      });
      
      addNotification(`Bed Reservation confirmed at ${hosp.name}.`);
      document.getElementById('modal-hospital-beds').textContent = `${hosp.beds} Beds Vacant`;

      newReserveBtn.disabled = true;
      newReserveBtn.textContent = "Bed Reserved Successfully ✓";
      
      // Refresh grids
      renderHospitals();
      renderDashboardStats();
      updateDashboardCharts();
    } else {
      alert("No vacant beds available at this facility currently.");
    }
  });

  const modal = document.getElementById('hospital-details-modal');
  modal.showModal();
  lucide.createIcons();
};

window.simulateHospitalContact = function(name, contactNum) {
  alert(`Connecting to ${name} coordinate desk...\nLine: ${contactNum}\n NGO Priority Dialing Activated.`);
};

// ==========================================================================
// Chart.js Visualization Operations
// ==========================================================================

function updateDashboardCharts() {
  if (State.activeView !== 'dashboard') return;

  // 1. Line Chart: Monthly Requests
  const ctxMonthly = document.getElementById('monthlyRequestsChart').getContext('2d');
  
  // Calculate priority volumes
  const lowCount = State.patients.filter(p => p.priority === 'Low').length;
  const medCount = State.patients.filter(p => p.priority === 'Medium').length;
  const highCount = State.patients.filter(p => p.priority === 'High').length;
  const emergCount = State.patients.filter(p => p.priority === 'Emergency').length;

  if (monthlyChart) monthlyChart.destroy();
  
  // Mock monthly data points (representing growth of the NGO network)
  monthlyChart = new Chart(ctxMonthly, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Support Requests',
        data: [14, 28, 42, 38, 55, State.patients.length],
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // 2. Doughnut Chart: Priority Distribution
  const ctxPriority = document.getElementById('priorityDistributionChart').getContext('2d');
  if (priorityChart) priorityChart.destroy();

  priorityChart = new Chart(ctxPriority, {
    type: 'doughnut',
    data: {
      labels: ['Low', 'Medium', 'High', 'Emergency'],
      datasets: [{
        data: [lowCount, medCount, highCount, emergCount],
        backgroundColor: ['#94a3b8', '#f59e0b', '#f97316', '#ef4444'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, font: { family: 'Outfit', size: 10 } }
        }
      }
    }
  });

  // 3. Bar Chart: Volunteer Activity
  const ctxActivity = document.getElementById('volunteerActivityChart').getContext('2d');
  if (activityChart) activityChart.destroy();

  // Top 5 active volunteers resolved counts
  const topVols = State.volunteers.slice(0, 5);
  const volNames = topVols.map(v => v.name.split(' ')[0]);
  const resolvedCounts = topVols.map(v => v.resolvedCases);

  activityChart = new Chart(ctxActivity, {
    type: 'bar',
    data: {
      labels: volNames,
      datasets: [{
        label: 'Resolved Cases',
        data: resolvedCounts,
        backgroundColor: '#0d9488',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function updateReportsCharts() {
  if (State.activeView !== 'reports') return;

  // 1. Stacked Bar Chart: Case Status Distribution vs. Priority Triages
  const ctxProgression = document.getElementById('reportProgressionChart').getContext('2d');
  if (progressionChart) progressionChart.destroy();

  const getStatusCount = (priority, status) => {
    return State.patients.filter(p => p.priority === priority && p.status === status).length;
  };

  const statusCategories = ['Pending', 'Assigned', 'In Progress', 'Resolved'];
  const priorities = ['Low', 'Medium', 'High', 'Emergency'];
  const colors = ['#94a3b8', '#0284c7', '#f59e0b', '#ef4444'];

  const datasets = priorities.map((p, idx) => {
    return {
      label: p,
      data: statusCategories.map(s => getStatusCount(p, s)),
      backgroundColor: colors[idx]
    };
  });

  progressionChart = new Chart(ctxProgression, {
    type: 'bar',
    data: {
      labels: statusCategories,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      },
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  // 2. Horizontal Bar: Location Patient Density Map
  const ctxDensity = document.getElementById('reportDensityChart').getContext('2d');
  if (densityChart) densityChart.destroy();

  // Aggregate count by locations
  const locationCounts = {};
  State.patients.forEach(p => {
    locationCounts[p.location] = (locationCounts[p.location] || 0) + 1;
  });

  const sortedLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const locLabels = sortedLocations.map(e => e[0]);
  const locValues = sortedLocations.map(e => e[1]);

  densityChart = new Chart(ctxDensity, {
    type: 'bar',
    data: {
      labels: locLabels,
      datasets: [{
        label: 'Patients Registered',
        data: locValues,
        backgroundColor: 'rgba(13, 148, 136, 0.75)',
        borderColor: '#0d9488',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { beginAtZero: true }
      }
    }
  });
}

function setupReportsActions() {
  document.getElementById('reports-print-btn').addEventListener('click', () => {
    window.print();
  });

  document.getElementById('reports-export-btn').addEventListener('click', () => {
    // Compile patients CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Patient Name,Age,Gender,Phone,Email,Location,Medical Issue,Priority,Status,Assigned Volunteer,Intake Date\n";
    
    State.patients.forEach(pat => {
      const row = [
        pat.id,
        `"${pat.name}"`,
        pat.age,
        pat.gender,
        pat.phone,
        pat.email,
        `"${pat.location}"`,
        `"${pat.issue}"`,
        pat.priority,
        pat.status,
        `"${pat.assignedVolunteer}"`,
        pat.dateCreated
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HealthBridge_Patients_Dataset_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// ==========================================================================
// Notifications & Alerts System
// ==========================================================================

function renderNotifications() {
  const container = document.getElementById('notification-list-container');
  const countBadge = document.querySelector('.badge-dot');

  container.innerHTML = '';
  const unreadCount = State.notifications.filter(n => !n.read).length;
  
  if (unreadCount > 0) {
    countBadge.style.display = 'block';
  } else {
    countBadge.style.display = 'none';
  }

  if (State.notifications.length === 0) {
    container.innerHTML = `<li class="notification-empty">No notifications available</li>`;
    return;
  }

  State.notifications.forEach(notif => {
    const li = document.createElement('li');
    li.className = `notification-item ${notif.read ? 'read' : 'unread'}`;
    li.innerHTML = `
      <p class="notif-text">${notif.text}</p>
      <span class="notif-time">${notif.time}</span>
    `;
    
    // Mark single notification read on click
    li.addEventListener('click', () => {
      notif.read = true;
      renderNotifications();
    });

    container.appendChild(li);
  });
}

function addNotification(text) {
  State.notifications.unshift({
    id: `nt-${Date.now()}`,
    text: text,
    read: false,
    time: 'Just now'
  });
  renderNotifications();
}

function setupNotificationsDropdown() {
  const trigger = document.getElementById('notifications-trigger');
  const dropdown = document.getElementById('notification-dropdown-menu');
  const markReadBtn = document.getElementById('mark-all-read');

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open-dropdown');
  });

  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target)) {
      dropdown.classList.remove('open-dropdown');
    }
  });

  markReadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    State.notifications.forEach(n => n.read = true);
    renderNotifications();
  });
}

// ==========================================================================
// Application Core Bootloader
// ==========================================================================

window.addEventListener('DOMContentLoaded', () => {
  // Boot data
  initMockData();

  // Draw UI views
  renderDashboardStats();
  renderPatientTable();
  renderActivityFeed();
  renderNotifications();

  // Bind Actions & listeners
  setupNavigation();
  setupTableFilters();
  setupAssignmentModalActions();
  setupPatientForm();
  setupVolunteerForm();
  setupChatbot();
  setupReportsActions();
  setupNotificationsDropdown();

  // Load Lucide SVG Icons
  lucide.createIcons();

  // Initialize visual charts
  setTimeout(() => {
    updateDashboardCharts();
  }, 100);
});
