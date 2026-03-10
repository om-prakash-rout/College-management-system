const teacherForm = document.getElementById("teacherForm");
const teacherTableBody = document.getElementById("teacherTableBody");
const formTitle = document.getElementById("formTitle");
const cancelEditBtn = document.getElementById("cancelEdit");
const passwordField = document.getElementById("passwordField");
const submitBtn = document.getElementById("submitBtn");

const deleteModal = document.getElementById("deleteModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

let deleteTargetId = null;

// ------------------ TOAST ------------------
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

// ------------------ STORAGE ------------------
function getTeachersFromStorage() {
  return JSON.parse(localStorage.getItem("teachers")) || [];
}

function saveTeachersToStorage(data) {
  localStorage.setItem("teachers", JSON.stringify(data));
}

function generateTeacherId() {
  return "T" + Date.now();
}

// ------------------ MODE ------------------
function setAddMode() {
  teacherForm.reset();
  document.getElementById("teacherId").value = "";
  passwordField.required = true;
  formTitle.textContent = "Add New Teacher";
  submitBtn.textContent = "Add Teacher";
  cancelEditBtn.classList.add("hidden");
}

function setEditMode(teacher) {
  formTitle.textContent = "Edit Teacher";
  submitBtn.textContent = "Update Teacher";
  cancelEditBtn.classList.remove("hidden");
  passwordField.required = false;

  document.getElementById("teacherId").value = teacher.teacher_id;
  teacherForm.fullName.value = teacher.full_name;
  teacherForm.email.value = teacher.email;
  teacherForm.employeeId.value = teacher.employee_id;
  teacherForm.department.value = teacher.department;
  teacherForm.designation.value = teacher.designation;
  teacherForm.qualification.value = teacher.qualification;
  teacherForm.joiningDate.value = teacher.joining_date;
  teacherForm.phone.value = teacher.phone;
  teacherForm.address.value = teacher.address;
}

// ------------------ FETCH ------------------
function fetchTeachers() {
  const teachers = getTeachersFromStorage();
  teacherTableBody.innerHTML = "";

  teachers.forEach(teacher => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border p-2">${teacher.teacher_id}</td>
      <td class="border p-2">${teacher.full_name}</td>
      <td class="border p-2">${teacher.email}</td>
      <td class="border p-2">${teacher.employee_id}</td>
      <td class="border p-2">${teacher.department}</td>
      <td class="border p-2">${teacher.designation}</td>
      <td class="border p-2">${teacher.phone}</td>
      <td class="border p-2 flex gap-2">
        <button class="bg-yellow-400 px-2 py-1 rounded editBtn">Edit</button>
        <button class="bg-red-500 text-white px-2 py-1 rounded deleteBtn">Delete</button>
      </td>
    `;

    tr.querySelector(".editBtn").onclick = () => setEditMode(teacher);
    tr.querySelector(".deleteBtn").onclick = () => openDeleteModal(teacher.teacher_id);

    teacherTableBody.appendChild(tr);
  });
}

// ------------------ ADD / UPDATE ------------------
teacherForm.addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData(teacherForm);
  let teachers = getTeachersFromStorage();
  const id = formData.get("id");

  const email = formData.get("email").toLowerCase().trim();
  const phone = formData.get("phone").trim();
  const password = formData.get("password");

  // -------------------------
  // EMAIL VALIDATION
  // -------------------------
  const emailPattern = /^[a-z0-9._%+-]+@gmail\.com$/;

  if (!emailPattern.test(email)) {
    showToast("❌ Email must be valid and end with @gmail.com", "error");
    return;
  }

  // Check duplicate email
  const emailExists = teachers.some(
    t => t.email === email && t.teacher_id !== id
  );

  if (emailExists) {
    showToast("❌ Email already exists!", "error");
    return;
  }

  // -------------------------
  // PHONE VALIDATION
  // -------------------------
  const phonePattern = /^[0-9]{10}$/;

  if (!phonePattern.test(phone)) {
    showToast("❌ Phone must be exactly 10 digits", "error");
    return;
  }

  // -------------------------
  // PASSWORD VALIDATION (only when adding or changing)
  // -------------------------
  if (!id || password) {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPassword.test(password)) {
      showToast(
        "❌ Password must be 8+ chars with A-Z, a-z, number & special char",
        "error"
      );
      return;
    }
  }

  const data = {
    teacher_id: id || generateTeacherId(),
    full_name: formData.get("fullName"),
    email: email,
    employee_id: formData.get("employeeId"),
    department: formData.get("department"),
    designation: formData.get("designation"),
    qualification: formData.get("qualification"),
    joining_date: formData.get("joiningDate"),
    phone: phone,
    address: formData.get("address"),
    password: password || (teachers.find(t => t.teacher_id === id)?.password || "")
  };

  if (id) {
    teachers = teachers.map(t => t.teacher_id === id ? data : t);
    showToast("✅ Teacher updated successfully!");
  } else {
    teachers.push(data);
    showToast("🎉 Teacher added successfully!");
  }

  saveTeachersToStorage(teachers);
  setAddMode();
  fetchTeachers();

  
});


// ------------------ DELETE ------------------
function openDeleteModal(id) {
  deleteTargetId = id;
  deleteModal.classList.remove("hidden");
}

cancelDelete.onclick = () => deleteModal.classList.add("hidden");

confirmDelete.onclick = () => {
  let teachers = getTeachersFromStorage();
  teachers = teachers.filter(t => t.teacher_id !== deleteTargetId);

  saveTeachersToStorage(teachers);
  fetchTeachers();

  deleteModal.classList.add("hidden");
  showToast("🗑 Teacher deleted successfully!", "info");
};

// ------------------ INIT ------------------
cancelEditBtn.onclick = setAddMode;

document.addEventListener("DOMContentLoaded", () => {
  setAddMode();
  fetchTeachers();

  // Auto lowercase email while typing (runs immediately on page load)
  teacherForm.email.addEventListener("input", function () {
    this.value = this.value.toLowerCase();
  });
});
