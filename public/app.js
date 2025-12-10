// public/app.js

let authToken = null;
let currentUser = null;
let basicUsers = [];
let leaves = [];
let departments = [];
let currentLang = "el";

const i18n = {
  el: {
    appTitle: "Portal Αδειών",
    loginSubtitle: "Σύνδεση με τηλέφωνο και κωδικό",
    labelPhone: "Τηλέφωνο",
    labelPassword: "Κωδικός",
    btnLogin: "Σύνδεση",
    btnLogout: "Αποσύνδεση",

    changePwdTitle: "Αλλαγή αρχικού κωδικού",
    changePwdSubtitle:
      "Για λόγους ασφαλείας, παρακαλώ αλλάξτε τον αρχικό κωδικό πρόσβασης.",
    labelOldPassword: "Τρέχων κωδικός",
    labelNewPassword: "Νέος κωδικός",
    labelNewPasswordConfirm: "Επιβεβαίωση νέου κωδικού",
    btnChangePassword: "Αλλαγή κωδικού",

    navCalendar: "Ημερολόγιο & αιτήσεις μου",
    navMyLeaves: "Οι αιτήσεις μου",
    navStaff: "Διαχείριση προσωπικού",
    navAdminLeaves: "Αιτήσεις προσωπικού",

    calendarTitle: "Ημερολόγιο & αιτήσεις μου",
    dayInfoTitle: "Πληροφορίες ημέρας",
    dayInfoHint: "Πάτησε σε ένα όνομα στο ημερολόγιο για λεπτομέρειες.",

    myLeavesTitle: "Οι αιτήσεις μου",
    labelKind: "Τύπος εγγραφής",
    optionLeave: "Άδεια",
    optionRepo: "Ρεπό",
    labelFrom: "Από",
    labelTo: "Έως",
    labelLeaveType: "Τύπος άδειας",
    optionAnnual: "Κανονική",
    optionSick: "Ασθενείας",
    optionOther: "Άλλη",
    btnNewRequest: "Νέα αίτηση",
    myLeavesHistory: "Οι αιτήσεις μου",

    thKind: "Είδος",
    thFrom: "Από",
    thTo: "Έως",
    thDays: "Ημέρες",
    thType: "Τύπος",
    thStatus: "Κατάσταση",
    thActions: "Ενέργειες",

    staffTitle: "Διαχείριση προσωπικού",
    staffListTitle: "Λίστα προσωπικού",
    labelStaffSearch: "Αναζήτηση",
    thFirstName: "Όνομα",
    thLastName: "Επώνυμο",
    thPhone: "Τηλέφωνο",
    thEmail: "Email",
    thRole: "Ρόλος",
    thAnnualDays: "Ημέρες άδειας",
    thDepartment: "Τμήμα",
    thStaffActions: "Ενέργειες",

    newStaffTitle: "Νέο μέλος",
    labelFirstName: "Όνομα",
    labelLastName: "Επώνυμο",
    labelRole: "Ρόλος",
    labelAnnualDays: "Ημέρες άδειας",
    labelDepartment: "Τμήμα",
    labelEmail: "Email",
    optionUser: "User",
    optionAdmin: "Admin",
    optionNoDepartment: "Χωρίς τμήμα",
    btnAddStaff: "Προσθήκη",

    departmentsTitle: "Διαχείριση τμημάτων",
    labelDeptName: "Όνομα τμήματος",
    labelDeptColor: "Χρώμα",
    btnAddDept: "Προσθήκη τμήματος",
    thDeptName: "Τμήμα",
    thDeptColor: "Χρώμα",
    thDeptActions: "Ενέργειες",

    staffHistoryTitle: "Ιστορικό αδειών",
    btnCloseHistory: "Κλείσιμο",

    adminLeavesTitle: "Αιτήσεις προσωπικού",
    navProfile: "Το προφίλ μου",
    profileTitle: "Τα στοιχεία μου",
    btnSaveProfile: "Αποθήκευση",
    msgProfileSaved: "Τα στοιχεία ενημερώθηκαν με επιτυχία.",
    msgProfileError: "Προέκυψε σφάλμα. Προσπαθήστε ξανά.",
    adminLeavesListTitle: "Λίστα αιτήσεων",
    labelStatusFilter: "Φίλτρο κατάστασης",
    optionAllStatuses: "Όλες",
    optionPending: "Σε αναμονή",
    optionApproved: "Εγκεκριμένες",
    optionRejected: "Απορριφθείσες",
    labelEmployeeFilter: "Φίλτρο εργαζόμενου",
    optionAllEmployees: "Όλοι",
    labelKindFilter: "Φίλτρο είδους",
    optionAllKinds: "Όλα",
    optionLeaveFilter: "Άδειες",
    optionRepoFilter: "Ρεπό",
    thEmployee: "Εργαζόμενος",
    editRequestTitle: "Επεξεργασία αίτησης",
    labelStatus: "Κατάσταση",
    btnSave: "Αποθήκευση"
  },
  en: {
    appTitle: "Leave Portal",
    loginSubtitle: "Login with phone and password",
    labelPhone: "Phone",
    labelPassword: "Password",
    btnLogin: "Login",
    btnLogout: "Logout",

    changePwdTitle: "Change initial password",
    changePwdSubtitle:
      "For security reasons, please change your initial password.",
    labelOldPassword: "Current password",
    labelNewPassword: "New password",
    labelNewPasswordConfirm: "Confirm new password",
    btnChangePassword: "Change password",

    navCalendar: "Calendar & my requests",
    navMyLeaves: "My requests",
    navStaff: "Staff management",
    navAdminLeaves: "Staff requests",

    calendarTitle: "Calendar & my requests",
    dayInfoTitle: "Day details",
    dayInfoHint: "Click on a name in the calendar for details.",

    myLeavesTitle: "My requests",
    labelKind: "Entry type",
    optionLeave: "Leave",
    optionRepo: "Day off",
    labelFrom: "From",
    labelTo: "To",
    labelLeaveType: "Leave type",
    optionAnnual: "Annual",
    optionSick: "Sick",
    optionOther: "Other",
    btnNewRequest: "New request",
    myLeavesHistory: "My requests",

    thKind: "Kind",
    thFrom: "From",
    thTo: "To",
    thDays: "Days",
    thType: "Type",
    thStatus: "Status",
    thActions: "Actions",

    staffTitle: "Staff management",
    staffListTitle: "Staff list",
    labelStaffSearch: "Search",
    thFirstName: "First name",
    thLastName: "Last name",
    thPhone: "Phone",
    thEmail: "Email",
    thRole: "Role",
    thAnnualDays: "Leave days",
    thDepartment: "Department",
    thStaffActions: "Actions",

    newStaffTitle: "New staff",
    labelFirstName: "First name",
    labelLastName: "Last name",
    labelRole: "Role",
    labelAnnualDays: "Leave days",
    labelDepartment: "Department",
    labelEmail: "Email",
    optionUser: "User",
    optionAdmin: "Admin",
    optionNoDepartment: "No department",
    btnAddStaff: "Add",

    departmentsTitle: "Departments management",
    labelDeptName: "Department name",
    labelDeptColor: "Color",
    btnAddDept: "Add department",
    thDeptName: "Department",
    thDeptColor: "Color",
    thDeptActions: "Actions",

    staffHistoryTitle: "Leave history",
    btnCloseHistory: "Close",

    adminLeavesTitle: "Staff requests",
    adminLeavesListTitle: "Requests list",
    labelStatusFilter: "Status filter",
    optionAllStatuses: "All",
    optionPending: "Pending",
    optionApproved: "Approved",
    optionRejected: "Rejected",
    labelEmployeeFilter: "Employee filter",
    optionAllEmployees: "All",
    labelKindFilter: "Kind filter",
    optionAllKinds: "All",
    optionLeaveFilter: "Leaves",
    optionRepoFilter: "Days off",
    thEmployee: "Employee",
    editRequestTitle: "Edit request",
    labelStatus: "Status",
    btnSave: "Save"
  }
};

function applyTranslations() {
  document.documentElement.lang = currentLang;
  const dict = i18n[currentLang] || i18n.el;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    const text = dict[key];
    if (text !== undefined) {
      el.textContent = text;
    }
  });
  document.title = dict.appTitle || "Portal Αδειών";
  localStorage.setItem("leavePortalLang", currentLang);
}

function parseDate(str) {
  return new Date(str + "T00:00:00");
}
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function countDaysInclusiveLocal(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (end < start) return 0;
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}
function getMonthName(monthIndex, lang) {
  if (lang === "en") {
    const names = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return names[monthIndex] || "";
  }
  const namesEl = [
    "Ιανουάριος",
    "Φεβρουάριος",
    "Μάρτιος",
    "Απρίλιος",
    "Μάιος",
    "Ιούνιος",
    "Ιούλιος",
    "Αύγουστος",
    "Σεπτέμβριος",
    "Οκτώβριος",
    "Νοέμβριος",
    "Δεκέμβριος"
  ];
  return namesEl[monthIndex] || "";
}

function getStatusLabel(status) {
  if (currentLang === "el") {
    if (status === "pending") return "Σε αναμονή";
    if (status === "approved") return "Εγκεκριμένη";
    if (status === "rejected") return "Απορριφθείσα";
    return status || "";
  } else {
    if (status === "pending") return "Pending";
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return status || "";
  }
}

function getTypeLabel(type, kind) {
  if (kind === "repo" || type === "repo") {
    return currentLang === "en" ? "Day off" : "Ρεπό";
  }
  if (currentLang === "el") {
    if (type === "annual") return "Κανονική";
    if (type === "sick") return "Ασθενείας";
    if (type === "other") return "Άλλη";
    return type || "";
  } else {
    if (type === "annual") return "Annual";
    if (type === "sick") return "Sick";
    if (type === "other") return "Other";
    return type || "";
  }
}

const greekHolidayCache = {};

function orthodoxEasterSunday(year) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;

  const julian = new Date(Date.UTC(year, month - 1, day));
  julian.setUTCDate(julian.getUTCDate() + 13);

  return new Date(
    julian.getUTCFullYear(),
    julian.getUTCMonth(),
    julian.getUTCDate()
  );
}

function getGreekHolidaysForYear(year) {
  if (greekHolidayCache[year]) return greekHolidayCache[year];

  const holidays = {};

  function add(dateObj, label) {
    const str = formatDate(dateObj);
    holidays[str] = label;
  }
  function d(m, day) {
    return new Date(year, m, day);
  }

  const easter = orthodoxEasterSunday(year);

  const cleanMonday = new Date(easter);
  cleanMonday.setDate(easter.getDate() - 48);

  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);

  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);

  const holySpiritMonday = new Date(easter);
  holySpiritMonday.setDate(easter.getDate() + 50);

  add(d(0, 1), "Πρωτοχρονιά");
  add(d(0, 6), "Θεοφάνεια");
  add(cleanMonday, "Καθαρά Δευτέρα");
  add(d(2, 25), "25η Μαρτίου");
  add(goodFriday, "Μεγάλη Παρασκευή");
  add(easter, "Κυριακή του Πάσχα");
  add(easterMonday, "Δευτέρα του Πάσχα");
  add(d(4, 1), "Πρωτομαγιά");
  add(holySpiritMonday, "Δευτέρα Αγίου Πνεύματος");
  add(d(7, 15), "Κοίμηση Θεοτόκου");
  add(d(9, 28), "28η Οκτωβρίου");
  add(d(11, 25), "Χριστούγεννα");
  add(d(11, 26), "Σύναξη Υπεραγίας Θεοτόκου");

  greekHolidayCache[year] = holidays;
  return holidays;
}

document.addEventListener("DOMContentLoaded", () => {
  const loginView = document.getElementById("loginView");
  const passwordChangeView = document.getElementById("passwordChangeView");
  const mainView = document.getElementById("mainView");

  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const phoneInput = document.getElementById("phoneInput");
  const passwordInput = document.getElementById("passwordInput");

  const passwordChangeForm = document.getElementById("passwordChangeForm");
  const oldPasswordInput = document.getElementById("oldPasswordInput");
  const newPasswordInput = document.getElementById("newPasswordInput");
  const newPasswordConfirmInput = document.getElementById(
    "newPasswordConfirmInput"
  );
  const passwordChangeError = document.getElementById("passwordChangeError");

  const currentUserInfo = document.getElementById("currentUserInfo");
  const logoutButton = document.getElementById("logoutButton");

  const navButtons = document.querySelectorAll(".nav-button");
  const sections = document.querySelectorAll(".section");

  const calendarContainer = document.getElementById("calendarContainer");
  const infoPanelContent = document.getElementById("infoPanelContent");

  const myLeavesTableBody = document.querySelector("#myLeavesTable tbody");
  const newLeaveForm = document.getElementById("newLeaveForm");
  const myKind = document.getElementById("myKind");
  const myStartDate = document.getElementById("myStartDate");
  const myEndDate = document.getElementById("myEndDate");
  const myType = document.getElementById("myType");
  const myNewLeaveCard = document.getElementById("myNewLeaveCard");
  const profileForm = document.getElementById("profileForm");
  const profileFirstName = document.getElementById("profileFirstName");
  const profileLastName = document.getElementById("profileLastName");
  const profilePhone = document.getElementById("profilePhone");
  const profileEmail = document.getElementById("profileEmail");
  const profileSaveButton = document.getElementById("profileSaveButton");
  const profileMessage = document.getElementById("profileMessage");

  const staffTableBody = document.querySelector("#staffTable tbody");
  const staffSearch = document.getElementById("staffSearch");
  const newStaffForm = document.getElementById("newStaffForm");
  const newFirstName = document.getElementById("newFirstName");
  const newLastName = document.getElementById("newLastName");
  const newPhone = document.getElementById("newPhone");
  const newEmail = document.getElementById("newEmail");
  const newPassword = document.getElementById("newPassword");
  const newRole = document.getElementById("newRole");
  const newAnnualDays = document.getElementById("newAnnualDays");
  const newDepartmentSelect = document.getElementById("newDepartmentSelect");

  const adminStatusFilter = document.getElementById("adminStatusFilter");
  const adminEmployeeFilter =
    document.getElementById("adminEmployeeFilter");
  const adminKindFilter = document.getElementById("adminKindFilter");
  const adminLeavesTableBody = document.querySelector(
    "#adminLeavesTable tbody"
  );
  const adminEditCard = document.getElementById("adminEditCard");
  const adminEditForm = document.getElementById("adminEditForm");
  const editLeaveId = document.getElementById("editLeaveId");
  const editKind = document.getElementById("editKind");
  const editStartDate = document.getElementById("editStartDate");
  const editEndDate = document.getElementById("editEndDate");
  const editStatus = document.getElementById("editStatus");
  const editType = document.getElementById("editType");

  const staffHistoryCard = document.getElementById("staffHistoryCard");
  const staffHistoryHeader = document.getElementById("staffHistoryHeader");
  const staffHistoryTableBody = document.querySelector(
    "#staffHistoryTable tbody"
  );
  const staffHistorySummary = document.getElementById("staffHistorySummary");
  const closeStaffHistoryBtn = document.getElementById("closeStaffHistoryBtn");

  const departmentsTableBody = document.querySelector(
    "#departmentsTable tbody"
  );
  const newDeptForm = document.getElementById("newDeptForm");
  const newDeptName = document.getElementById("newDeptName");
  const newDeptColor = document.getElementById("newDeptColor");

  const langElBtn = document.getElementById("langEl");
  const langEnBtn = document.getElementById("langEn");
  const langElMainBtn = document.getElementById("langElMain");
  const langEnMainBtn = document.getElementById("langEnMain");

  let calendarStartMonth = null;
  let calendarMonthsToRender = 6;

  function setAuth(token, user) {
    authToken = token;
    currentUser = user;
    if (token && user) {
      localStorage.setItem(
        "leavePortalAuth",
        JSON.stringify({ token, user })
      );
    } else {
      localStorage.removeItem("leavePortalAuth");
    }
  }

  async function apiFetch(url, options = {}) {
    const opts = {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json"
      }
    };

    if (authToken) {
      opts.headers["Authorization"] = "Bearer " + authToken;
    }

    const res = await fetch(url, opts);
    if (!res.ok) {
      if (res.status === 401) {
        setAuth(null, null);
        showLoginView();
      }
      let msg = "Σφάλμα";
      try {
        const data = await res.json();
        if (data && data.error) msg = data.error;
      } catch (e) {}
      throw new Error(msg);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  function showLoginView() {
    loginView.classList.remove("hidden");
    passwordChangeView.classList.add("hidden");
    mainView.classList.add("hidden");
  }

  function showPasswordChangeView() {
    loginView.classList.add("hidden");
    passwordChangeView.classList.remove("hidden");
    mainView.classList.add("hidden");
  }


  function fillProfileForm() {
    if (!currentUser) return;
    profileFirstName.value = currentUser.firstName || "";
    profileLastName.value = currentUser.lastName || "";
    profilePhone.value = currentUser.phone || "";
    profileEmail.value = currentUser.email || "";
    profileMessage.textContent = "";
  }

  async function saveProfile() {
    if (!currentUser) return;
    profileMessage.textContent = "";
    try {
      const body = {
        firstName: profileFirstName.value.trim(),
        lastName: profileLastName.value.trim(),
        phone: profilePhone.value.trim(),
        email: profileEmail.value.trim() || null
      };
      const updated = await apiFetch("/api/me", {
        method: "PUT",
        body: JSON.stringify(body)
      });
      currentUser = {
        ...currentUser,
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
        email: updated.email
      };
      currentUserInfo.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
      profileMessage.textContent = i18n[currentLang].msgProfileSaved;
      profileMessage.classList.remove("error");
    } catch (err) {
      profileMessage.textContent = err.message || i18n[currentLang].msgProfileError;
      profileMessage.classList.add("error");
    }
  }

  function showMainView() {
    loginView.classList.add("hidden");
    passwordChangeView.classList.add("hidden");
    mainView.classList.remove("hidden");
    currentUserInfo.textContent = `${currentUser.firstName} ${currentUser.lastName}`;

    const adminOnlyButtons = document.querySelectorAll(".admin-only");
    adminOnlyButtons.forEach((btn) => {
      btn.style.display = currentUser.role === "admin" ? "block" : "none";
    });

    const userOnlyButtons = document.querySelectorAll(".user-only");
    userOnlyButtons.forEach((btn) => {
      btn.style.display = currentUser.role === "user" ? "block" : "none";
    });

    // Ο admin δεν έχει φόρμα "Νέα αίτηση" πάνω από το ημερολόγιο
    if (currentUser.role === "admin") {
      if (myNewLeaveCard) myNewLeaveCard.style.display = "none";
    } else {
      if (myNewLeaveCard) myNewLeaveCard.style.display = "block";
    }
  }

  function initCalendarState() {
    const now = new Date();
    calendarStartMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    calendarMonthsToRender = 6;
  }

  const savedLang = localStorage.getItem("leavePortalLang");
  if (savedLang && (savedLang === "el" || savedLang === "en")) {
    currentLang = savedLang;
  }
  applyTranslations();

  function refreshAllTexts() {
    applyTranslations();
    renderCalendar();
    if (currentUser) {
      renderMyLeavesTable();
      if (currentUser.role === "admin") {
        renderAdminLeavesTable();
        loadStaffForAdmin();
        populateAdminEmployeeFilter();
        renderDepartmentsUI();
        populateDepartmentSelect();
      }
    }
  }

  langElBtn.addEventListener("click", () => {
    currentLang = "el";
    refreshAllTexts();
  });
  langEnBtn.addEventListener("click", () => {
    currentLang = "en";
    refreshAllTexts();
  });
  langElMainBtn.addEventListener("click", () => {
    currentLang = "el";
    refreshAllTexts();
  });
  langEnMainBtn.addEventListener("click", () => {
    currentLang = "en";
    refreshAllTexts();
  });

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const sectionId = btn.getAttribute("data-section");
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      sections.forEach((sec) => {
        if (sec.id === sectionId) {
          sec.classList.remove("hidden");
          sec.classList.add("visible");
        } else {
          sec.classList.add("hidden");
          sec.classList.remove("visible");
        }
      });

      if (sectionId === "calendarSection") {
        renderCalendar();
      }
      if (sectionId === "myLeavesSection" && currentUser.role === "user") {
        renderMyLeavesTable();
      }
      if (sectionId === "profileSection") {
        fillProfileForm();
      }
      if (sectionId === "adminStaffSection" && currentUser.role === "admin") {
        loadStaffForAdmin();
        renderDepartmentsUI();
        populateDepartmentSelect();
      }
      if (sectionId === "adminLeavesSection" && currentUser.role === "admin") {
        populateAdminEmployeeFilter();
        renderAdminLeavesTable();
      }
    });
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";
    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();
    if (!phone || !password) return;

    try {
      const data = await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ phone, password })
      });
      setAuth(data.token, data.user);
      if (data.user.mustChangePassword) {
        showPasswordChangeView();
      } else {
        await loadInitialData();
        showMainView();
      }
    } catch (err) {
      loginError.textContent = err.message || "Σφάλμα σύνδεσης";
    }
  });

  passwordChangeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    passwordChangeError.textContent = "";

    const oldPwd = oldPasswordInput.value.trim();
    const newPwd = newPasswordInput.value.trim();
    const newPwd2 = newPasswordConfirmInput.value.trim();

    if (!oldPwd || !newPwd || !newPwd2) return;

    if (newPwd !== newPwd2) {
      passwordChangeError.textContent =
        currentLang === "en"
          ? "New passwords do not match."
          : "Ο νέος κωδικός και η επιβεβαίωση δεν ταιριάζουν.";
      return;
    }

    try {
      const data = await apiFetch("/api/change-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd })
      });
      currentUser = data.user;
      setAuth(authToken, currentUser);
      oldPasswordInput.value = "";
      newPasswordInput.value = "";
      newPasswordConfirmInput.value = "";
      await loadInitialData();
      showMainView();
    } catch (err) {
      passwordChangeError.textContent =
        err.message || "Σφάλμα αλλαγής κωδικού";
    }
  });

  logoutButton.addEventListener("click", async () => {
    try {
      await apiFetch("/api/logout", { method: "POST" });
    } catch (err) {}
    setAuth(null, null);
    showLoginView();
  });

  async function loadDepartments() {
    if (!currentUser || currentUser.role !== "admin") {
      departments = [];
      return;
    }
    try {
      const data = await apiFetch("/api/departments");
      departments = data || [];
      renderDepartmentsUI();
      populateDepartmentSelect();
    } catch (err) {
      departments = [];
    }
  }

  async function loadInitialData() {
    basicUsers = await apiFetch("/api/users/basic");
    leaves = await apiFetch("/api/leaves");
    initCalendarState();
    renderCalendar();
    if (currentUser.role === "admin") {
      await loadDepartments();
      await loadStaffForAdmin();
      populateAdminEmployeeFilter();
      renderAdminLeavesTable();
    } else {
      renderMyLeavesTable();
    }
  }

  async function reloadLeaves() {
    leaves = await apiFetch("/api/leaves");
  }

  function findUserById(id) {
    return basicUsers.find((u) => u.id === id);
  }

  function buildLeavesByDateForCurrentView() {
    const map = {};
    if (!currentUser) return map;

    const isAdmin = currentUser.role === "admin";

    leaves.forEach((leave) => {
      if (isAdmin) {
        const start = parseDate(leave.startDate);
        const end = parseDate(leave.endDate);
        for (
          let d = new Date(start.getTime());
          d <= end;
          d.setDate(d.getDate() + 1)
        ) {
          const key = formatDate(d);
          if (!map[key]) map[key] = [];
          map[key].push(leave);
        }
        return;
      }

      const isOwner = leave.userId === currentUser.id;

      if (isOwner) {
        const start = parseDate(leave.startDate);
        const end = parseDate(leave.endDate);
        for (
          let d = new Date(start.getTime());
          d <= end;
          d.setDate(d.getDate() + 1)
        ) {
          const key = formatDate(d);
          if (!map[key]) map[key] = [];
          map[key].push(leave);
        }
        return;
      }

      if (leave.kind === "leave" && leave.status === "approved") {
        const start = parseDate(leave.startDate);
        const end = parseDate(leave.endDate);
        for (
          let d = new Date(start.getTime());
          d <= end;
          d.setDate(d.getDate() + 1)
        ) {
          const key = formatDate(d);
          if (!map[key]) map[key] = [];
          map[key].push(leave);
        }
      }
    });

    return map;
  }

  function renderCalendar() {
    if (!calendarStartMonth) {
      initCalendarState();
    }
    const leavesByDate = buildLeavesByDateForCurrentView();
    calendarContainer.innerHTML = "";

    const weekdaysEl = ["Δ", "Τ", "Τ", "Π", "Π", "Σ", "Κ"];
    const weekdaysEn = ["M", "T", "W", "T", "F", "S", "S"];
    const weekdays = currentLang === "en" ? weekdaysEn : weekdaysEl;

    for (let i = 0; i < calendarMonthsToRender; i++) {
      const monthDate = new Date(
        calendarStartMonth.getFullYear(),
        calendarStartMonth.getMonth() + i,
        1
      );
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const monthName = getMonthName(month, currentLang);
      const holidaysMap = getGreekHolidaysForYear(year);

      const monthDiv = document.createElement("div");
      monthDiv.className = "month";

      const header = document.createElement("div");
      header.className = "month-header";
      header.textContent = `${monthName} ${year}`;
      monthDiv.appendChild(header);

      const grid = document.createElement("div");
      grid.className = "month-grid";

      weekdays.forEach((w) => {
        const wd = document.createElement("div");
        wd.className = "weekday-cell";
        wd.textContent = w;
        grid.appendChild(wd);
      });

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const firstWeekday = (firstDay.getDay() + 6) % 7;

      for (let j = 0; j < firstWeekday; j++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "day-cell empty";
        grid.appendChild(emptyCell);
      }

      for (let d = 1; d <= lastDay.getDate(); d++) {
        const cellDate = new Date(year, month, d);
        const dateStr = formatDate(cellDate);

        const cell = document.createElement("div");
        cell.className = "day-cell";
        cell.dataset.date = dateStr;

        const leavesContainerDiv = document.createElement("div");
        leavesContainerDiv.className = "day-leaves";

        const dayLeaves = leavesByDate[dateStr] || [];

        const holidayName = holidaysMap[dateStr];
        if (holidayName) {
          cell.classList.add("holiday-day");
          const holidayLabel = document.createElement("div");
          holidayLabel.className = "holiday-label";
          holidayLabel.textContent = holidayName;
          cell.appendChild(holidayLabel);
        }

        const dayNumber = document.createElement("div");
        dayNumber.className = "day-number";
        dayNumber.textContent = d;
        cell.appendChild(dayNumber);

        dayLeaves.forEach((leave) => {
          const user = findUserById(leave.userId);
          if (!user) return;

          const badge = document.createElement("button");
          badge.type = "button";
          badge.classList.add("day-leave-badge");
          badge.dataset.userId = leave.userId;
          badge.dataset.date = dateStr;
          badge.dataset.leaveId = leave.id;

          if (leave.kind === "repo") {
            badge.classList.add("badge-repo");
          } else {
            if (leave.status === "approved") {
              badge.classList.add("badge-leave-approved");
            } else if (leave.status === "pending") {
              badge.classList.add("badge-leave-pending");
            } else {
              badge.classList.add("badge-leave-other");
            }
          }

          // Χρώμα τμήματος με βάση το τμήμα (departmentColor)
          if (user.departmentColor) {
            // background και border στο χρώμα του τμήματος
            badge.style.backgroundColor = user.departmentColor;
            badge.style.borderLeft = `4px solid ${user.departmentColor}`;
            badge.style.color = "#f9fafb";
            badge.style.paddingLeft = "4px";
          }

          let label = user.lastName;
          if (leave.kind === "repo") {
            label += currentLang === "en" ? " (Off)" : " (Ρεπό)";
          }
          if (leave.status === "pending" && leave.userId === currentUser.id) {
            label += currentLang === "en" ? " [P]" : " [Α]";
          }
          badge.textContent = label;

          leavesContainerDiv.appendChild(badge);
        });

        cell.appendChild(leavesContainerDiv);
        grid.appendChild(cell);
      }

      monthDiv.appendChild(grid);
      calendarContainer.appendChild(monthDiv);
    }
  }

  calendarContainer.addEventListener("scroll", () => {
    if (!calendarStartMonth) return;

    const nearBottom =
      calendarContainer.scrollTop + calendarContainer.clientHeight >
      calendarContainer.scrollHeight - 200;

    const nearTop = calendarContainer.scrollTop < 150;

    if (nearBottom) {
      calendarMonthsToRender += 1;
      renderCalendar();
    }

    if (nearTop && currentUser && currentUser.role === "admin") {
      const prevHeight = calendarContainer.scrollHeight;
      calendarStartMonth = new Date(
        calendarStartMonth.getFullYear(),
        calendarStartMonth.getMonth() - 1,
        1
      );
      calendarMonthsToRender += 1;
      renderCalendar();
      const newHeight = calendarContainer.scrollHeight;
      calendarContainer.scrollTop += newHeight - prevHeight;
    }
  });

  calendarContainer.addEventListener("click", (e) => {
    const target = e.target;
    if (!target.classList.contains("day-leave-badge")) return;
    const dateStr = target.dataset.date;
    const leaveId = parseInt(target.dataset.leaveId, 10);
    showDayDetails(dateStr, leaveId);
  });

  function showDayDetails(dateStr, leaveId) {
    const leave = leaves.find((l) => l.id === leaveId);
    if (!leave) {
      infoPanelContent.textContent =
        currentLang === "en" ? "Request not found." : "Η αίτηση δεν βρέθηκε.";
      return;
    }
    const user = findUserById(leave.userId);
    const dict = i18n[currentLang] || i18n.el;

    const typeLabel = getTypeLabel(leave.type, leave.kind);
    const statusLabel = getStatusLabel(leave.status);

    let html = "";
    html += `<p><strong>${user ? user.firstName + " " + user.lastName : "—"}</strong></p>`;
    if (user && user.departmentName) {
      html += `<p>${currentLang === "en" ? "Department" : "Τμήμα"}: <strong>${user.departmentName}</strong></p>`;
    }
    html += `<p>${dict.labelFrom || "From"}: <strong>${leave.startDate}</strong></p>`;
    html += `<p>${dict.labelTo || "To"}: <strong>${leave.endDate}</strong></p>`;
    html += `<p>${dict.thKind || "Kind"}: <strong>${
      leave.kind === "repo"
        ? dict.optionRepo || "Ρεπό"
        : dict.optionLeave || "Άδεια"
    }</strong></p>`;
    html += `<p>${dict.thType || "Type"}: <strong>${typeLabel}</strong></p>`;
    html += `<p>${dict.thStatus || "Status"}: <strong>${statusLabel}</strong></p>`;
    html += `<p>${dict.thDays || "Days"}: <strong>${countDaysInclusiveLocal(
      leave.startDate,
      leave.endDate
    )}</strong></p>`;

    infoPanelContent.innerHTML = html;
  }

  function renderMyLeavesTable() {
    if (!currentUser || !myLeavesTableBody) return;
    const my = leaves.filter((l) => l.userId === currentUser.id && l.status === "pending");
    myLeavesTableBody.innerHTML = "";

    my.forEach((l) => {
      const tr = document.createElement("tr");
      const kindLabel =
        l.kind === "repo"
          ? i18n[currentLang].optionRepo || "Ρεπό"
          : i18n[currentLang].optionLeave || "Άδεια";
      const typeLabel = getTypeLabel(l.type, l.kind);
      const statusLabel = getStatusLabel(l.status);

      const canEdit = l.status === "pending";

      tr.innerHTML = `
        <td>${kindLabel}</td>
        <td>${l.startDate}</td>
        <td>${l.endDate}</td>
        <td>${typeLabel}</td>
        <td>${statusLabel}</td>
        <td>
          ${
            canEdit
              ? `<button type="button" class="my-edit-leave-btn" data-id="${l.id}">${
                  currentLang === "en" ? "Edit" : "Επεξεργασία"
                }</button>
                 <button type="button" class="my-delete-leave-btn" data-id="${l.id}">${
                   currentLang === "en" ? "Delete" : "Διαγραφή"
                 }</button>`
              : ""
          }
        </td>
      `;
      myLeavesTableBody.appendChild(tr);
    });
  }

  myKind.addEventListener("change", () => {
    if (myKind.value === "repo") {
      myEndDate.value = myStartDate.value;
      myEndDate.disabled = true;
    } else {
      myEndDate.disabled = false;
    }
  });

  myStartDate.addEventListener("change", () => {
    if (myKind.value === "repo") {
      myEndDate.value = myStartDate.value;
    }
  });

  newLeaveForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const kind = myKind.value;
    const startDate = myStartDate.value;
    const endDate = myEndDate.value;
    const type = myType.value;

    if (!startDate) return;

    try {
      await apiFetch("/api/leaves", {
        method: "POST",
        body: JSON.stringify({ startDate, endDate, kind, type })
      });
      await reloadLeaves();
      renderMyLeavesTable();
      renderCalendar();
      newLeaveForm.reset();
      myKind.value = "leave";
      myType.value = "annual";
      myEndDate.disabled = false;
    } catch (err) {
      alert(err.message || "Σφάλμα δημιουργίας αίτησης");
    }
  });


  if (profileSaveButton) {
    profileSaveButton.addEventListener("click", (e) => {
      e.preventDefault();
      saveProfile();
    });
  }

  if (myLeavesTableBody) {
    myLeavesTableBody.addEventListener("click", async (e) => {
      const btn = e.target;
      const id = btn.dataset.id;
      if (!id) return;

      if (btn.classList.contains("my-edit-leave-btn")) {
        const leave = leaves.find((l) => l.id === Number(id));
        if (!leave) return;

        if (leave.status !== "pending") {
          alert(
            currentLang === "en"
              ? "Only pending requests can be edited."
              : "Μόνο αιτήσεις σε αναμονή μπορούν να τροποποιηθούν."
          );
          return;
        }

        const newStart = prompt(
          currentLang === "en"
            ? "New start date (YYYY-MM-DD)"
            : "Νέα ημερομηνία από (YYYY-MM-DD)",
          leave.startDate
        );
        if (newStart === null) return;
        const newEnd = prompt(
          currentLang === "en"
            ? "New end date (YYYY-MM-DD)"
            : "Νέα ημερομηνία έως (YYYY-MM-DD)",
          leave.endDate
        );
        if (newEnd === null) return;

        let newType = leave.type;
        if (leave.kind === "leave") {
          newType = prompt(
            currentLang === "en"
              ? "Leave type (annual/sick/other)"
              : "Τύπος άδειας (annual/sick/other)",
            leave.type
          );
          if (newType === null || newType.trim() === "") newType = leave.type;
        }

        try {
          await apiFetch(`/api/leaves/${id}`, {
            method: "PUT",
            body: JSON.stringify({
              startDate: newStart,
              endDate: newEnd,
              type: newType,
              kind: leave.kind
            })
          });
          await reloadLeaves();
          renderMyLeavesTable();
          renderCalendar();
        } catch (err) {
          alert(err.message || "Σφάλμα ενημέρωσης αίτησης");
        }
      }

      if (btn.classList.contains("my-delete-leave-btn")) {
        const confirmMsg =
          currentLang === "en"
            ? "Delete this pending request?"
            : "Να διαγραφεί αυτή η αίτηση (σε αναμονή);";
        if (!confirm(confirmMsg)) return;
        try {
          await apiFetch(`/api/leaves/${id}`, {
            method: "DELETE"
          });
          await reloadLeaves();
          renderMyLeavesTable();
          renderCalendar();
        } catch (err) {
          alert(err.message || "Σφάλμα διαγραφής αίτησης");
        }
      }
    });
  }

  async function loadStaffForAdmin() {
    if (!currentUser || currentUser.role !== "admin") return;
    try {
      const staff = await apiFetch("/api/users");
      staffTableBody.innerHTML = "";
      staff.forEach((u) => {
        const tr = document.createElement("tr");
        tr.dataset.userId = u.id;
        tr.dataset.departmentName = u.departmentName || "";
        tr.dataset.departmentColor = u.departmentColor || "";
        const deptName = u.departmentName || "-";
        const deptColor = u.departmentColor || "#9ca3af";

        tr.innerHTML = `
          <td>${u.firstName}</td>
          <td>${u.lastName}</td>
          <td>${u.phone || ""}</td>
          <td>${u.email || ""}</td>
          <td>${u.role}</td>
          <td>${u.annualLeaveDays}</td>
          <td>
            <span class="dept-color-box" style="background-color:${deptColor};"></span>
            ${deptName}
          </td>
          <td class="staff-actions-col">
            <button type="button" class="history-staff-btn">${
              currentLang === "en" ? "History" : "Ιστορικό"
            }</button>
            <button type="button" class="edit-staff-btn">${
              currentLang === "en" ? "Edit" : "Επεξεργασία"
            }</button>
            <button type="button" class="delete-staff-btn">${
              currentLang === "en" ? "Delete" : "Διαγραφή"
            }</button>
          </td>
        `;
        staffTableBody.appendChild(tr);
      });
      applyStaffSearchFilter();
    } catch (err) {
      // ignore
    }
  }


  function deleteStaff(userId) {
    const confirmMsg =
      currentLang === "en"
        ? "Are you sure you want to delete this employee? All their leave requests will also be removed."
        : "Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το μέλος; Όλες οι αιτήσεις άδειά του θα διαγραφούν επίσης.";

    if (!window.confirm(confirmMsg)) {
      return;
    }

    apiFetch(`/api/users/${userId}`, {
      method: "DELETE"
    })
      .then(() => loadStaffForAdmin())
      .then(() => apiFetch("/api/users/basic"))
      .then((basic) => {
        basicUsers = basic;
        renderCalendar();
        populateAdminEmployeeFilter();
      })
      .catch((err) => {
        alert(
          err.message ||
            (currentLang === "en"
              ? "Error deleting user"
              : "Σφάλμα διαγραφής χρήστη")
        );
      });
  }

  staffTableBody.addEventListener("click", (e) => {
    const btn = e.target;
    const tr = btn.closest("tr");
    if (!tr) return;
    const userId = parseInt(tr.dataset.userId, 10);

    if (btn.classList.contains("edit-staff-btn")) {
      openStaffEditDialog(tr, userId);
    } else if (btn.classList.contains("history-staff-btn")) {
      openStaffHistory(userId);
    } else if (btn.classList.contains("delete-staff-btn")) {
      deleteStaff(userId);
    }
  });

  function openStaffEditDialog(tr, userId) {
    const tds = tr.querySelectorAll("td");
    const firstName = tds[0].textContent;
    const lastName = tds[1].textContent;
    const phone = tds[2].textContent;
    const email = tds[3].textContent;
    const role = tds[4].textContent;
    const annualLeaveDays = tds[5].textContent;
    const departmentName = tr.dataset.departmentName || "";
    const departmentColor = tr.dataset.departmentColor || "#9ca3af";

    const newFirst = prompt(
      currentLang === "en" ? "First name" : "Όνομα",
      firstName
    );
    if (newFirst === null) return;
    const newLast = prompt(
      currentLang === "en" ? "Last name" : "Επώνυμο",
      lastName
    );
    if (newLast === null) return;
    const newPhoneVal = prompt(
      currentLang === "en" ? "Phone" : "Τηλέφωνο",
      phone
    );
    if (newPhoneVal === null) return;
    const newEmailVal = prompt(
      currentLang === "en" ? "Email" : "Email",
      email
    );
    if (newEmailVal === null) return;
    const newRoleVal = prompt(
      currentLang === "en" ? "Role (admin/user)" : "Ρόλος (admin/user)",
      role
    );
    if (newRoleVal === null) return;
    const newDays = prompt(
      currentLang === "en" ? "Annual leave days" : "Ημέρες άδειας",
      annualLeaveDays
    );
    if (newDays === null) return;

    const newDeptName = prompt(
      currentLang === "en" ? "Department name" : "Τμήμα",
      departmentName
    );
    if (newDeptName === null) return;

    const newDeptColor = prompt(
      currentLang === "en"
        ? "Department color (hex, e.g. #0ea5e9)"
        : "Χρώμα τμήματος (hex, π.χ. #0ea5e9)",
      departmentColor
    );
    if (newDeptColor === null) return;

    const mustChange = confirm(
      currentLang === "en"
        ? "Force this user to change password at next login?"
        : "Να υποχρεωθεί ο χρήστης να αλλάξει κωδικό στο επόμενο login;"
    );

    const newPasswordVal = prompt(
      currentLang === "en"
        ? "New password (leave empty to keep current)"
        : "Νέος κωδικός (άφησε κενό για να μείνει ο ίδιος)",
      ""
    );

    const payload = {
      firstName: newFirst.trim(),
      lastName: newLast.trim(),
      phone: newPhoneVal.trim(),
      email: newEmailVal.trim() || null,
      role: newRoleVal.trim(),
      annualLeaveDays: Number(newDays),
      mustChangePassword: mustChange,
      departmentName: newDeptName.trim() || null,
      departmentColor: newDeptColor.trim() || null
    };
    if (newPasswordVal.trim() !== "") {
      payload.password = newPasswordVal.trim();
    }

    apiFetch(`/api/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    })
      .then(() => loadStaffForAdmin())
      .then(() => apiFetch("/api/users/basic"))
      .then((basic) => {
        basicUsers = basic;
        renderCalendar();
        populateAdminEmployeeFilter();
      })
      .catch((err) => {
        alert(err.message || "Σφάλμα ενημέρωσης χρήστη");
      });
  }

  async function openStaffHistory(userId) {
    const user = basicUsers.find((u) => u.id === userId);
    if (!user) return;

    staffHistoryHeader.textContent = `${user.firstName} ${user.lastName}`;

    await reloadLeaves();
    const userLeaves = leaves
      .filter((l) => l.userId === userId)
      .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

    staffHistoryTableBody.innerHTML = "";
    let totalAnnual = 0;
    let totalSick = 0;
    let totalOther = 0;
    let totalLeaveDays = 0;
    let totalRepoDays = 0;

    userLeaves.forEach((l) => {
      const tr = document.createElement("tr");
      const days = countDaysInclusiveLocal(l.startDate, l.endDate);
      const kindLabel =
        l.kind === "repo"
          ? i18n[currentLang].optionRepo || "Ρεπό"
          : i18n[currentLang].optionLeave || "Άδεια";
      const typeLabel = getTypeLabel(l.type, l.kind);
      const statusLabel = getStatusLabel(l.status);

      tr.innerHTML = `
        <td>${kindLabel}</td>
        <td>${l.startDate}</td>
        <td>${l.endDate}</td>
        <td>${typeLabel}</td>
        <td>${statusLabel}</td>
      `;
      staffHistoryTableBody.appendChild(tr);

      if (l.status === "approved") {
        if (l.kind === "repo") {
          totalRepoDays += days;
        } else {
          totalLeaveDays += days;
          if (l.type === "annual") totalAnnual += days;
          else if (l.type === "sick") totalSick += days;
          else totalOther += days;
        }
      }
    });

    const summaryText =
      currentLang === "en"
        ? `Summary (approved): Annual leave: ${totalAnnual} days, Sick leave: ${totalSick} days, Other: ${totalOther} days, Total leave days: ${totalLeaveDays}, Days off (repo): ${totalRepoDays}.`
        : `Σύνοψη (εγκεκριμένες): Κανονική άδεια: ${totalAnnual} ημέρες, Ασθενείας: ${totalSick} ημέρες, Άλλη: ${totalOther} ημέρες, Σύνολο ημερών άδειας: ${totalLeaveDays}, Ρεπό: ${totalRepoDays} ημέρες.`;

    staffHistorySummary.textContent = summaryText;
    staffHistoryCard.style.display = "block";
  }

  closeStaffHistoryBtn.addEventListener("click", () => {
    staffHistoryCard.style.display = "none";
    staffHistorySummary.textContent = "";
  });

  function applyStaffSearchFilter() {
    if (!staffSearch) return;
    const term = staffSearch.value.trim().toLowerCase();
    const rows = staffTableBody.querySelectorAll("tr");
    rows.forEach((tr) => {
      const text = tr.textContent.toLowerCase();
      tr.style.display = text.includes(term) ? "" : "none";
    });
  }

  staffSearch.addEventListener("input", () => {
    applyStaffSearchFilter();
  });

  newStaffForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = {
      firstName: newFirstName.value.trim(),
      lastName: newLastName.value.trim(),
      phone: newPhone.value.trim(),
      email: newEmail.value.trim() || null,
      password: newPassword.value.trim(),
      role: newRole.value,
      annualLeaveDays: Number(newAnnualDays.value)
    };
    if (
      !payload.firstName ||
      !payload.lastName ||
      !payload.phone ||
      !payload.password
    ) {
      return;
    }

    const deptId = newDepartmentSelect.value;
    if (deptId) {
      const dept = departments.find((d) => d.id === Number(deptId));
      if (dept) {
        payload.departmentName = dept.name;
        payload.departmentColor = dept.color;
      }
    }

    apiFetch("/api/users", {
      method: "POST",
      body: JSON.stringify(payload)
    })
      .then(() => {
        newStaffForm.reset();
        newAnnualDays.value = 20;
        newDepartmentSelect.value = "";
        return apiFetch("/api/users/basic");
      })
      .then((basic) => {
        basicUsers = basic;
        renderCalendar();
        populateAdminEmployeeFilter();
        return loadStaffForAdmin();
      })
      .catch((err) => {
        alert(err.message || "Σφάλμα δημιουργίας μέλους");
      });
  });

  function populateAdminEmployeeFilter() {
    if (!adminEmployeeFilter) return;
    const currentValue = adminEmployeeFilter.value;
    adminEmployeeFilter.innerHTML = "";

    const dict = i18n[currentLang] || i18n.el;
    const optAll = document.createElement("option");
    optAll.value = "";
    optAll.textContent = dict.optionAllEmployees || "Όλοι";
    adminEmployeeFilter.appendChild(optAll);

    basicUsers.forEach((u) => {
      const opt = document.createElement("option");
      opt.value = u.id;
      opt.textContent = `${u.firstName} ${u.lastName}`;
      adminEmployeeFilter.appendChild(opt);
    });

    if (currentValue) {
      adminEmployeeFilter.value = currentValue;
    }
  }

  function renderAdminLeavesTable() {
    if (!currentUser || currentUser.role !== "admin") return;
    const statusFilter = adminStatusFilter.value;
    const employeeFilter = adminEmployeeFilter.value;
    const kindFilter = adminKindFilter.value;
    adminLeavesTableBody.innerHTML = "";

    let filtered = leaves.slice();
    if (statusFilter) {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }
    if (employeeFilter) {
      const id = parseInt(employeeFilter, 10);
      filtered = filtered.filter((l) => l.userId === id);
    }
    if (kindFilter) {
      filtered = filtered.filter((l) => l.kind === kindFilter);
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    filtered = filtered.filter((l) => {
      if (!l.endDate) return true;
      if (l.status === "approved" && l.endDate < todayStr) {
        return false;
      }
      return true;
    });

    filtered.forEach((l) => {
      const user = findUserById(l.userId);
      const userName = user ? `${user.firstName} ${user.lastName}` : "—";
      const days = countDaysInclusiveLocal(l.startDate, l.endDate);
      const kindLabel =
        l.kind === "repo"
          ? i18n[currentLang].optionRepo || "Ρεπό"
          : i18n[currentLang].optionLeave || "Άδεια";
      const typeLabel = getTypeLabel(l.type, l.kind);
      const statusLabel = getStatusLabel(l.status);

      const tr = document.createElement("tr");
      tr.dataset.leaveId = l.id;

      if (l.status === "pending") {
        tr.classList.add("pending-row");
      }

      const approveDisabledAttr =
        l.status === "approved" ? "disabled" : "";

      tr.innerHTML = `
        <td>${userName}</td>
        <td>${kindLabel}</td>
        <td>${l.startDate}</td>
        <td>${l.endDate}</td>
        <td>${typeLabel}</td>
        <td>${statusLabel}</td>
        <td>
          <button type="button" class="approve-leave-btn" ${approveDisabledAttr}>${
            currentLang === "en" ? "Accept" : "Αποδοχή"
          }</button>
          <button type="button" class="edit-leave-btn">${
            currentLang === "en" ? "Edit" : "Επεξεργασία"
          }</button>
          <button type="button" class="delete-leave-btn">${
            currentLang === "en" ? "Delete" : "Διαγραφή"
          }</button>
        </td>
      `;
      adminLeavesTableBody.appendChild(tr);
    });
  }

  adminStatusFilter.addEventListener("change", () => {
    renderAdminLeavesTable();
  });
  adminEmployeeFilter.addEventListener("change", () => {
    renderAdminLeavesTable();
  });
  adminKindFilter.addEventListener("change", () => {
    renderAdminLeavesTable();
  });

  adminLeavesTableBody.addEventListener("click", (e) => {
    const btn = e.target;
    const tr = btn.closest("tr");
    if (!tr) return;
    const leaveId = parseInt(tr.dataset.leaveId, 10);

    if (btn.classList.contains("edit-leave-btn")) {
      openAdminEditLeave(leaveId);
    } else if (btn.classList.contains("delete-leave-btn")) {
      const confirmMsg =
        currentLang === "en"
          ? "Delete this request?"
          : "Να διαγραφεί αυτή η αίτηση;";
      if (!confirm(confirmMsg)) return;
      apiFetch(`/api/leaves/${leaveId}`, { method: "DELETE" })
        .then(async () => {
          await reloadLeaves();
          renderAdminLeavesTable();
          renderCalendar();
        })
        .catch((err) => alert(err.message || "Σφάλμα διαγραφής"));
    } else if (btn.classList.contains("approve-leave-btn")) {
      if (btn.disabled) {
        return;
      }
      apiFetch(`/api/leaves/${leaveId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "approved" })
      })
        .then(async () => {
          await reloadLeaves();
          renderAdminLeavesTable();
          renderCalendar();
        })
        .catch((err) =>
          alert(err.message || "Σφάλμα κατά την αποδοχή αίτησης")
        );
    }
  });

  function openAdminEditLeave(leaveId) {
    const l = leaves.find((x) => x.id === leaveId);
    if (!l) return;
    adminEditCard.style.display = "block";
    editLeaveId.value = l.id;
    editKind.value = l.kind || "leave";
    editStartDate.value = l.startDate;
    editEndDate.value = l.endDate;
    editStatus.value = l.status;
    editType.value = l.type;

    if (l.kind === "repo") {
      editEndDate.disabled = true;
    } else {
      editEndDate.disabled = false;
    }
  }

  editKind.addEventListener("change", () => {
    if (editKind.value === "repo") {
      editEndDate.value = editStartDate.value;
      editEndDate.disabled = true;
    } else {
      editEndDate.disabled = false;
    }
  });

  editStartDate.addEventListener("change", () => {
    if (editKind.value === "repo") {
      editEndDate.value = editStartDate.value;
    }
  });

  adminEditForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = editLeaveId.value;
    if (!id) return;
    const payload = {
      kind: editKind.value,
      startDate: editStartDate.value,
      endDate: editEndDate.value,
      status: editStatus.value,
      type: editType.value
    };
    apiFetch(`/api/leaves/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    })
      .then(async () => {
        adminEditCard.style.display = "none";
        await reloadLeaves();
        renderAdminLeavesTable();
        renderCalendar();
      })
      .catch((err) => {
        alert(err.message || "Σφάλμα ενημέρωσης αίτησης");
      });
  });

  function populateDepartmentSelect() {
    if (!newDepartmentSelect) return;
    const dict = i18n[currentLang] || i18n.el;
    const currentValue = newDepartmentSelect.value;

    newDepartmentSelect.innerHTML = "";
    const optNone = document.createElement("option");
    optNone.value = "";
    optNone.textContent = dict.optionNoDepartment || "Χωρίς τμήμα";
    newDepartmentSelect.appendChild(optNone);

    departments.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.name;
      newDepartmentSelect.appendChild(opt);
    });

    if (currentValue) {
      newDepartmentSelect.value = currentValue;
    }
  }

  function renderDepartmentsUI() {
    if (!departmentsTableBody) return;
    departmentsTableBody.innerHTML = "";
    departments.forEach((d) => {
      const tr = document.createElement("tr");
      tr.dataset.deptId = d.id;
      tr.innerHTML = `
        <td>${d.name}</td>
        <td>
          <span class="dept-color-box" style="background-color:${d.color};"></span>
          ${d.color}
        </td>
        <td>
          <button type="button" class="delete-dept-btn">${
            currentLang === "en" ? "Delete" : "Διαγραφή"
          }</button>
        </td>
      `;
      departmentsTableBody.appendChild(tr);
    });
  }

  newDeptForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = newDeptName.value.trim();
    const color = newDeptColor.value.trim();
    if (!name || !color) return;

    apiFetch("/api/departments", {
      method: "POST",
      body: JSON.stringify({ name, color })
    })
      .then((dept) => {
        departments.push(dept);
        newDeptForm.reset();
        newDeptColor.value = "#0ea5e9";
        renderDepartmentsUI();
        populateDepartmentSelect();
      })
      .catch((err) => {
        alert(err.message || "Σφάλμα δημιουργίας τμήματος");
      });
  });

  departmentsTableBody.addEventListener("click", (e) => {
    const btn = e.target;
    if (!btn.classList.contains("delete-dept-btn")) return;
    const tr = btn.closest("tr");
    if (!tr) return;
    const id = parseInt(tr.dataset.deptId, 10);
    const confirmMsg =
      currentLang === "en"
        ? "Delete this department?"
        : "Να διαγραφεί αυτό το τμήμα;";
    if (!confirm(confirmMsg)) return;

    apiFetch(`/api/departments/${id}`, { method: "DELETE" })
      .then(() => {
        departments = departments.filter((d) => d.id !== id);
        renderDepartmentsUI();
        populateDepartmentSelect();
      })
      .catch((err) => {
        alert(err.message || "Σφάλμα διαγραφής τμήματος");
      });
  });

  (async function tryAutoLogin() {
    const stored = localStorage.getItem("leavePortalAuth");
    if (!stored) {
      showLoginView();
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.token) {
        showLoginView();
        return;
      }
      authToken = parsed.token;
      const sessionData = await apiFetch("/api/session");
      setAuth(authToken, sessionData.user);
      if (sessionData.user.mustChangePassword) {
        showPasswordChangeView();
      } else {
        await loadInitialData();
        showMainView();
      }
    } catch (err) {
      setAuth(null, null);
      showLoginView();
    }
  })();
});
