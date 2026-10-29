
"use strict";

/* ==========================================================
   EDUMANAGE - STUDENT MANAGEMENT SYSTEM
   Storage: Browser localStorage
   ========================================================== */

const DB_KEY = "edumanage_database_v1";

const blankDB = () => ({
  school: "My School",
  students: [],
  teachers: [],
  payments: [],
  attendance: [],
  exams: []
});

function loadDB() {
  try {
    const saved = JSON.parse(localStorage.getItem(DB_KEY));
    if (saved && typeof saved === "object") {
      const db = { ...blankDB(), ...saved };
      ["students", "teachers", "payments", "attendance", "exams"].forEach(k => {
        if (!Array.isArray(db[k])) db[k] = [];
      });
      return db;
    }
  } catch (error) {
    console.error("Could not read saved data:", error);
  }
  return blankDB();
}

let db = loadDB();
let currentPage = "dashboard";
let toastTimer;

function saveDB() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return true;
  } catch (error) {
    console.error(error);
    notify("Could not save data. Browser storage may be full.");
    return false;
  }
}

const $ = selector => document.querySelector(selector);
const money = n => "₹" + Number(n || 0).toLocaleString("en-IN", {
  maximumFractionDigits: 2
});
const today = () => localDate(new Date());
function localDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function uid(prefix) {
  return prefix + "-" + Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).slice(2, 6).toUpperCase();
}
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}
function shortDate(value) {
  if (!value) return "—";
  const d = new Date(value + "T00:00:00");
  return Number.isNaN(d.getTime()) ? esc(value) :
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function studentName(id) {
  const s = db.students.find(x => x.id === id);
  return s ? s.name : "Deleted student";
}
function totalPaid(id) {
  return db.payments.filter(p => p.studentId === id)
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
}
function balance(s) {
  return Math.max(0, Number(s.totalFee || 0) - totalPaid(s.id));
}
function feeStatus(s) {
  const fee = Number(s.totalFee || 0);
  const paid = totalPaid(s.id);
  if (balance(s) === 0) return "Paid";
  if (paid > 0) return "Partial";
  return "Due";
}
function percent(a, b) {
  return b ? Math.round(a / b * 100) : 0;
}
function statusBadge(value) {
  const map = {
    Paid: "paid", Partial: "partial", Due: "due",
    Present: "present", Absent: "absent", Late: "late",
    Active: "active", Pass: "pass", Fail: "fail"
  };
  const cls = map[value] || "neutral";
  return `<span class="status ${cls}">${esc(value)}</span>`;
}
function notify(message) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}
function refreshIcons() {
  if (window.lucide) lucide.createIcons();
}
function pageHeading(title, subtitle, button = "") {
  return `<div class="page-heading">
    <div><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div>
    <div class="heading-actions">${button}</div>
  </div>`;
}
function statCard(label, value, note, icon, color) {
  return `<div class="stat-card">
    <div class="stat-top"><span class="stat-label">${esc(label)}</span>
    <span class="stat-icon ${color}"><i data-lucide="${icon}"></i></span></div>
    <div class="stat-value">${value}</div>
    <div class="stat-note">${note}</div>
  </div>`;
}
function emptyState(title, message) {
  return `<div class="empty-state"><i data-lucide="inbox"></i>
    <strong>${esc(title)}</strong>${esc(message)}</div>`;
}
function tablePanel(title, subtitle, headers, rows, emptyTitle, emptyMessage) {
  return `<div class="panel">
    <div class="panel-head"><div><h3>${esc(title)}</h3><p>${esc(subtitle)}</p></div></div>
    ${rows.length ? `<div class="table-wrap"><table>
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${rows.join("")}</tbody>
    </table></div>` : emptyState(emptyTitle, emptyMessage)}
  </div>`;
}
function actionButtons(type, id) {
  return `<div class="actions">
    <button class="icon-btn" title="View" onclick="viewRecord('${type}','${id}')"><i data-lucide="eye"></i></button>
    <button class="icon-btn" title="Edit" onclick="editRecord('${type}','${id}')"><i data-lucide="pencil"></i></button>
    <button class="icon-btn delete" title="Delete" onclick="deleteRecord('${type}','${id}')"><i data-lucide="trash-2"></i></button>
  </div>`;
}
function studentOptions(selected = "") {
  return `<option value="">Select student</option>` +
    db.students.map(s => `<option value="${esc(s.id)}" ${s.id === selected ? "selected" : ""}>${esc(s.name)} (${esc(s.roll || s.id)})</option>`).join("");
}
function field(label, name, value = "", type = "text", required = false, extra = "") {
  return `<div class="field"><label for="f_${esc(name)}">${esc(label)}${required ? " *" : ""}</label>
    <input class="control" id="f_${esc(name)}" name="${esc(name)}" type="${type}" value="${esc(value)}" ${required ? "required" : ""} ${extra}></div>`;
}
function selectField(label, name, options, selected = "", required = true) {
  return `<div class="field"><label for="f_${esc(name)}">${esc(label)}${required ? " *" : ""}</label>
    <select class="control" id="f_${esc(name)}" name="${esc(name)}" ${required ? "required" : ""}>
    ${options.map(o => `<option value="${esc(o[0])}" ${String(o[0]) === String(selected) ? "selected" : ""}>${esc(o[1])}</option>`).join("")}
    </select></div>`;
}
function textareaField(label, name, value = "") {
  return `<div class="field full"><label for="f_${esc(name)}">${esc(label)}</label>
    <textarea class="control" id="f_${esc(name)}" name="${esc(name)}">${esc(value)}</textarea></div>`;
}

/* ------------------ NAVIGATION ------------------ */

function navigate(page) {
  const allowed = ["dashboard", "students", "teachers", "fees", "attendance", "exams", "reports"];
  if (!allowed.includes(page)) return;
  currentPage = page;
  document.querySelectorAll(".nav-link[data-page]").forEach(b => {
    b.classList.toggle("active", b.dataset.page === page);
  });
  const names = {
    dashboard: "Dashboard", students: "Students", teachers: "Teachers",
    fees: "Fee Management", attendance: "Attendance",
    exams: "Exams & Results", reports: "Reports"
  };
  $("#currentPage").textContent = names[page];
  $("#sidebar").classList.remove("open");
  render();
}
function toggleSidebar() {
  $("#sidebar").classList.toggle("open");
}
function render() {
  const pages = {
    dashboard: renderDashboard, students: renderStudents,
    teachers: renderTeachers, fees: renderFees,
    attendance: renderAttendance, exams: renderExams,
    reports: renderReports
  };
  $("#pageContent").innerHTML = pages[currentPage]();
  refreshIcons();
}

/* ------------------ DASHBOARD ------------------ */

function renderDashboard() {
  const collected = db.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const due = db.students.reduce((sum, s) => sum + balance(s), 0);
  const markedToday = db.attendance.filter(a => a.date === today());
  const presentToday = markedToday.filter(a => a.status === "Present" || a.status === "Late").length;
  const attendanceRate = percent(presentToday, markedToday.length);
  const recent = [...db.students].sort((a,b) =>
    (b.admissionDate || "").localeCompare(a.admissionDate || "")).slice(0,5);

  const rows = recent.map(s => `<tr>
    <td><div class="cell-main"><div class="person-avatar">${esc((s.name || "?").charAt(0).toUpperCase())}</div>
    <div><strong>${esc(s.name)}</strong><small>${esc(s.id)}</small></div></div></td>
    <td>${esc(s.className || "—")} ${s.section ? "· " + esc(s.section) : ""}</td>
    <td>${money(s.totalFee)}</td><td>${money(balance(s))}</td>
    <td>${statusBadge(feeStatus(s))}</td></tr>`);

  return pageHeading("Dashboard", "Here's an overview of your school's records.", 
      `<button class="btn btn-primary" onclick="openForm('students')"><i data-lucide="plus"></i> Add Student</button>`) +
    `<div class="stats-grid">
      ${statCard("Total Students", db.students.length, "Registered student records", "users", "blue")}
      ${statCard("Total Teachers", db.teachers.length, "Registered teaching staff", "user-round", "purple")}
      ${statCard("Fees Collected", money(collected), "Recorded payments", "wallet", "green")}
      ${statCard("Outstanding Fees", money(due), "Remaining student balances", "clock", "orange")}
    </div>
    <div class="dashboard-grid">
      <div>
        ${tablePanel("Recent Students", "Latest admissions first", ["Student","Class","Total Fee","Balance","Fee Status"], rows, "No students yet", "Add your first student to get started.")}
        <div class="panel"><div class="panel-head"><div><h3>Fee Overview</h3><p>Recorded payments compared with assigned fees</p></div></div>
          <div class="panel-body">
            ${progressRow("Fees collected", collected, collected + due, "green")}
            ${progressRow("Fees outstanding", due, collected + due, "orange")}
            <div class="detail-item"><span>Total assigned fees</span><strong>${money(collected + due)}</strong></div>
          </div>
        </div>
      </div>
      <div>
        <div class="panel"><div class="panel-head"><div><h3>Quick Actions</h3><p>Frequently used tools</p></div></div>
          <div class="panel-body"><div class="quick-grid">
            ${quickAction("user-plus","Add Student","Create a student record","students")}
            ${quickAction("user-round-plus","Add Teacher","Register a teacher","teachers")}
            ${quickAction("wallet","Record Fee","Add a payment","fees")}
            ${quickAction("calendar-check","Attendance","Mark attendance","attendance")}
            ${quickAction("clipboard-list","Enter Marks","Record exam results","exams")}
            ${quickAction("chart-no-axes-combined","Reports","View school summaries","reports")}
          </div></div>
        </div>
        <div class="panel"><div class="panel-head"><div><h3>Today's Attendance</h3><p>Based on saved attendance entries</p></div></div>
          <div class="panel-body">
            <div class="stat-value">${attendanceRate}%</div>
            <div class="stat-note">${presentToday} present/late out of ${markedToday.length} marked</div>
            ${progressRow("Attendance marked", markedToday.length, db.students.length, "green")}
            <button class="btn btn-primary" onclick="navigate('attendance')">Open Attendance</button>
          </div>
        </div>
      </div>
    </div>`;
}
function quickAction(icon, title, subtitle, page) {
  return `<button class="quick-action" onclick="${page === "students" || page === "teachers" ? `openForm('${page}')` : `navigate('${page}')`}">
    <i data-lucide="${icon}"></i><strong>${title}</strong><small>${subtitle}</small></button>`;
}
function progressRow(label, value, total, color = "") {
  const p = percent(value, total);
  return `<div class="progress-row"><div class="progress-title"><span>${esc(label)}</span><span>${money(value)} · ${p}%</span></div>
    <div class="progress-track"><div class="progress-fill ${color}" style="width:${Math.min(100,p)}%"></div></div></div>`;
}

/* ------------------ STUDENTS ------------------ */

function renderStudents() {
  const rows = db.students.map(s => `<tr data-search="${esc([s.name,s.id,s.roll,s.className,s.section,s.parent,s.phone].join(" ").toLowerCase())}">
    <td><div class="cell-main"><div class="person-avatar">${esc((s.name || "?").charAt(0).toUpperCase())}</div>
    <div><strong>${esc(s.name)}</strong><small>${esc(s.id)} · Roll ${esc(s.roll || "—")}</small></div></div></td>
    <td>${esc(s.className || "—")}${s.section ? " · " + esc(s.section) : ""}</td>
    <td>${esc(s.parent || "—")}<small>${esc(s.phone || "")}</small></td>
    <td>${money(s.totalFee)}</td><td>${money(totalPaid(s.id))}</td><td><strong>${money(balance(s))}</strong></td>
    <td>${statusBadge(feeStatus(s))}</td><td>${actionButtons("students", s.id)}</td></tr>`);
  return pageHeading("Student Management", "Maintain admissions, student profiles and fee balances.",
    `<button class="btn" onclick="print()"><i data-lucide="printer"></i> Print</button><button class="btn btn-primary" onclick="openForm('students')"><i data-lucide="plus"></i> Add Student</button>`) +
    `<div class="toolbar"><div class="search-wrap"><i data-lucide="search"></i><input id="tableSearch" class="search-input" placeholder="Search name, ID, roll, class or phone..." oninput="filterRows()"></div>
    <select id="classFilter" class="control" onchange="filterRows()"><option value="">All Classes</option>${[...new Set(db.students.map(s => s.className).filter(Boolean))].sort().map(c=>`<option value="${esc(c.toLowerCase())}">${esc(c)}</option>`).join("")}</select></div>` +
    tablePanel("All Students", `${db.students.length} student record(s)`, ["Student","Class","Parent / Contact","Total Fee","Paid","Balance","Fee Status","Actions"], rows, "No student records", "Click Add Student to register a student.");
}
function filterRows() {
  const search = ($("#tableSearch")?.value || "").toLowerCase().trim();
  const cls = $("#classFilter")?.value || "";
  document.querySelectorAll("#pageContent tbody tr[data-search]").forEach(row => {
    const classText = row.cells[1]?.textContent.toLowerCase() || "";
    row.hidden = !(row.dataset.search.includes(search) && (!cls || classText.includes(cls)));
  });
}

/* ------------------ TEACHERS ------------------ */

function renderTeachers() {
  const rows = db.teachers.map(t => `<tr data-search="${esc([t.name,t.id,t.subject,t.phone,t.className].join(" ").toLowerCase())}">
    <td><div class="cell-main"><div class="person-avatar green">${esc((t.name || "?").charAt(0).toUpperCase())}</div>
    <div><strong>${esc(t.name)}</strong><small>${esc(t.id)}</small></div></div></td>
    <td>${esc(t.subject || "—")}</td><td>${esc(t.className || "—")}</td>
    <td>${esc(t.phone || "—")}</td><td>${money(t.salary)}</td><td>${shortDate(t.joinDate)}</td>
    <td>${actionButtons("teachers",t.id)}</td></tr>`);
  return pageHeading("Teacher Management", "Manage teacher profiles, subjects, assignments and salaries.",
    `<button class="btn btn-primary" onclick="openForm('teachers')"><i data-lucide="plus"></i> Add Teacher</button>`) +
    `<div class="toolbar"><div class="search-wrap"><i data-lucide="search"></i><input id="tableSearch" class="search-input" placeholder="Search teachers..." oninput="filterRows()"></div></div>` +
    tablePanel("All Teachers", `${db.teachers.length} teacher record(s)`, ["Teacher","Subject","Assigned Class","Phone","Salary","Joining Date","Actions"], rows, "No teachers yet", "Add your first teacher to get started.");
}

/* ------------------ FEES ------------------ */

function renderFees() {
  const collected = db.payments.reduce((n,p)=>n+Number(p.amount||0),0);
  const due = db.students.reduce((n,s)=>n+balance(s),0);
  const rows = db.payments.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(p=>`<tr data-search="${esc([studentName(p.studentId),p.id,p.method,p.note,p.date].join(" ").toLowerCase())}">
    <td><strong>${esc(p.id)}</strong></td><td>${esc(studentName(p.studentId))}</td>
    <td>${shortDate(p.date)}</td><td>${esc(p.method)}</td><td><strong>${money(p.amount)}</strong></td>
    <td>${esc(p.note || "—")}</td><td><button class="icon-btn delete" title="Delete payment" onclick="deleteRecord('payments','${p.id}')"><i data-lucide="trash-2"></i></button></td></tr>`);
  const dueRows = db.students.filter(s=>balance(s)>0).map(s=>`<tr>
    <td><strong>${esc(s.name)}</strong><small>${esc(s.id)} · ${esc(s.className||"—")}</small></td>
    <td>${money(s.totalFee)}</td><td>${money(totalPaid(s.id))}</td>
    <td><strong>${money(balance(s))}</strong></td><td>${statusBadge(feeStatus(s))}</td>
    <td><button class="btn btn-small btn-primary" onclick="openForm('payments','',{studentId:'${s.id}'})">Record Payment</button></td></tr>`);
  return pageHeading("Fee Management", "Track student payments, outstanding balances and payment history.",
    `<button class="btn btn-primary" onclick="openForm('payments')"><i data-lucide="plus"></i> Record Payment</button>`) +
    `<div class="stats-grid">
      ${statCard("Total Assigned Fees",money(db.students.reduce((n,s)=>n+Number(s.totalFee||0),0)),"Across all registered students","receipt","blue")}
      ${statCard("Total Collected",money(collected),"All recorded fee payments","wallet","green")}
      ${statCard("Pending Dues",money(due),"Outstanding student balances","clock","orange")}
      ${statCard("Students With Dues",db.students.filter(s=>balance(s)>0).length,"Students with unpaid balances","users","purple")}
    </div>` +
    tablePanel("Outstanding Fees","Students with a remaining balance",["Student","Assigned Fee","Paid","Balance","Status","Action"],dueRows,"No pending dues","All students are fully paid, or no students have been registered.") +
    tablePanel("Payment History","All recorded transactions",["Payment ID","Student","Date","Method","Amount","Note","Action"],rows,"No payments yet","Record a payment to see it here.");
}

/* ------------------ ATTENDANCE ------------------ */

function renderAttendance() {
  const date = $("#attendanceDate")?.value || today();
  const entries = db.attendance.filter(a=>a.date===date);
  const byStudent = new Map(entries.map(a=>[a.studentId,a]));
  const rows = db.students.map(s=>{
    const a=byStudent.get(s.id);
    const history=db.attendance.filter(x=>x.studentId===s.id);
    const marked=history.filter(x=>x.status==="Present"||x.status==="Late").length;
    return `<tr data-search="${esc([s.name,s.id,s.roll,s.className].join(" ").toLowerCase())}">
      <td><div class="cell-main"><div class="person-avatar">${esc((s.name||"?").charAt(0).toUpperCase())}</div>
      <div><strong>${esc(s.name)}</strong><small>${esc(s.className||"—")} · Roll ${esc(s.roll||"—")}</small></div></div></td>
      <td>${a ? statusBadge(a.status) : statusBadge("Not Marked")}</td>
      <td>${history.length ? percent(marked,history.length)+"%" : "—"}</td>
      <td><button class="btn btn-small" onclick="setAttendance('${s.id}','${date}','Present')">Present</button>
      <button class="btn btn-small" onclick="setAttendance('${s.id}','${date}','Absent')">Absent</button>
      <button class="btn btn-small" onclick="setAttendance('${s.id}','${date}','Late')">Late</button></td>
    </tr>`;
  });
  return pageHeading("Attendance Management","Mark and review daily student attendance.",
    `<button class="btn" onclick="print()"><i data-lucide="printer"></i> Print</button>`) +
    `<div class="panel"><div class="panel-head"><div><h3>Daily Register</h3><p>Choose a date, then mark each student.</p></div>
    <input id="attendanceDate" class="control" style="max-width:170px" type="date" value="${esc(date)}" onchange="render()"></div>
    <div class="panel-body"><div class="toolbar">
      <div class="search-wrap"><i data-lucide="search"></i><input id="tableSearch" class="search-input" placeholder="Search student..." oninput="filterRows()"></div>
      <button class="btn btn-primary" onclick="markAllPresent('${date}')">Mark All Present</button>
    </div>
    <div class="detail-list" style="margin-bottom:18px">
      <div class="detail-item"><span>Present</span><strong>${entries.filter(a=>a.status==="Present").length}</strong></div>
      <div class="detail-item"><span>Late</span><strong>${entries.filter(a=>a.status==="Late").length}</strong></div>
      <div class="detail-item"><span>Absent</span><strong>${entries.filter(a=>a.status==="Absent").length}</strong></div>
      <div class="detail-item"><span>Not marked</span><strong>${db.students.length-entries.length}</strong></div>
    </div></div>
    ${db.students.length ? `<div class="table-wrap"><table><thead><tr><th>Student</th><th>Status</th><th>Attendance Rate</th><th>Mark Attendance</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>` : emptyState("No students","Register students before taking attendance.")}</div>`;
}
function setAttendance(studentId,date,status) {
  const existing=db.attendance.find(a=>a.studentId===studentId&&a.date===date);
  if(existing) existing.status=status;
  else db.attendance.push({id:uid("ATT"),studentId,date,status});
  if(saveDB()) { render(); notify("Attendance saved."); }
}
function markAllPresent(date) {
  if(!db.students.length) return notify("Add students first.");
  db.students.forEach(s=>{
    const existing=db.attendance.find(a=>a.studentId===s.id&&a.date===date);
    if(existing) existing.status="Present";
    else db.attendance.push({id:uid("ATT"),studentId:s.id,date,status:"Present"});
  });
  if(saveDB()) {render();notify("All students marked present.");}
}

/* ------------------ EXAMS & RESULTS ------------------ */

function renderExams() {
  const rows=db.exams.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(e=>{
    const s=db.students.find(x=>x.id===e.studentId);
    const pct=percent(e.marks,e.maxMarks);
    return `<tr data-search="${esc([studentName(e.studentId),e.subject,e.examName,e.date,s?.className].join(" ").toLowerCase())}">
      <td><strong>${esc(e.examName)}</strong><small>${shortDate(e.date)}</small></td>
      <td>${esc(studentName(e.studentId))}</td><td>${esc(e.subject)}</td>
      <td>${Number(e.marks)} / ${Number(e.maxMarks)}</td><td>${pct}%</td>
      <td>${statusBadge(pct>=33?"Pass":"Fail")}</td>
      <td><div class="actions"><button class="icon-btn" title="Edit" onclick="editRecord('exams','${e.id}')"><i data-lucide="pencil"></i></button>
      <button class="icon-btn delete" title="Delete" onclick="deleteRecord('exams','${e.id}')"><i data-lucide="trash-2"></i></button></div></td></tr>`;
  });
  const avg=db.exams.length ? Math.round(db.exams.reduce((n,e)=>n+percent(e.marks,e.maxMarks),0)/db.exams.length) : 0;
  return pageHeading("Exams & Results","Enter subject-wise marks and track student performance.",
    `<button class="btn btn-primary" onclick="openForm('exams')"><i data-lucide="plus"></i> Add Result</button>`) +
    `<div class="stats-grid">
      ${statCard("Exam Entries",db.exams.length,"Recorded subject results","clipboard-list","blue")}
      ${statCard("Average Score",avg+"%","Average across all entries","chart-no-axes-combined","green")}
      ${statCard("Passed",db.exams.filter(e=>percent(e.marks,e.maxMarks)>=33).length,"Entries with 33% or higher","check-circle","purple")}
      ${statCard("Needs Improvement",db.exams.filter(e=>percent(e.marks,e.maxMarks)<33).length,"Entries below 33%","trending-up","orange")}
    </div>
    <div class="toolbar"><div class="search-wrap"><i data-lucide="search"></i><input id="tableSearch" class="search-input" placeholder="Search student, exam or subject..." oninput="filterRows()"></div>
    <button class="btn" onclick="print()"><i data-lucide="printer"></i> Print Results</button></div>`+
    tablePanel("Result Register","Each row represents one student's result in one subject.",["Exam","Student","Subject","Marks","Percentage","Result","Actions"],rows,"No results recorded","Add an exam result to get started.");
}

/* ------------------ REPORTS ------------------ */

function renderReports() {
  const totalFees=db.students.reduce((n,s)=>n+Number(s.totalFee||0),0);
  const paid=db.payments.reduce((n,p)=>n+Number(p.amount||0),0);
  const due=db.students.reduce((n,s)=>n+balance(s),0);
  const present=db.attendance.filter(a=>a.status==="Present"||a.status==="Late").length;
  const attendanceRate=percent(present,db.attendance.length);
  const byClass={};
  db.students.forEach(s=>{
    const name=s.className||"Unassigned";
    if(!byClass[name]) byClass[name]={students:0,fee:0,paid:0,due:0};
    byClass[name].students++;
    byClass[name].fee+=Number(s.totalFee||0);
    byClass[name].paid+=totalPaid(s.id);
    byClass[name].due+=balance(s);
  });
  const classRows=Object.entries(byClass).sort(([a],[b])=>a.localeCompare(b)).map(([name,v])=>
    `<tr><td><strong>${esc(name)}</strong></td><td>${v.students}</td><td>${money(v.fee)}</td><td>${money(v.paid)}</td><td>${money(v.due)}</td></tr>`);
  const subjectRows=Object.entries(db.exams.reduce((acc,e)=>{
    if(!acc[e.subject]) acc[e.subject]={sum:0,count:0};
    acc[e.subject].sum+=percent(e.marks,e.maxMarks);acc[e.subject].count++;return acc;
  },{})).sort(([a],[b])=>a.localeCompare(b)).map(([subject,v])=>
    `<tr><td><strong>${esc(subject)}</strong></td><td>${v.count}</td><td>${Math.round(v.sum/v.count)}%</td></tr>`);
  return pageHeading("Reports & Analytics","A summary of student enrolment, fee collection, attendance and results.",
    `<button class="btn" onclick="print()"><i data-lucide="printer"></i> Print Reports</button><button class="btn btn-primary" onclick="exportData()"><i data-lucide="download"></i> Export Backup</button>`) +
    `<div class="report-cards">
      <div class="report-card"><small>Total Students</small><h2>${db.students.length}</h2></div>
      <div class="report-card"><small>Total Assigned Fees</small><h2>${money(totalFees)}</h2></div>
      <div class="report-card"><small>Collected Payments</small><h2>${money(paid)}</h2></div>
      <div class="report-card"><small>Outstanding Dues</small><h2>${money(due)}</h2></div>
      <div class="report-card"><small>Attendance Rate</small><h2>${attendanceRate}%</h2><small>Based on saved attendance entries</small></div>
      <div class="report-card"><small>Exam Average</small><h2>${db.exams.length?Math.round(db.exams.reduce((n,e)=>n+percent(e.marks,e.maxMarks),0)/db.exams.length):0}%</h2></div>
    </div>`+
    tablePanel("Class-wise Fee Report","Fees are based on student fee assignments and recorded payments.",["Class","Students","Assigned Fees","Paid","Outstanding"],classRows,"No class data","Add students to generate class reports.")+
    tablePanel("Subject Performance","Average percentage for each subject.",["Subject","Entries","Average Score"],subjectRows,"No exam data","Record results to generate performance reports.")+
    `<div class="panel"><div class="panel-head"><div><h3>Attendance Summary</h3><p>Counts are based on all saved attendance entries.</p></div></div><div class="panel-body">
      <div class="detail-list">
        <div class="detail-item"><span>Present</span><strong>${db.attendance.filter(a=>a.status==="Present").length}</strong></div>
        <div class="detail-item"><span>Late</span><strong>${db.attendance.filter(a=>a.status==="Late").length}</strong></div>
        <div class="detail-item"><span>Absent</span><strong>${db.attendance.filter(a=>a.status==="Absent").length}</strong></div>
        <div class="detail-item"><span>Total attendance records</span><strong>${db.attendance.length}</strong></div>
      </div>
    </div></div>`;
}

/* ------------------ ADD / EDIT FORMS ------------------ */

function openForm(type, id = "", defaults = {}) {
  const record = id ? getRecord(type,id) : null;
  const r = record || {};
  let title = "", body = "";
  const f = (label,name,def,type="text",req=false,extra="") => field(label,name,def,type,req,extra);
  const sf = (label,name,options,def="",req=true) => selectField(label,name,options,def,req);
  const classes = [["","Select class"], ...Array.from({length:12},(_,i)=>[String(i+1),"Class "+(i+1)])];
  const sections = [["A","A"],["B","B"],["C","C"],["D","D"]];
  const methods = [["Cash","Cash"],["UPI","UPI"],["Bank Transfer","Bank Transfer"],["Card","Card"],["Cheque","Cheque"]];

  if(type==="students") {
    title = record ? "Edit Student" : "Add New Student";
    body = `<div class="form-grid">
      ${f("Full Name","name",r.name,"text",true)}
      ${f("Roll Number","roll",r.roll,"text",true)}
      ${sf("Class","className",classes,r.className||"",true)}
      ${sf("Section","section",sections,r.section||"A",true)}
      ${f("Date of Birth","dob",r.dob,"date")}
      ${f("Admission Date","admissionDate",r.admissionDate||today(),"date",true)}
      ${f("Parent / Guardian Name","parent",r.parent,"text",true)}
      ${f("Contact Number","phone",r.phone,"tel",true,'pattern="[0-9+() -]{7,20}"')}
      ${f("Email Address","email",r.email,"email")}
      ${f("Total Assigned Fees (₹)","totalFee",r.totalFee??0,"number",true,'min="0" step="0.01"')}
      ${f("Address","address",r.address)}
      ${f("Emergency Contact","emergency",r.emergency,"tel")}
      ${textareaField("Additional Notes","notes",r.notes)}
    </div><p class="form-note" style="margin-top:14px">Student ID is generated automatically. Payments are tracked separately in Fee Management.</p>`;
  } else if(type==="teachers") {
    title = record ? "Edit Teacher" : "Add New Teacher";
    body = `<div class="form-grid">
      ${f("Full Name","name",r.name,"text",true)}
      ${f("Subject","subject",r.subject,"text",true)}
      ${f("Assigned Class","className",r.className,"text",true)}
      ${f("Contact Number","phone",r.phone,"tel",true)}
      ${f("Email Address","email",r.email,"email")}
      ${f("Qualification","qualification",r.qualification,"text",true)}
      ${f("Joining Date","joinDate",r.joinDate||today(),"date",true)}
      ${f("Monthly Salary (₹)","salary",r.salary??0,"number",true,'min="0" step="0.01"')}
      ${textareaField("Address","address",r.address)}
    </div>`;
  } else if(type==="payments") {
    title = "Record Fee Payment";
    if(!db.students.length) {notify("Please add a student first.");return;}
    body = `<div class="form-grid">
      ${sf("Student","studentId",db.students.map(s=>[s.id,`${s.name} · Balance ${money(balance(s))}`]),defaults.studentId||"",true)}
      ${f("Payment Date","date",today(),"date",true)}
      ${f("Payment Amount (₹)","amount","","number",true,'min="0.01" step="0.01"')}
      ${sf("Payment Method","method",methods,"UPI",true)}
      ${f("Receipt / Reference Number","reference","","text")}
      ${f("Note / Fee Period","note","","text")}
    </div><p class="form-note" style="margin-top:14px">A payment is added to the student's payment history. Enter only the amount actually received.</p>`;
  } else if(type==="exams") {
    title = record ? "Edit Exam Result" : "Add Exam Result";
    if(!db.students.length) {notify("Please add a student first.");return;}
    body = `<div class="form-grid">
      ${sf("Student","studentId",db.students.map(s=>[s.id,`${s.name} · ${s.className||"No class"}`]),r.studentId||"",true)}
      ${f("Exam Name","examName",r.examName||"Unit Test","text",true)}
      ${f("Subject","subject",r.subject,"text",true)}
      ${f("Exam Date","date",r.date||today(),"date",true)}
      ${f("Maximum Marks","maxMarks",r.maxMarks??100,"number",true,'min="1" step="0.01"')}
      ${f("Marks Obtained","marks",r.marks,"number",true,'min="0" step="0.01"')}
    </div><p class="form-note" style="margin-top:14px">The result percentage is calculated automatically. The default pass threshold is 33%.</p>`;
  } else {
    notify("This form is not available.");
    return;
  }

  $("#modalRoot").innerHTML = `<div class="modal-backdrop" onclick="if(event.target===this)closeModal()">
    <div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="modal-head"><h2>${esc(title)}</h2><button class="icon-btn" onclick="closeModal()" aria-label="Close"><i data-lucide="x"></i></button></div>
      <form id="recordForm" class="modal-content" onsubmit="submitForm(event,'${type}','${id}')">
        ${body}
        <div class="modal-foot"><button type="button" class="btn" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary"><i data-lucide="check"></i> ${record ? "Save Changes" : "Save Record"}</button></div>
      </form>
    </div></div>`;
  refreshIcons();
  const first = $("#recordForm input:not([type=hidden]), #recordForm select");
  if(first) first.focus();
}
function closeModal() {
  $("#modalRoot").innerHTML = "";
}
function getRecord(type,id) {
  const key = type === "payments" ? "payments" : type;
  return (db[key] || []).find(x=>x.id===id) || null;
}
function submitForm(event,type,id) {
  event.preventDefault();
  const form=event.target;
  if(!form.reportValidity()) return;
  const data=Object.fromEntries(new FormData(form).entries());
  const numFields = type==="students" ? ["totalFee"] :
    type==="teachers" ? ["salary"] :
    type==="payments" ? ["amount"] : ["maxMarks","marks"];
  numFields.forEach(k=>data[k]=Number(data[k]||0));

  if(type==="students" && data.totalFee<0) return notify("Fees cannot be negative.");
  if(type==="teachers" && data.salary<0) return notify("Salary cannot be negative.");
  if(type==="payments") {
    if(!Number.isFinite(data.amount)||data.amount<=0) return notify("Enter a payment amount greater than zero.");
    const s=db.students.find(x=>x.id===data.studentId);
    if(!s) return notify("Select a valid student.");
    if(data.amount>balance(s)+0.000001) {
      return notify("Payment exceeds the student's remaining balance.");
    }
  }
  if(type==="exams") {
    if(data.maxMarks<=0||data.marks<0||data.marks>data.maxMarks)
      return notify("Marks must be between zero and maximum marks.");
    if(!db.students.some(s=>s.id===data.studentId)) return notify("Select a valid student.");
  }

  if(type==="payments") {
    data.id=uid("PAY");
    db.payments.push(data);
  } else {
    const list=db[type];
    if(id) {
      const index=list.findIndex(x=>x.id===id);
      if(index<0) return notify("Record no longer exists.");
      list[index]={...list[index],...data};
    } else {
      data.id=uid(type==="students"?"STU":type==="teachers"?"TCH":"EXM");
      if(type==="students" && db.students.some(s=>s.roll===data.roll&&s.className===data.className&&s.section===data.section))
        return notify("That roll number already exists in this class and section.");
      list.push(data);
    }
  }

  if(saveDB()) {
    closeModal();
    render();
    notify(id ? "Record updated successfully." : "Record saved successfully.");
  }
}

/* ------------------ VIEW / EDIT / DELETE ------------------ */

function editRecord(type,id) {
  if(type==="payments") return notify("Payments cannot be edited. Delete the entry and record it again.");
  openForm(type,id);
}
function viewRecord(type,id) {
  const r=getRecord(type,id);
  if(!r) return notify("Record not found.");
  let pairs=[];
  if(type==="students") {
    pairs=[
      ["Student ID",r.id],["Name",r.name],["Roll Number",r.roll],
      ["Class",r.className],["Section",r.section],["Date of Birth",shortDate(r.dob)],
      ["Admission Date",shortDate(r.admissionDate)],["Parent / Guardian",r.parent],
      ["Phone",r.phone],["Email",r.email],["Address",r.address],
      ["Emergency Contact",r.emergency],["Assigned Fees",money(r.totalFee)],
      ["Total Paid",money(totalPaid(r.id))],["Outstanding Balance",money(balance(r))],
      ["Fee Status",feeStatus(r)],["Notes",r.notes]
    ];
  } else if(type==="teachers") {
    pairs=[["Teacher ID",r.id],["Name",r.name],["Subject",r.subject],
      ["Assigned Class",r.className],["Phone",r.phone],["Email",r.email],
      ["Qualification",r.qualification],["Joining Date",shortDate(r.joinDate)],
      ["Monthly Salary",money(r.salary)],["Address",r.address]];
  } else return;
  $("#modalRoot").innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)closeModal()">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-head"><h2>${esc(type==="students"?"Student Profile":"Teacher Profile")}</h2>
      <button class="icon-btn" onclick="closeModal()"><i data-lucide="x"></i></button></div>
      <div class="modal-content"><div class="detail-list">${pairs.map(([k,v])=>`<div class="detail-item"><span>${esc(k)}</span><strong>${esc(v||"—")}</strong></div>`).join("")}</div>
      <div class="modal-foot"><button class="btn" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="closeModal();editRecord('${type}','${id}')"><i data-lucide="pencil"></i> Edit</button></div></div>
    </div></div>`;
  refreshIcons();
}
function deleteRecord(type,id) {
  const key=type;
  const r=getRecord(type,id);
  if(!r) return notify("Record not found.");
  let message="Delete this record? This cannot be undone.";
  if(type==="students") message=`Delete ${r.name} and all of this student's linked payments, attendance and exam results?`;
  if(type==="payments") message=`Delete this payment of ${money(r.amount)} for ${studentName(r.studentId)}?`;
  if(!confirm(message)) return;

  if(type==="students") {
    db.students=db.students.filter(x=>x.id!==id);
    db.payments=db.payments.filter(x=>x.studentId!==id);
    db.attendance=db.attendance.filter(x=>x.studentId!==id);
    db.exams=db.exams.filter(x=>x.studentId!==id);
  } else {
    db[key]=db[key].filter(x=>x.id!==id);
  }
  if(saveDB()) {render();notify("Record deleted.");}
}

/* ------------------ SETTINGS / BACKUP ------------------ */

function editSchool() {
  const name=prompt("Enter your school name:",db.school);
  if(name===null) return;
  if(!name.trim()) return notify("School name cannot be empty.");
  db.school=name.trim();
  if(saveDB()) {
    $("#schoolLabel").textContent=db.school;
    notify("School name updated.");
  }
}
function exportData() {
  const content=JSON.stringify({...db,backupCreatedAt:new Date().toISOString()},null,2);
  const blob=new Blob([content],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download="edumanage-backup-"+today()+".json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  notify("Backup export started.");
}
function importData(event) {
  const file=event.target.files?.[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{
    try {
      const incoming=JSON.parse(reader.result);
      const keys=["students","teachers","payments","attendance","exams"];
      if(!incoming||typeof incoming!=="object"||!keys.every(k=>Array.isArray(incoming[k])))
        throw new Error("Invalid backup format");
      if(!confirm("Restore this backup? It will replace the current records in this browser.")) {
        event.target.value="";
        return;
      }
      const clean=blankDB();
      clean.school=typeof incoming.school==="string"?incoming.school:"My School";
      keys.forEach(k=>clean[k]=incoming[k]);
      // Basic record validation before replacing local data.
      if(clean.students.some(s=>!s.id||!s.name) ||
         clean.teachers.some(t=>!t.id||!t.name) ||
         clean.payments.some(p=>!p.id||!p.studentId||!Number.isFinite(Number(p.amount))||Number(p.amount)<=0) ||
         clean.attendance.some(a=>!a.id||!a.studentId||!a.date||!["Present","Absent","Late"].includes(a.status)) ||
         clean.exams.some(e=>!e.id||!e.studentId||!Number.isFinite(Number(e.marks))||!Number.isFinite(Number(e.maxMarks))||Number(e.maxMarks)<=0||Number(e.marks)<0||Number(e.marks)>Number(e.maxMarks)))
        throw new Error("Backup contains invalid records");
      const oldDB=db;
      db=clean;
      if(saveDB()) {
        $("#schoolLabel").textContent=db.school;
        render();
        notify("Backup restored successfully.");
      } else {
        db=oldDB;
      }
    } catch(error) {
      console.error(error);
      notify("Could not restore this backup. Check the file format.");
    }
    event.target.value="";
  };
  reader.onerror=()=>notify("Could not read the selected file.");
  reader.readAsText(file);
}

/* ------------------ STARTUP ------------------ */

document.addEventListener("click",event=>{
  const nav=event.target.closest("[data-page]");
  if(nav) navigate(nav.dataset.page);
});
$("#todayDate").textContent=new Date().toLocaleDateString("en-IN",{
  weekday:"short",day:"2-digit",month:"short",year:"numeric"
});
$("#schoolLabel").textContent=db.school;
render();
