// ---------- DOM ELEMENTS ----------
const loginBtn = document.getElementById("loginBtn");
const loginMenu = document.getElementById("loginMenu");

const loginModal = document.getElementById("loginModal");
const closeLoginModal = document.getElementById("closeLoginModal");
const loginLinks = document.querySelectorAll("#loginMenu .roleBtn");
const loginTitle = document.getElementById("loginTitle");
const loginForm = document.getElementById("loginForm");

// ---------- LOGIN DROPDOWN ----------
loginBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  loginMenu.classList.toggle("hidden");
});

// ---------- OPEN LOGIN MODAL BASED ON ROLE ----------
loginLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const role = link.dataset.role.toLowerCase();
    loginTitle.textContent = `${link.dataset.role} Login`;
    loginModal.classList.remove("hidden");
    loginMenu.classList.add("hidden");
    loginForm.reset();

    // store role in hidden input
    let roleInput = loginForm.querySelector('input[name="role"]');
    if (!roleInput) {
      roleInput = document.createElement("input");
      roleInput.type = "hidden";
      roleInput.name = "role";
      loginForm.appendChild(roleInput);
    }
    roleInput.value = role;
  });
});

// ---------- CLOSE LOGIN MODAL ----------
closeLoginModal.addEventListener("click", () => {
  loginModal.classList.add("hidden");
});

// Close dropdown & modal when clicking outside
window.addEventListener("click", (e) => {
  if (!loginBtn.contains(e.target) && !loginMenu.contains(e.target)) {
    loginMenu.classList.add("hidden");
  }
  if (e.target === loginModal) {
    loginModal.classList.add("hidden");
  }
});


// ---------- LOGIN SUBMIT (LOCAL STORAGE) ----------
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");

  toastMsg.textContent = message;

  toast.className =
    "fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg z-50 animate-slideDown";

  if (type === "success") toast.classList.add("bg-green-600", "text-white");
  if (type === "error") toast.classList.add("bg-red-600", "text-white");
  if (type === "info") toast.classList.add("bg-blue-600", "text-white");

  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role")
  };

  fetch("login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {

      if (response.error) {
        showToast("❌ " + response.error, "error");
        return;
      }

      showToast("✅ Welcome " + response.name, "success");

      // Save login info temporarily
      sessionStorage.setItem("userName", response.name);
      sessionStorage.setItem("userRole", response.role);
      sessionStorage.setItem("userEmail", response.email);   // ⭐ ADD THIS


      setTimeout(() => {
        if (response.role === "student") window.location.href = "studentdashboard.html";
        if (response.role === "teacher") window.location.href = "teacherdashboard.html";
        if (response.role === "admin") window.location.href = "admindashboard.html";
      }, 1200);


    })
    .catch(() => {
      showToast("Server error", "error");
    });
});

