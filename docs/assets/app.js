const state = {
  data: null,
  notes: new Map(),
};

const $ = (selector) => document.querySelector(selector);

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const tagList = (items = []) =>
  items.length ? `<div class="tags">${items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>` : "";

const markdownToHtml = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }

    if (line.startsWith("# ")) {
      closeList();
      html.push(`<h3>${escapeHtml(line.slice(2))}</h3>`);
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      html.push(`<h4>${escapeHtml(line.slice(3))}</h4>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${escapeHtml(line)}</p>`);
  }

  closeList();
  return html.join("");
};

const renderNow = (items) => {
  $("#now-list").innerHTML = items
    .map(
      (item) => `
        <div class="now-item">
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.detail)}</p>
        </div>
      `,
    )
    .join("");
};

const renderTimeline = (items) => {
  $("#timeline-list").innerHTML = items
    .map(
      (item) => `
        <details>
          <summary>
            <span class="meta">${escapeHtml(item.date)}</span>
            <strong>${escapeHtml(item.title)}</strong>
          </summary>
          <div class="timeline-body">
            <p>${escapeHtml(item.body)}</p>
            ${tagList(item.tags)}
          </div>
        </details>
      `,
    )
    .join("");
};

const renderProjects = (projects) => {
  $("#project-grid").innerHTML = projects
    .map(
      (project) => `
        <article class="project-card ${project.featured ? "featured" : ""}">
          <p class="meta">${escapeHtml(project.kind)}</p>
          <h3>${escapeHtml(project.name)}</h3>
          <p class="status">${escapeHtml(project.status)}</p>
          <p>${escapeHtml(project.summary)}</p>
          ${tagList(project.stack)}
          <footer>
            ${
              project.repo
                ? `<a class="text-link" href="${escapeHtml(project.repo)}" target="_blank" rel="noreferrer">Repositorio</a>`
                : ""
            }
            ${
              project.story
                ? `<a class="text-link" href="${escapeHtml(project.story)}" target="_blank" rel="noreferrer">Historia</a>`
                : ""
            }
          </footer>
        </article>
      `,
    )
    .join("");
};

const renderExperience = (items) => {
  $("#experience-list").innerHTML = items
    .map(
      (item) => `
        <article class="experience-item">
          <p class="meta">${escapeHtml(item.period)}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
          ${tagList(item.tags)}
        </article>
      `,
    )
    .join("");
};

const renderStack = (groups) => {
  $("#stack-grid").innerHTML = groups
    .map(
      (group) => `
        <article class="stack-card">
          <h3>${escapeHtml(group.title)}</h3>
          <ul>
            ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");
};

const loadNote = async (note, button) => {
  if (!state.notes.has(note.file)) {
    const response = await fetch(note.file);
    state.notes.set(note.file, await response.text());
  }

  document.querySelectorAll(".note-button").forEach((item) => item.removeAttribute("aria-current"));
  button?.setAttribute("aria-current", "true");

  const reader = $("#note-reader");
  reader.innerHTML = markdownToHtml(state.notes.get(note.file));
  reader.focus({ preventScroll: true });
};

const renderNotes = (notes) => {
  $("#notes-list").innerHTML = notes
    .map(
      (note, index) => `
        <button class="note-button" type="button" data-note-index="${index}">
          <span class="meta">${escapeHtml(note.date)}</span>
          <strong>${escapeHtml(note.title)}</strong>
          <span>${escapeHtml(note.summary)}</span>
        </button>
      `,
    )
    .join("");

  $("#notes-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-note-index]");
    if (!button) return;
    loadNote(notes[Number(button.dataset.noteIndex)], button);
  });

  if (notes[0]) {
    loadNote(notes[0], document.querySelector('[data-note-index="0"]'));
  }
};

const setupMenu = () => {
  const toggle = $("[data-menu-toggle]");
  const nav = $("[data-nav]");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
};

const init = async () => {
  setupMenu();
  const response = await fetch("./content/site-data.json");
  state.data = await response.json();
  renderNow(state.data.now);
  renderTimeline(state.data.timeline);
  renderProjects(state.data.projects);
  renderExperience(state.data.experience);
  renderStack(state.data.stack);
  renderNotes(state.data.notes);
};

init().catch((error) => {
  console.error(error);
  $("#contenido").insertAdjacentHTML(
    "afterbegin",
    '<p role="alert" class="section">No se pudo cargar el contenido del portfolio.</p>',
  );
});
