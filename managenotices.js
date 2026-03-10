const noticeForm = document.getElementById("noticeForm");
const noticeTableBody = document.getElementById("noticeTableBody");
const formTitle = document.getElementById("formTitle");
const cancelEditBtn = document.getElementById("cancelEdit");
const submitBtn = document.getElementById("submitBtn");

const STORAGE_KEY = "notices";

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;

  toast.className = `fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg z-50 ${
    type === "error" ? "bg-red-500" : "bg-green-500"
  }`;

  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

// -------------------------
// LOCAL STORAGE FUNCTIONS
// -------------------------
function getNotices() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveNotices(notices) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
}

// -------------------------
// MODE FUNCTIONS
// -------------------------
function setAddMode() {
  noticeForm.reset();
  document.getElementById("noticeId").value = "";
  formTitle.textContent = "Add New Notice";
  submitBtn.textContent = "Add Notice";
  cancelEditBtn.classList.add("hidden");
}

function setEditMode(notice) {
  formTitle.textContent = "Edit Notice";
  submitBtn.textContent = "Update Notice";
  cancelEditBtn.classList.remove("hidden");

  document.getElementById("noticeId").value = notice.id;
  noticeForm.title.value = notice.title;
  noticeForm.description.value = notice.description;
  noticeForm.targetRole.value = notice.target_role;
}

// -------------------------
// FETCH NOTICES (LOCAL)
// -------------------------
function fetchNotices() {
  const notices = getNotices();
  noticeTableBody.innerHTML = "";

  notices.forEach(notice => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border p-2">${notice.id}</td>
      <td class="border p-2">${notice.title}</td>
      <td class="border p-2">${notice.description}</td>
      <td class="border p-2">${notice.target_role}</td>
      <td class="border p-2">${new Date(notice.created_at).toLocaleString()}</td>
      <td class="border p-2 flex gap-2">
        <button class="bg-yellow-400 px-2 py-1 rounded editBtn">Edit</button>
        <button class="bg-red-500 text-white px-2 py-1 rounded deleteBtn">Delete</button>
      </td>
    `;

    noticeTableBody.appendChild(tr);

    tr.querySelector(".editBtn").addEventListener("click", () => setEditMode(notice));
   tr.querySelector(".deleteBtn").addEventListener("click", () => openDeleteModal(notice.id));

  });
}

// -------------------------
// FORM SUBMIT (ADD / UPDATE)
// -------------------------
noticeForm.addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData(noticeForm);

  const title = formData.get("title").trim();
  const description = formData.get("description").trim();
  const target_role = formData.get("targetRole");
  const id = formData.get("id");

  if (!title || !description) {
    showToast("⚠ Please fill all fields", "error");
    return;
  }

  let notices = getNotices();

  if (id) {
    // UPDATE MODE
    notices = notices.map(n =>
      n.id === id ? { ...n, title, description, target_role } : n
    );

    showToast("✅ Notice updated successfully!");
  } else {
    // DUPLICATE CHECK
    const exists = notices.some(
      n => n.title.toLowerCase() === title.toLowerCase()
    );

    if (exists) {
      showToast("⚠ Notice with this title already exists", "error");
      return;
    }

    const data = {
      id: "N" + Date.now(),
      title,
      description,
      target_role,
      posted_by: "admin",
      author_name: "Admin",
      created_at: new Date().toISOString()
    };

    notices.push(data);
    showToast("✅ Notice added successfully!");
  }

  saveNotices(notices);
  setAddMode();
  fetchNotices();
});

// -------------------------
// DELETE NOTICE
// -------------------------
function deleteNotice(id) {
  if (!confirm("Are you sure you want to delete this notice?")) return;

  let notices = getNotices();
  notices = notices.filter(n => n.id !== id);

  saveNotices(notices);
  showToast("🗑 Notice deleted successfully!");
  fetchNotices();
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
  fetchNotices();
});

let deleteTargetId = null;

const confirmModal = document.getElementById("confirmModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

function openDeleteModal(id) {
  deleteTargetId = id;
  confirmModal.classList.remove("hidden");
  confirmModal.classList.add("flex");
}

cancelDeleteBtn.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
});

confirmDeleteBtn.addEventListener("click", () => {
  let notices = getNotices();
  notices = notices.filter(n => n.id !== deleteTargetId);

  saveNotices(notices);
  showToast("🗑 Notice deleted successfully!");
  fetchNotices();

  confirmModal.classList.add("hidden");
});
