function updateYearSemester() {
  const course = document.getElementById("course").value;
  const year = document.getElementById("year");
  const semester = document.getElementById("semester");

  year.innerHTML = `<option value="">Select Year</option>`;
  semester.innerHTML = `<option value="">Select Semester</option>`;

  if (course.startsWith("+2")) {

    year.innerHTML += `<option value="1">1st Year</option>`;
    year.innerHTML += `<option value="2">2nd Year</option>`;

    semester.style.display = "none";   // Hide semester
    semester.required = false;         // Remove required
    semester.value = "";               // Clear value

  } else {

    semester.style.display = "block";  // Show semester
    semester.required = true;          // Make required again

    year.innerHTML += `<option value="1">1st Year</option>`;
    year.innerHTML += `<option value="2">2nd Year</option>`;
    year.innerHTML += `<option value="3">3rd Year</option>`;
  }

  updateSubjects();
}


function updateSemesterSubject() {
  const year = document.getElementById("year").value;
  const semester = document.getElementById("semester");

  semester.innerHTML = `<option value="">Select Semester</option>`;

  if (year == 1) {
    semester.innerHTML += `<option value="1">Semester 1</option>`;
    semester.innerHTML += `<option value="2">Semester 2</option>`;
  } 
  else if (year == 2) {
    semester.innerHTML += `<option value="3">Semester 3</option>`;
    semester.innerHTML += `<option value="4">Semester 4</option>`;
  }
  else if (year == 3) {
    semester.innerHTML += `<option value="5">Semester 5</option>`;
    semester.innerHTML += `<option value="6">Semester 6</option>`;
  }

  updateSubjects();
}

function updateSubjects() {
  const course = document.getElementById("course").value;
  const semester = document.getElementById("semester").value;
  const subject = document.getElementById("subject");

  let subjects = [];

  // -------- +2 SYSTEM --------
  if (course.startsWith("+2")) {
    if (course.includes("Arts")) {
      subjects = ["History", "Political Science", "Sociology", "Logic"];
    }
    else if (course.includes("Science")) {
      subjects = ["Physics", "Chemistry", "Mathematics", "Biology"];
    }
    else if (course.includes("Commerce")) {
      subjects = ["Accountancy", "Business Studies", "Economics", "Statistics"];
    }
  }

  // -------- +3 ARTS --------
  else if (course === "+3 Arts") {
    if (semester == 1) subjects = ["English", "History", "Political Science"];
    if (semester == 2) subjects = ["Sociology", "Economics", "Logic"];
    if (semester == 3) subjects = ["Indian Polity", "Public Administration", "Education"];
    if (semester == 4) subjects = ["Western Philosophy", "Psychology", "Elective"];
    if (semester == 5) subjects = ["Modern History", "Optional Paper"];
    if (semester == 6) subjects = ["Final Project", "Viva"];
  }

  // -------- +3 SCIENCE --------
  else if (course === "+3 Science") {
    if (semester == 1) subjects = ["Physics", "Chemistry", "Mathematics"];
    if (semester == 2) subjects = ["Botany", "Zoology", "Statistics"];
    if (semester == 3) subjects = ["Organic Chemistry", "Algebra"];
    if (semester == 4) subjects = ["Electronics", "Microbiology"];
    if (semester == 5) subjects = ["Environmental Science", "Project"];
    if (semester == 6) subjects = ["Final Project", "Viva"];
  }

  // -------- +3 COMMERCE --------
  else if (course === "+3 Commerce") {
    if (semester == 1) subjects = ["Accountancy", "Business Studies"];
    if (semester == 2) subjects = ["Economics", "Business Law"];
    if (semester == 3) subjects = ["Cost Accounting", "Banking"];
    if (semester == 4) subjects = ["Income Tax", "Marketing"];
    if (semester == 5) subjects = ["Auditing", "Project Work"];
    if (semester == 6) subjects = ["Final Project", "Viva"];
  }

  // -------- BCA --------
  else if (course === "BCA") {
    if (semester == 1) subjects = ["C Programming", "Math", "Digital Logic"];
    if (semester == 2) subjects = ["Data Structure", "Statistics", "OOP"];
    if (semester == 3) subjects = ["DBMS", "Computer Network", "Java"];
    if (semester == 4) subjects = ["OS", "Software Engineering", "Python"];
    if (semester == 5) subjects = ["Web Technology", "AI", "Elective"];
    if (semester == 6) subjects = ["Project", "Cloud Computing", "Cyber Security"];
  }

  // -------- BBA --------
  else if (course === "BBA") {
    if (semester == 1) subjects = ["Accounting", "Management Basics"];
    if (semester == 2) subjects = ["Business Law", "Economics"];
    if (semester == 3) subjects = ["Marketing", "HR Management"];
    if (semester == 4) subjects = ["Financial Management", "Operations"];
    if (semester == 5) subjects = ["Entrepreneurship", "Project Management"];
    if (semester == 6) subjects = ["Strategic Management", "Final Project"];
  }

  subject.innerHTML = `<option value="">Select Subject</option>`;
  subjects.forEach(s => {
    subject.innerHTML += `<option value="${s}">${s}</option>`;
  });
}
