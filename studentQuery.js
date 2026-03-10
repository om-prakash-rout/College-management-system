document.getElementById("queryForm").addEventListener("submit", function (e) {
  e.preventDefault();

  function showToast(message, type = "success") {
    const toast = document.getElementById("toast");

    toast.innerText = message;

    if (type === "error") {
      toast.classList.remove("bg-green-600");
      toast.classList.add("bg-red-600");
    } else {
      toast.classList.remove("bg-red-600");
      toast.classList.add("bg-green-600");
    }

    toast.classList.remove("hidden");

    setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  }

  const query = {
    id: Date.now().toString(),
    studentName: studentName.value,
    roll: roll.value,
    course: course.value,
    year: year.value,
    subject: subject.value,
    message: message.value,
    reply: "",
    date: new Date().toISOString().split("T")[0]
  };

  let queries = JSON.parse(localStorage.getItem("queries")) || [];
  queries.push(query);
  localStorage.setItem("queries", JSON.stringify(queries));

  showToast("Query submitted successfully!");

  this.reset();
});

const courseSelect = document.getElementById("course");
const yearSelect = document.getElementById("year");

courseSelect.addEventListener("change", function () {
  yearSelect.innerHTML = '<option value="">Select Year</option>';

  if (this.value.startsWith("+2")) {
    yearSelect.innerHTML += `
      <option value="1">1st Year</option>
      <option value="2">2nd Year</option>
    `;
  } else {
    yearSelect.innerHTML += `
      <option value="1">1st Year</option>
      <option value="2">2nd Year</option>
      <option value="3">3rd Year</option>
    `;
  }
});

function checkNotifications() {
  const queries = JSON.parse(localStorage.getItem("queries")) || [];

  const hasReply = queries.some(q => q.reply && q.reply.trim() !== "");

  if (hasReply) {
    document.getElementById("notifyDot").classList.remove("hidden");
  }
}

checkNotifications();

