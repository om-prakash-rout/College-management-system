const table = document.getElementById("queryTable");

let queries = JSON.parse(localStorage.getItem("queries")) || [];

function loadStudentQueries() {
  table.innerHTML = "";

  if (queries.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="4" class="text-center p-4 text-gray-500">
          No queries found
        </td>
      </tr>`;
    return;
  }

  queries.forEach(q => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="border p-2">${q.subject}</td>

      <td class="border p-2">${q.message}</td>

      <td class="border p-2">
        ${q.reply ? q.reply : '<span class="text-gray-400 italic">Waiting for reply</span>'}
      </td>

      <td class="border p-2 text-center">
        ${q.reply
          ? '<span class="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">Replied</span>'
          : '<span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">Pending</span>'}
      </td>
    `;

    table.appendChild(row);
  });
}

loadStudentQueries();
