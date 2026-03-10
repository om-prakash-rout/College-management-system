const natureSelect = document.getElementById("natureSelect");
const courseSelect = document.getElementById("courseSelect");
const branchSelect = document.getElementById("branchSelect");
const courseForm = document.getElementById("courseForm");
const courseTableBody = document.getElementById("courseTableBody");

const STORAGE_KEY = "collegeCourseStructure";

// MASTER COURSE STRUCTURE (College Logic)
const masterData = {
  "+2": {
    "Arts": ["Odia", "English", "History", "Political Science", "Education"],
    "Science": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"],
    "Commerce": ["Accounting", "Business Studies", "Economics", "Taxation"]
  },

  "General (UG)": {
    "B.A": ["Odia", "English", "History", "Political Science", "Education"],
    "B.Sc": ["Physics", "Chemistry", "Mathematics", "Botany", "Zoology", "Computer Science"],
    "B.Com": ["Accounting", "Finance", "Taxation", "Management"]
  },

  "Self Financing": {
    "BCA": ["Computer Application", "AI", "Data Science"],
    "BBA": ["Marketing", "HR", "Finance"]
  }
};


// -------- Load Nature --------
function loadNature() {
  natureSelect.innerHTML = `<option value="" disabled selected>Select Nature</option>`;
  Object.keys(masterData).forEach(nature => {
    const option = document.createElement("option");
    option.value = nature;
    option.textContent = nature;
    natureSelect.appendChild(option);
  });
}

// -------- Load Courses --------
natureSelect.addEventListener("change", () => {
  const nature = natureSelect.value;

  courseSelect.innerHTML = `<option value="" disabled selected>Select Course</option>`;
  branchSelect.innerHTML = `<option value="" disabled selected>Select Branch</option>`;

  if (!nature) return;

  Object.keys(masterData[nature]).forEach(course => {
    const option = document.createElement("option");
    option.value = course;
    option.textContent = course;
    courseSelect.appendChild(option);
  });
});

// -------- Load Branch --------
courseSelect.addEventListener("change", () => {
  const nature = natureSelect.value;
  const course = courseSelect.value;

  branchSelect.innerHTML = `<option value="" disabled selected>Select Branch</option>`;

  if (!nature || !course) return;

  masterData[nature][course].forEach(branch => {
    const option = document.createElement("option");
    option.value = branch;
    option.textContent = branch;
    branchSelect.appendChild(option);
  });
});

// -------- Local Storage --------
function getData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// -------- Render Table --------
function renderTable() {
  const data = getData();
  courseTableBody.innerHTML = "";

  if (!data.length) {
    courseTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center p-4 text-gray-500">No Course Data</td>
      </tr>
    `;
    return;
  }

  data.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border p-2">${index + 1}</td>
      <td class="border p-2">${item.nature}</td>
      <td class="border p-2">${item.course}</td>
      <td class="border p-2">${item.branch}</td>
      <td class="border p-2 text-center">
       <button onclick="openDeleteModal(${index})"
        class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
  Delete
</button>

      </td>
    `;
    courseTableBody.appendChild(tr);
  });
}


// -------- Add --------
courseForm.addEventListener("submit", e => {
  e.preventDefault();

  const nature = natureSelect.value;
  const course = courseSelect.value;
  const branch = branchSelect.value;

  if (!nature || !course || !branch) {
    showToast("⚠ Please select all fields", "error");
    return;
  }

  const newEntry = { nature, course, branch };

  const data = getData();

  // ❌ Prevent duplicate entry
  const exists = data.some(
    d => d.nature === nature && d.course === course && d.branch === branch
  );

  if (exists) {
    showToast("⚠ Course already exists", "error");
    return;
  }

  data.push(newEntry);
  saveData(data);

  showToast("✅ Course added successfully!");

  courseForm.reset();
  loadNature();
  renderTable();
});


// -------- Initial Load --------
document.addEventListener("DOMContentLoaded", () => {
  loadNature();
  renderTable();
});

let deleteIndex = null;

// Toast Message
function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");

  toastMsg.textContent = msg;

  toast.className =
    "fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg z-50 animate-slideDown";

  if (type === "success") toast.classList.add("bg-green-600", "text-white");
  if (type === "error") toast.classList.add("bg-red-600", "text-white");
  if (type === "info") toast.classList.add("bg-blue-600", "text-white");

  toast.classList.remove("hidden");

  setTimeout(() => toast.classList.add("hidden"), 2500);
}

// Open Delete Modal
function openDeleteModal(index) {
  deleteIndex = index;
  document.getElementById("deleteModal").classList.remove("hidden");
}

// Cancel Delete
document.getElementById("cancelDelete").onclick = () => {
  document.getElementById("deleteModal").classList.add("hidden");
};

// Confirm Delete
document.getElementById("confirmDelete").onclick = () => {
  const data = getData();
  data.splice(deleteIndex, 1);
  saveData(data);
  renderTable();

  document.getElementById("deleteModal").classList.add("hidden");
  showToast("🗑 Course deleted successfully!", "info");
};
