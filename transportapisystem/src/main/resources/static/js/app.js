// IIUC Transport Board — talks to the Spring Boot REST API at /api/transports.
// Same-origin: this file is served by Spring Boot itself, so no CORS setup is needed.

const API_BASE = "/api/transports";

const LINE_COLORS = ["#F2A93B", "#2E86AB", "#B3462C", "#5C7A5C", "#6E5B7A"];

const els = {
  clock: document.getElementById("clock"),
  statBuses: document.getElementById("statBuses"),
  statRoutes: document.getElementById("statRoutes"),
  statCapacity: document.getElementById("statCapacity"),
  statSemesters: document.getElementById("statSemesters"),
  searchInput: document.getElementById("searchInput"),
  semesterFilter: document.getElementById("semesterFilter"),
  newBusBtn: document.getElementById("newBusBtn"),
  emptyNewBusBtn: document.getElementById("emptyNewBusBtn"),
  boardBody: document.getElementById("boardBody"),
  emptyState: document.getElementById("emptyState"),
  loadingState: document.getElementById("loadingState"),
  errorState: document.getElementById("errorState"),
  errorDetail: document.getElementById("errorDetail"),
  retryBtn: document.getElementById("retryBtn"),
  scrim: document.getElementById("scrim"),
  panel: document.getElementById("panel"),
  panelTitle: document.getElementById("panelTitle"),
  busForm: document.getElementById("busForm"),
  busId: document.getElementById("busId"),
  busNumber: document.getElementById("busNumber"),
  routeName: document.getElementById("routeName"),
  driverName: document.getElementById("driverName"),
  capacity: document.getElementById("capacity"),
  semester: document.getElementById("semester"),
  departureTime: document.getElementById("departureTime"),
  arrivalTime: document.getElementById("arrivalTime"),
  formError: document.getElementById("formError"),
  closePanel: document.getElementById("closePanel"),
  cancelPanel: document.getElementById("cancelPanel"),
  saveBtn: document.getElementById("saveBtn"),
  confirmScrim: document.getElementById("confirmScrim"),
  confirmDialog: document.getElementById("confirmDialog"),
  confirmText: document.getElementById("confirmText"),
  confirmCancel: document.getElementById("confirmCancel"),
  confirmDelete: document.getElementById("confirmDelete"),
  toast: document.getElementById("toast"),
};

let buses = [];
let pendingDeleteId = null;

// ---------- Clock ----------

function tickClock() {
  const now = new Date();
  els.clock.textContent = now.toLocaleTimeString([], { hour12: false });
}
tickClock();
setInterval(tickClock, 1000);

// ---------- Helpers ----------

function lineColorFor(routeName) {
  const str = routeName || "?";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return LINE_COLORS[hash % LINE_COLORS.length];
}

function lineInitial(routeName) {
  const trimmed = (routeName || "?").trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function showToast(message, isError = false) {
  els.toast.textContent = message;
  els.toast.className = "toast" + (isError ? " error" : "");
  els.toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { els.toast.hidden = true; }, 3200);
}

// ---------- Data loading ----------

async function loadBuses() {
  els.loadingState.hidden = false;
  els.errorState.hidden = true;
  els.emptyState.hidden = true;
  els.boardBody.innerHTML = "";

  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    buses = await res.json();
    els.loadingState.hidden = true;
    populateSemesterFilter();
    renderStats();
    renderBoard();
  } catch (err) {
    els.loadingState.hidden = true;
    els.errorState.hidden = false;
    els.errorDetail.textContent =
      "Make sure the Spring Boot app is running on this same origin. (" + err.message + ")";
  }
}

function populateSemesterFilter() {
  const current = els.semesterFilter.value;
  const semesters = Array.from(new Set(buses.map(b => b.semester).filter(Boolean))).sort();
  els.semesterFilter.innerHTML = '<option value="">All semesters</option>' +
    semesters.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");
  if (semesters.includes(current)) els.semesterFilter.value = current;
}

function renderStats() {
  const routes = new Set(buses.map(b => b.route_name).filter(Boolean));
  const semesters = new Set(buses.map(b => b.semester).filter(Boolean));
  const totalCapacity = buses.reduce((sum, b) => sum + (Number(b.capacity) || 0), 0);

  els.statBuses.textContent = buses.length;
  els.statRoutes.textContent = routes.size;
  els.statCapacity.textContent = totalCapacity;
  els.statSemesters.textContent = semesters.size;
}

function getFilteredBuses() {
  const q = els.searchInput.value.trim().toLowerCase();
  const sem = els.semesterFilter.value;
  return buses.filter(b => {
    const matchesQuery = !q || [b.bus_number, b.route_name, b.driver_name]
      .some(v => (v || "").toLowerCase().includes(q));
    const matchesSem = !sem || b.semester === sem;
    return matchesQuery && matchesSem;
  });
}

function renderBoard() {
  const filtered = getFilteredBuses();
  els.boardBody.innerHTML = "";

  if (filtered.length === 0) {
    els.emptyState.hidden = false;
    return;
  }
  els.emptyState.hidden = true;

  const frag = document.createDocumentFragment();
  filtered.forEach(bus => frag.appendChild(buildRow(bus)));
  els.boardBody.appendChild(frag);
}

function buildRow(bus) {
  const row = document.createElement("div");
  row.className = "row";
  row.setAttribute("role", "row");

  const color = lineColorFor(bus.route_name);

  row.innerHTML = `
    <span class="cell-line"><span class="line-badge" style="background:${color}">${escapeHtml(lineInitial(bus.route_name))}</span></span>
    <span class="cell-bus">${escapeHtml(bus.bus_number)}</span>
    <span class="cell-route">${escapeHtml(bus.route_name)}</span>
    <span class="cell-driver">${escapeHtml(bus.driver_name)}</span>
    <span class="cell-cap">${escapeHtml(bus.capacity)}</span>
    <span class="cell-time cell-dep">${escapeHtml(bus.departure_time)}</span>
    <span class="cell-time cell-arr">${escapeHtml(bus.arrival_time)}</span>
    <span class="cell-sem">${escapeHtml(bus.semester)}</span>
    <span class="row-actions">
      <button type="button" class="icon-btn" data-action="edit" aria-label="Edit">&#9998;</button>
      <button type="button" class="icon-btn" data-action="delete" aria-label="Delete">&#128465;</button>
    </span>
  `;

  row.querySelector('[data-action="edit"]').addEventListener("click", () => openPanel(bus));
  row.querySelector('[data-action="delete"]').addEventListener("click", () => openConfirm(bus));

  return row;
}

// ---------- Panel (add/edit) ----------

function openPanel(bus = null) {
  els.busForm.reset();
  els.formError.hidden = true;

  if (bus) {
    els.panelTitle.textContent = "Edit bus";
    els.busId.value = bus.id;
    els.busNumber.value = bus.bus_number || "";
    els.routeName.value = bus.route_name || "";
    els.driverName.value = bus.driver_name || "";
    els.capacity.value = bus.capacity ?? "";
    els.semester.value = bus.semester || "";
    els.departureTime.value = bus.departure_time || "";
    els.arrivalTime.value = bus.arrival_time || "";
  } else {
    els.panelTitle.textContent = "New bus";
    els.busId.value = "";
  }

  els.scrim.hidden = false;
  els.panel.hidden = false;
  els.panel.setAttribute("aria-hidden", "false");
  els.busNumber.focus();
}

function closePanel() {
  els.scrim.hidden = true;
  els.panel.hidden = true;
  els.panel.setAttribute("aria-hidden", "true");
}

els.newBusBtn.addEventListener("click", () => openPanel());
els.emptyNewBusBtn.addEventListener("click", () => openPanel());
els.closePanel.addEventListener("click", closePanel);
els.cancelPanel.addEventListener("click", closePanel);
els.scrim.addEventListener("click", closePanel);

els.busForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  els.formError.hidden = true;

  const payload = {
    bus_number: els.busNumber.value.trim(),
    route_name: els.routeName.value.trim(),
    driver_name: els.driverName.value.trim(),
    capacity: Number(els.capacity.value),
    semester: els.semester.value.trim(),
    departure_time: els.departureTime.value.trim(),
    arrival_time: els.arrivalTime.value.trim(),
  };

  if (!payload.bus_number || !payload.route_name || !payload.driver_name ||
      !payload.semester || !payload.departure_time || !payload.arrival_time ||
      !payload.capacity || payload.capacity < 1) {
    els.formError.textContent = "Fill in every field with a valid value before saving.";
    els.formError.hidden = false;
    return;
  }

  const id = els.busId.value;
  const isEdit = Boolean(id);

  els.saveBtn.disabled = true;
  els.saveBtn.textContent = "Saving\u2026";

  try {
    const res = await fetch(isEdit ? `${API_BASE}/${id}` : API_BASE, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);

    closePanel();
    showToast(isEdit ? "Bus updated." : "Bus added to the board.");
    await loadBuses();
  } catch (err) {
    els.formError.textContent = "Couldn't save: " + err.message;
    els.formError.hidden = false;
  } finally {
    els.saveBtn.disabled = false;
    els.saveBtn.textContent = "Save bus";
  }
});

// ---------- Delete confirm ----------

function openConfirm(bus) {
  pendingDeleteId = bus.id;
  els.confirmText.textContent = `This removes ${bus.bus_number} (${bus.route_name}) from the board.`;
  els.confirmScrim.hidden = false;
  els.confirmDialog.hidden = false;
}

function closeConfirm() {
  pendingDeleteId = null;
  els.confirmScrim.hidden = true;
  els.confirmDialog.hidden = true;
}

els.confirmCancel.addEventListener("click", closeConfirm);
els.confirmScrim.addEventListener("click", closeConfirm);

els.confirmDelete.addEventListener("click", async () => {
  if (pendingDeleteId == null) return;
  const id = pendingDeleteId;
  closeConfirm();
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    showToast("Bus removed.");
    await loadBuses();
  } catch (err) {
    showToast("Couldn't delete: " + err.message, true);
  }
});

// ---------- Filters ----------

els.searchInput.addEventListener("input", renderBoard);
els.semesterFilter.addEventListener("change", renderBoard);
els.retryBtn.addEventListener("click", loadBuses);

// ---------- Init ----------

loadBuses();
