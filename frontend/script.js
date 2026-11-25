const API = "http://localhost:8080/api/employees";
const $ = (id) => document.getElementById(id);
let employees = [];

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try { const data = await response.json(); message = data.error || message; } catch {}
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

function notify(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 2500);
}

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);
}

async function loadEmployees(search = "") {
  try {
    employees = await request(`${API}${search ? `?search=${encodeURIComponent(search)}` : ""}`);
    renderEmployees();
    $("totalCount").textContent = employees.length;
    $("activeCount").textContent = employees.filter(e => e.status === "Active").length;
    $("departmentCount").textContent = new Set(employees.map(e => e.department)).size;
  } catch (error) {
    $("employeeRows").innerHTML = `<tr><td colspan="6" class="empty">Cannot connect to backend. Start Spring Boot and MongoDB.</td></tr>`;
    notify(error.message);
  }
}

function renderEmployees() {
  const tbody = $("employeeRows");
  if (!employees.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">No employees found. Click “Add Employee” to create one.</td></tr>';
    return;
  }
  tbody.innerHTML = employees.map(e => `
    <tr>
      <td>${escapeHtml(e.name)}<br><small style="color:#8995a8;font-weight:400">${escapeHtml(e.email)}</small></td>
      <td>${escapeHtml(e.department)}</td>
      <td>${escapeHtml(e.designation)}</td>
      <td>${money(e.salary)}</td>
      <td><span class="pill ${e.status === "Active" ? "" : "inactive"}">${escapeHtml(e.status || "Active")}</span></td>
      <td><button class="action" data-edit="${e.id}">Edit</button><button class="action delete" data-delete="${e.id}">Delete</button></td>
    </tr>`).join("");
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}

function openModal(employee = null) {
  $("employeeForm").reset();
  $("formError").textContent = "";
  $("employeeId").value = employee?.id || "";
  $("modalTitle").textContent = employee ? "Edit employee" : "Add employee";
  if (employee) {
    ["name","email","department","designation","salary","phone","status"].forEach(k => $(k).value = employee[k] ?? "");
  }
  $("employeeModal").classList.remove("hidden");
}
function closeModal() { $("employeeModal").classList.add("hidden"); }

$("addBtn").addEventListener("click", () => openModal());
$("closeModal").addEventListener("click", closeModal);
$("cancelBtn").addEventListener("click", closeModal);

$("employeeForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = $("employeeId").value;
  const payload = {
    name: $("name").value.trim(), email: $("email").value.trim(),
    department: $("department").value.trim(), designation: $("designation").value.trim(),
    salary: Number($("salary").value), phone: $("phone").value.trim(), status: $("status").value
  };
  try {
    await request(id ? `${API}/${id}` : API, {
      method: id ? "PUT" : "POST", body: JSON.stringify(payload)
    });
    closeModal();
    await loadEmployees($("searchInput").value.trim());
    notify(id ? "Employee updated successfully" : "Employee added successfully");
  } catch (error) { $("formError").textContent = error.message; }
});

$("employeeRows").addEventListener("click", async (event) => {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;
  if (editId) {
    const employee = employees.find(e => e.id === editId);
    if (employee) openModal(employee);
  }
  if (deleteId && confirm("Delete this employee record?")) {
    try {
      await request(`${API}/${deleteId}`, { method: "DELETE" });
      await loadEmployees($("searchInput").value.trim());
      notify("Employee deleted");
    } catch (error) { notify(error.message); }
  }
});

let searchTimer;
$("searchInput").addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => loadEmployees($("searchInput").value.trim()), 300);
});

loadEmployees();
