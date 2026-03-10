const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const formTitle = document.getElementById("formTitle");
const cancelEditBtn = document.getElementById("cancelEdit");
const passwordField = document.getElementById("passwordField");
const submitBtn = document.getElementById("submitBtn");

const yearInput = studentForm.yearOfStudy;


// -------------------------
// YEAR INPUT CONTROL
// -------------------------
yearInput.addEventListener("input", () => {
  yearInput.value = yearInput.value.replace(/\D/g, "");
  if (yearInput.value.length > 1) yearInput.value = yearInput.value.slice(0, 1);
  if (yearInput.value < 1) yearInput.value = "";
  if (yearInput.value > 3) yearInput.value = "3";
});

// -------------------------
// Populate DOB Day & Year
// -------------------------
const dobDay = studentForm.dobDay;
const dobYear = studentForm.dobYear;

for (let i = 1; i <= 31; i++) {
  const option = document.createElement("option");
  option.value = i.toString().padStart(2, "0");
  option.textContent = i;
  dobDay.appendChild(option);
}

const currentYear = new Date().getFullYear();
for (let y = currentYear; y >= currentYear - 50; y--) {
  const option = document.createElement("option");
  option.value = y;
  option.textContent = y;
  dobYear.appendChild(option);
}

// -------------------------
// MODE FUNCTIONS
// -------------------------
function setAddMode() {
  passwordField.required = true;
  studentForm.reset();
  document.getElementById("studentId").value = "";
  formTitle.textContent = "Add New Student";
  submitBtn.textContent = "Add Student";
  cancelEditBtn.classList.add("hidden");
}

function setEditMode(student) {
  passwordField.required = false;
  formTitle.textContent = "Edit Student";
  submitBtn.textContent = "Update";
  cancelEditBtn.classList.remove("hidden");

  document.getElementById("studentId").value = student.id;
  studentForm.firstName.value = student.firstName;
  studentForm.lastName.value = student.lastName;
  studentForm.gender.value = student.gender || "";

  if (student.dob) {
    const dob = new Date(student.dob);
    studentForm.dobDay.value = dob.getDate().toString().padStart(2, "0");
    studentForm.dobMonth.value = (dob.getMonth() + 1).toString().padStart(2, "0");
    studentForm.dobYear.value = dob.getFullYear();
  }

  studentForm.rollNumber.value = student.rollNumber;
  studentForm.stream.value = student.stream || "";
  studentForm.honors.value = student.honors || "";
  studentForm.department.value = student.department || "";
  studentForm.yearOfStudy.value = student.yearOfStudy || "";
  studentForm.email.value = student.email || "";
  studentForm.phone.value = student.phone || "";
  studentForm.address.value = student.address || "";
  studentForm.guardianName.value = student.guardianName || "";
  studentForm.guardianContact.value = student.guardianContact || "";
  passwordField.value = "";
}

// -------------------------
// FETCH STUDENTS (LOCAL)
// -------------------------
function fetchStudents() {
  fetch("getStudents.php")
    .then(res => res.json())
    .then(students => {

      studentTableBody.innerHTML = "";

      students.forEach((student) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td class="border p-2">${student.id}</td>
          <td class="border p-2">${student.first_name} ${student.last_name}</td>
          <td class="border p-2">${student.email}</td>
          <td class="border p-2">${student.roll_number}</td>
          <td class="border p-2">${student.department}</td>
          <td class="border p-2">${student.year_of_study}</td>
         <td class="border p-2">
  <button onclick='editStudent(${JSON.stringify(student)})'
  class="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>

  <button onclick="deleteStudent(${student.id})"
  class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
</td>

        `;

        studentTableBody.appendChild(tr);
      });

    });
}


// -------------------------
// FORM SUBMIT (ADD / UPDATE)
// -------------------------
studentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(studentForm);

  const email = formData.get("email").toLowerCase();
  const phone = formData.get("phone");
  const password = formData.get("password");

  // -------------------------
  // EMAIL VALIDATION
  // -------------------------
  const emailPattern = /^[a-z0-9._%+-]+@gmail\.com$/;

  if (!emailPattern.test(email)) {
    showToast("❌ Email must end with @gmail.com");
    return;
  }

  // -------------------------
  // PHONE VALIDATION
  // -------------------------
  const phonePattern = /^[0-9]{10}$/;

  if (phone && !phonePattern.test(phone)) {
    showToast("❌ Phone must be 10 digits");
    return;
  }

  // -------------------------
  // PASSWORD VALIDATION
  // -------------------------
  if (password) {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPassword.test(password)) {
      showToast("❌ Weak password");
      return;
    }
  }

  const data = {
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    gender: formData.get("gender"),
    dob: `${formData.get("dobYear")}-${formData.get("dobMonth")}-${formData.get("dobDay")}`,
    rollNumber: formData.get("rollNumber"),
    stream: formData.get("stream"),
    honors: formData.get("honors"),
    department: formData.get("department"),
    yearOfStudy: formData.get("yearOfStudy"),
    email: email,
    phone: phone,
    address: formData.get("address"),
    guardianName: formData.get("guardianName"),
    guardianContact: formData.get("guardianContact"),
    password: password
  };

  const url = data.id ? "updateStudent.php" : "addStudent.php";

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {
      if (response.success) {
        showToast("✅ Saved successfully");
        setAddMode();
        fetchStudents();
      } else {
        showToast("❌ " + response.error);
      }
    })
    .catch(error => {
      showToast("❌ Server error");
      console.error(error);
    });

});


// -------------------------
// DELETE STUDENT (WITH MODAL)
// -------------------------
let deleteId = null;

function deleteStudent(id) {
  deleteId = id;
  document.getElementById("deleteModal").classList.remove("hidden");
}

document.getElementById("confirmDeleteBtn").addEventListener("click", function () {

  if (!deleteId) return;

  fetch("deleteStudent.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: deleteId })
  })
    .then(res => res.json())
    .then(response => {
      if (response.success) {
        showToast("✅ Student deleted");
        fetchStudents();
      } else {
        showToast("❌ Delete failed");
      }

      closeDeleteModal();
    })
    .catch(() => {
      showToast("❌ Server error");
      closeDeleteModal();
    });
});

function closeDeleteModal() {
  deleteId = null;
  document.getElementById("deleteModal").classList.add("hidden");
}


function editStudent(student) {
  setEditMode({
    id: student.id,
    firstName: student.first_name,
    lastName: student.last_name,
    gender: student.gender,
    dob: student.dob,
    rollNumber: student.roll_number,
    stream: student.stream,
    honors: student.honors,
    department: student.department,
    yearOfStudy: student.year_of_study,
    email: student.email,
    phone: student.phone,
    address: student.address,
    guardianName: student.guardian_name,
    guardianContact: student.guardian_contact
  });
}


// -------------------------
// CANCEL BUTTON
// -------------------------
cancelEditBtn.addEventListener("click", setAddMode);

// -------------------------
// INITIAL LOAD
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  setAddMode();
  fetchStudents();

  // Auto lowercase email while typing
  const emailInput = document.querySelector("input[name='email']");

  emailInput.addEventListener("input", function () {
    this.value = this.value.toLowerCase();
  });
});

function showToast(message) {
  const toast = document.createElement("div");

  const isError = message.includes("❌");

  toast.className = `
    fixed top-6 right-6 px-4 py-2 rounded shadow-lg
    ${isError ? "bg-red-600" : "bg-green-600"}
    text-white
  `;

  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2500);
}
