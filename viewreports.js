function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function countByField(data, field) {
  const result = {};
  data.forEach(item => {
    const key = item[field] || "Unknown";
    result[key] = (result[key] || 0) + 1;
  });
  return result;
}

function renderTable(tbodyId, dataObj) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";

  for (const key in dataObj) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border p-2">${key}</td>
      <td class="border p-2 text-center">${dataObj[key]}</td>
    `;
    tbody.appendChild(tr);
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const students = getData("students");
  const teachers = getData("teachers");
  const courses = getData("collegeCourseStructure");
  const notices = getData("college_notices");


  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("totalTeachers").textContent = teachers.length;
  document.getElementById("totalCourses").textContent = courses.length;
  document.getElementById("totalNotices").textContent = notices.length;

  const studentStreamStats = countByField(students, "stream");
  const teacherDeptStats = countByField(teachers, "department");

  renderTable("studentStreamTable", studentStreamStats);
  renderTable("teacherDeptTable", teacherDeptStats);

});
