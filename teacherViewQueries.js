const queryTable = document.getElementById("queryTable");

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

function loadQueries() {
  let queries = JSON.parse(localStorage.getItem("queries")) || [];

  // ✅ Sort: Pending first, Replied later
  queries.sort((a, b) => {
    if (!a.reply && b.reply) return -1;
    if (a.reply && !b.reply) return 1;
    return 0;
  });

  queryTable.innerHTML = "";

  const today = new Date();

  queries.forEach((q, index) => {

    let replyDate = q.replyDate ? new Date(q.replyDate) : null;
    let isEditable = true;

    if (replyDate) {
      const diffDays = Math.floor((today - replyDate) / (1000 * 60 * 60 * 24));
      if (diffDays > 7) isEditable = false;
    }

    queryTable.innerHTML += `
      <tr>
        <td class="border p-2">${q.studentName}</td>
        <td class="border p-2">${q.course} - ${q.year}</td>
        <td class="border p-2">${q.subject}</td>
        <td class="border p-2">${q.message}</td>

        <td class="border p-2">
          <textarea id="reply_${index}"
            class="w-full border p-2 rounded ${isEditable ? "" : "bg-gray-100"}"
            placeholder="Write reply here..."
            ${isEditable ? "" : "disabled"}>${q.reply || ""}</textarea>

          ${isEditable ? `
            <button onclick="sendReply(${index})"
              class="mt-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
              ${q.reply ? "Update Reply" : "Send Reply"}
            </button>
          ` : `
            <p class="mt-2 text-sm text-red-600 font-semibold">🔒 Locked (7 days passed)</p>
          `}
        </td>

        <td class="border p-2 text-center">
          ${q.reply
        ? "<span class='text-green-600 font-semibold'>Replied</span>"
        : "<span class='text-red-600 font-semibold'>Pending</span>"}
        </td>
      </tr>
    `;
  });
}

function sendReply(index) {
  let queries = JSON.parse(localStorage.getItem("queries")) || [];

  queries.sort((a, b) => {
    if (!a.reply && b.reply) return -1;
    if (a.reply && !b.reply) return 1;
    return 0;
  });

  const replyText = document.getElementById(`reply_${index}`).value.trim();

  if (!replyText) {
    showToast("Please write a reply first.", "error");
    return;
  }

  queries[index].reply = replyText;
  queries[index].replyDate = new Date().toISOString();

  localStorage.setItem("queries", JSON.stringify(queries));

  showToast("Reply saved successfully!");
  loadQueries();
}


loadQueries();
