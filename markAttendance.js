const attendanceTable = document.getElementById("attendanceTable");

function showToast(message, type = "error") {
  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.className = `fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white z-50 
  ${type === "success" ? "bg-green-600" : "bg-red-600"}`;

  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

function updateYearOptions() {
  const course = document.getElementById("courseSelect").value;
  const yearSelect = document.getElementById("yearSelect");

  yearSelect.innerHTML = `<option value="">Select Year</option>`;

  if (course.startsWith("+2")) {
    yearSelect.innerHTML += `<option value="1">1st Year</option>`;
    yearSelect.innerHTML += `<option value="2">2nd Year</option>`;
  } else {
    yearSelect.innerHTML += `<option value="1">1st Year</option>`;
    yearSelect.innerHTML += `<option value="2">2nd Year</option>`;
    yearSelect.innerHTML += `<option value="3">3rd Year</option>`;
  }
}

function loadStudents() {
  const date = document.getElementById("attendanceDate").value;
  const course = document.getElementById("courseSelect").value;
  const year = document.getElementById("yearSelect").value;

  if (!date || !course || !year) {
    showToast("⚠ Please select Date, Course and Year!");
    return;
  }


  const students = JSON.parse(localStorage.getItem("students")) || [];

  const filteredStudents = students.filter(s =>
    s.stream?.toLowerCase().trim() === course.toLowerCase().trim() &&
    Number(s.yearOfStudy) === Number(year)
  );

  if (filteredStudents.length === 0) {
    showToast("⚠ No students found in this class.");
    attendanceTable.innerHTML = "";
    return;
  }

  attendanceTable.innerHTML = "";

  filteredStudents.forEach((s, index) => {
    attendanceTable.innerHTML += `
      <tr>
        <td class="border p-2">${s.rollNumber || index + 1}</td>
        <td class="border p-2">${s.firstName} ${s.lastName}</td>
        <td class="border p-2">${s.stream} - Year ${s.yearOfStudy}</td>
        <td class="border p-2 text-center">
          <select class="status border rounded p-1">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </td>
      </tr>
    `;
  });

  document.getElementById("saveBtn").disabled = false;
  document.getElementById("saveBtn").classList.remove("opacity-50", "cursor-not-allowed");

  showToast("📋 Students loaded successfully!", "success");
}


function saveAttendanceEffect(btn) {

  const date = document.getElementById("attendanceDate").value;
  const course = document.getElementById("courseSelect").value;
  const year = document.getElementById("yearSelect").value;

  if (!date || !course || !year) {
    showToast("⚠ Please select Date, Course and Year!");
    return;
  }

  btn.classList.add("scale-90");

  setTimeout(() => {
    btn.classList.remove("scale-90");
    saveAttendance();
  }, 120);
}

function saveAttendance() {

  const date = document.getElementById("attendanceDate").value;
  const course = document.getElementById("courseSelect").value;
  const year = document.getElementById("yearSelect").value;

  const statusList = document.querySelectorAll(".status");
  const students = JSON.parse(localStorage.getItem("students")) || [];

  const filteredStudents = students.filter(s =>
    s.stream?.toLowerCase().trim() === course.toLowerCase().trim() &&
    Number(s.yearOfStudy) === Number(year)
  );

  const records = filteredStudents.map((s, i) => ({
    studentId: s.id,
    rollNumber: s.rollNumber,
    name: `${s.firstName} ${s.lastName}`,
    status: statusList[i].value
  }));

  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  attendance.push({
    date,
    course,
    year,
    records
  });

  localStorage.setItem("attendance", JSON.stringify(attendance));

  showToast("✅ Attendance saved successfully!", "success");
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.disabled = true;
  saveBtn.classList.add("opacity-50", "cursor-not-allowed");


  attendanceTable.innerHTML = "";
}
