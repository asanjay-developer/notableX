(() => {
  const STORAGE_KEY = "noteapp_notes";
  const $ = (s) => document.querySelector(s);

  const notesGrid = $("#notes-grid");
  const emptyState = $("#empty-state");
  const addBtn = $("#add-btn");
  const overlay = $("#modal-overlay");
  const modalClose = $("#modal-close");
  const modalCancel = $("#modal-cancel");
  const form = $("#note-form");
  const titleInput = $("#note-title");
  const bodyInput = $("#note-body");

  /* ---- Storage ---- */
  const loadNotes = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const saveNotes = (notes) => localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));

  /* ---- Render ---- */
  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  const renderNotes = () => {
    const notes = loadNotes();
    notesGrid.innerHTML = "";
    if (!notes.length) {
      emptyState.classList.remove("hidden");
      return;
    }
    emptyState.classList.add("hidden");
    notes.forEach((note) => {
      const card = document.createElement("div");
      card.className = "note-card";
      card.innerHTML = `
        <h3>${escapeHtml(note.title)}</h3>
        <p>${escapeHtml(note.body)}</p>
        <div class="note-card-footer">
          <span class="note-date">${formatDate(note.created)}</span>
          <button class="btn-delete" data-id="${note.id}" aria-label="Delete note">Delete</button>
        </div>`;
      notesGrid.appendChild(card);
    });
  };

  const escapeHtml = (str) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return str.replace(/[&<>"']/g, (c) => map[c]);
  };

  /* ---- Modal ---- */
  const openModal = () => {
    overlay.classList.remove("hidden");
    titleInput.value = "";
    bodyInput.value = "";
    titleInput.focus();
  };
  const closeModal = () => overlay.classList.add("hidden");

  addBtn.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);
  modalCancel.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ---- Form submit ---- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    if (!title && !body) return;
    const notes = loadNotes();
    notes.unshift({ id: Date.now(), title, body, created: Date.now() });
    saveNotes(notes);
    renderNotes();
    closeModal();
  });

  /* ---- Delete ---- */
  notesGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-delete");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    saveNotes(loadNotes().filter((n) => n.id !== id));
    renderNotes();
  });

  /* ---- Init ---- */
  renderNotes();
})();
