// Simulated Teacher Login
const teacher = {
  id: "TCH101",
  name: "Mr. S. Kumar"
};

const STORAGE_KEY = "notices";

let announcements = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function loadTeacherNotifications() {
  const notices = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const teacherNotices = notices.filter(n =>
    n.posted_by === "admin" &&
    (n.target_role === "teacher" || n.target_role === "all")
  );

  const badge = document.getElementById("notifyCount");

  if (teacherNotices.length > 0) {
    badge.textContent = teacherNotices.length;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

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


function openTeacherNotifications() {
  window.location.href = "teacherNotifications.html";
}

// Render announcements
function renderAnnouncements() {
  const box = document.getElementById("announcementList");
  box.innerHTML = "";

  const myAnnouncements = announcements.filter(a => a.author_id === teacher.id);

  if (myAnnouncements.length === 0) {
    box.innerHTML = `<p class="text-gray-500">No announcements yet.</p>`;
    return;
  }

  myAnnouncements.forEach((a, index) => {
    box.innerHTML += `
      <div class="border p-3 rounded">
        <h3 class="font-semibold text-lg">${a.title}</h3>
        <p class="text-gray-700">${a.description}</p>
        <p class="text-sm text-gray-500">
          Posted: ${new Date(a.created_at).toLocaleString()}
        </p>

        <div class="mt-2 space-x-2">
          <button onclick="editAnnouncement(${index})"
            class="bg-yellow-500 text-white px-3 py-1 rounded">
            Edit
          </button>

          <button onclick="deleteAnnouncement(${index})"
            class="bg-red-600 text-white px-3 py-1 rounded">
            Delete
          </button>
        </div>
      </div>
    `;
  });
}

// Post announcement
function postAnnouncement() {
  const title = document.getElementById("title").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!title || !message) {
    showToast("Please fill all fields", "error");

    return;
  }

  announcements.push({
    id: "T" + Date.now(),
    title,
    description: message,
    posted_by: "teacher",
    author_id: teacher.id,
    author_name: teacher.name,
    created_at: new Date().toISOString(),
    target_role: "student"
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));

  document.getElementById("title").value = "";
  document.getElementById("message").value = "";

  renderAnnouncements();
  showToast("Announcement posted successfully!");

}

let deleteId = null;

let deleteIndex = null;

function deleteAnnouncement(index) {
  deleteIndex = index;

  document.getElementById("confirmText").innerText =
    "Are you sure you want to delete this announcement?";

  document.getElementById("confirmModal").classList.remove("hidden");

  document.getElementById("confirmActionBtn").onclick = confirmDelete;
}

function confirmDelete() {
  announcements.splice(deleteIndex, 1);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));

  closeConfirmModal();
  renderAnnouncements();
  showToast("Announcement deleted successfully!");
}

function closeConfirmModal() {
  document.getElementById("confirmModal").classList.add("hidden");
}



// Edit
let editIndex = null;

function editAnnouncement(index) {
  editIndex = index;

  document.getElementById("editTitle").value = announcements[index].title;
  document.getElementById("editMessage").value = announcements[index].description;

  document.getElementById("editModal").classList.remove("hidden");
}

function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
}

function saveEdit() {
  const newTitle = document.getElementById("editTitle").value.trim();
  const newMsg = document.getElementById("editMessage").value.trim();

  if (!newTitle || !newMsg) {
    showToast("Fields cannot be empty!", "error");

    return;
  }

  announcements[editIndex].title = newTitle;
  announcements[editIndex].description = newMsg;
  announcements[editIndex].created_at = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));

  closeEditModal();
  renderAnnouncements();
}

// Initial Load
renderAnnouncements();
loadTeacherNotifications();

