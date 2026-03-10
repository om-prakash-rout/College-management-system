const marksTable = document.getElementById("marksTable");

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

const subjectMap = {
  "+2 Arts": ["English", "MIL", "History", "Political Science", "Economics"],
  "+2 Science": ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
  "+2 Commerce": ["Accountancy", "Business Studies", "Economics", "English"],

  "+3 Arts": {
    1: ["English", "Odia", "History", "Political Science"],
    2: ["English", "Economics", "Philosophy", "Sociology"],
    3: ["Indian Polity", "Modern History", "Public Administration"],
    4: ["Development Studies", "Human Rights", "Sociology"],
    5: ["Indian Economy", "Gender Studies", "Environmental Studies"],
    6: ["Project", "Viva"]
  },

  "+3 Science": {
    1: ["Physics", "Chemistry", "Mathematics"],
    2: ["Physics", "Chemistry", "Biology"],
    3: ["Electronics", "Botany", "Zoology"],
    4: ["Organic Chemistry", "Solid State Physics"],
    5: ["Microbiology", "Biotechnology"],
    6: ["Project", "Viva"]
  },

  "+3 Commerce": {
    1: ["Accountancy", "Business Organization", "Economics"],
    2: ["Corporate Accounting", "Business Law", "Statistics"],
    3: ["Income Tax", "Cost Accounting", "Marketing"],
    4: ["Auditing", "Banking", "HR Management"],
    5: ["Financial Management", "Entrepreneurship"],
    6: ["Project", "Viva"]
  },

  "BCA": {
    1: ["C Programming", "Digital Electronics", "Math", "English"],
    2: ["Data Structures", "DBMS", "OS", "Statistics"],
    3: ["Java", "Computer Networks", "Python"],
    4: ["Software Engineering", "Web Development", "AI"],
    5: ["Cloud Computing", "Mobile Computing", "ML"],
    6: ["Project", "Internship"]
  },

  "BBA": {
    1: ["Management", "Accounting", "Business Math"],
    2: ["Marketing", "Economics", "Statistics"],
    3: ["HRM", "Finance", "Operations"],
    4: ["Entrepreneurship", "Business Law"],
    5: ["Strategic Mgmt", "International Business"],
    6: ["Project", "Internship"]
  }
};


function updateYearSemester() {
  const course = document.getElementById("course").value;
  const year = document.getElementById("year");
  const semester = document.getElementById("semester");

  year.innerHTML = `<option value="">Select Year</option>`;
  semester.innerHTML = `<option value="">Select Semester</option>`;

  if (course.startsWith("+2")) {
    year.innerHTML += `<option value="1">1st Year</option>`;
    year.innerHTML += `<option value="2">2nd Year</option>`;

    semester.style.display = "none";
    year.onchange = updateSubjects;

  } else {
    semester.style.display = "block";

    year.innerHTML += `<option value="1">1st Year</option>`;
    year.innerHTML += `<option value="2">2nd Year</option>`;
    year.innerHTML += `<option value="3">3rd Year</option>`;

    year.onchange = updateSemesterSubject;
  }
}



function updateSemesterSubject() {
  const year = document.getElementById("year").value;
  const semester = document.getElementById("semester");

  semester.innerHTML = `<option value="">Select Semester</option>`;

  if (year == 1) {
    semester.innerHTML += `<option value="1">Sem 1</option>`;
    semester.innerHTML += `<option value="2">Sem 2</option>`;
  }
  if (year == 2) {
    semester.innerHTML += `<option value="3">Sem 3</option>`;
    semester.innerHTML += `<option value="4">Sem 4</option>`;
  }
  if (year == 3) {
    semester.innerHTML += `<option value="5">Sem 5</option>`;
    semester.innerHTML += `<option value="6">Sem 6</option>`;
  }
}

function updateSubjects() {
  const course = document.getElementById("course").value;
  const semester = document.getElementById("semester").value;
  const subject = document.getElementById("subject");

  subject.innerHTML = `<option value="">Select Subject</option>`;

  let subjects = [];

  if (course.startsWith("+2")) {
    subjects = subjectMap[course];
  } else {
    subjects = subjectMap[course][semester] || [];
  }

  subjects.forEach(sub => {
    subject.innerHTML += `<option value="${sub}">${sub}</option>`;
  });
}

function loadStudentsEffect(btn) {

  const course = document.getElementById("course").value;
  const year = document.getElementById("year").value;
  const subject = document.getElementById("subject").value;
const semester = document.getElementById("semester").value;

if (course.startsWith("+2")) {

  if (!course || !year || !subject) {
    showToast("⚠ Please select Course, Year and Subject!");
    return;
  }

} else {

  if (!course || !year || !semester || !subject) {
    showToast("⚠ Please select Course, Year, Semester and Subject!");
    return;
  }

}

  btn.classList.add("scale-90");

  setTimeout(() => {
    btn.classList.remove("scale-90");
    loadStudents();
  }, 120);
}

function loadStudents() {
  const course = document.getElementById("course").value;
  const year = document.getElementById("year").value;

  const students = JSON.parse(localStorage.getItem("students")) || [];

  const filtered = students.filter(s =>
    s.stream === course && Number(s.yearOfStudy) === Number(year)
  );

  marksTable.innerHTML = "";

  filtered.forEach(s => {
    marksTable.innerHTML += `
      <tr>
        <td class="border p-2">${s.rollNumber}</td>
        <td class="border p-2">${s.firstName} ${s.lastName}</td>
        <td class="border p-2">
          <input type="number" class="marksInput p-1 border rounded w-24" min="0" max="100">
        </td>
      </tr>
    `;
  });
  if (filtered.length === 0) {
  showToast("⚠ No students found!");
  return;
}

showToast("📋 Students loaded successfully!", "success");

document.getElementById("saveBtn").disabled = false;
document.getElementById("saveBtn").classList.remove("opacity-50", "cursor-not-allowed");

}

function saveMarksEffect(btn) {

  btn.classList.add("scale-90");

  setTimeout(() => {
    btn.classList.remove("scale-90");
    saveMarks();
  }, 120);
}

function saveMarks() {

  const course = document.getElementById("course").value;
  const year = document.getElementById("year").value;
  const semester = document.getElementById("semester").value || "0";
  const subject = document.getElementById("subject").value;

  if (course.startsWith("+2")) {

  if (!course || !year || !subject) {
    showToast("⚠ Please select Course, Year and Subject!");
    return;
  }

} else {

  if (!course || !year || !semester || !subject) {
    showToast("⚠ Please select Course, Year, Semester and Subject!");
    return;
  }

}

  const students = JSON.parse(localStorage.getItem("students")) || [];
  const inputs = document.querySelectorAll(".marksInput");

  const filtered = students.filter(s =>
    s.stream === course && Number(s.yearOfStudy) === Number(year)
  );

  let marksData = JSON.parse(localStorage.getItem("marks")) || [];

  filtered.forEach((s, i) => {
    marksData.push({
      studentId: s.id,
      roll: s.rollNumber,
      name: s.firstName + " " + s.lastName,
      course,
      year,
      semester,
      subject,
      marks: inputs[i].value,
      max: 100
    });
  });

  localStorage.setItem("marks", JSON.stringify(marksData));

  showToast("✅ Marks Uploaded Successfully!", "success");

  marksTable.innerHTML = "";

  const saveBtn = document.getElementById("saveBtn");
  saveBtn.disabled = true;
  saveBtn.classList.add("opacity-50", "cursor-not-allowed");
}

