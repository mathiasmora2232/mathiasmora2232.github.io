const storyMap = {
  devflow: "./content/projects/devflow.md",
  smartahorra: "./content/projects/smartahorra.md",
  "stellarcode-studio": "./content/projects/stellarcode-studio.md",
  steatify: "./content/projects/steatify.md",
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const inlineMarkdown = (value) =>
  escapeHtml(value)
    .replaceAll(/`([^`]+)`/g, "<code>$1</code>")
    .replaceAll(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

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
      html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  closeList();
  return html.join("");
};

const initProjectStory = async () => {
  const params = new URLSearchParams(window.location.search);
  const project = params.get("project") || "devflow";
  const file = storyMap[project];
  const container = document.querySelector("[data-project-story]");

  if (!file) {
    container.innerHTML = `
      <p class="eyebrow">Historia de proyecto</p>
      <h1>Proyecto no encontrado</h1>
      <p>Vuelve a la lista de proyectos y abre una historia disponible.</p>
    `;
    return;
  }

  const response = await fetch(file);
  const markdown = await response.text();
  container.innerHTML = `<p class="eyebrow">Historia de proyecto</p>${markdownToHtml(markdown)}`;
};

initProjectStory().catch(() => {
  document.querySelector("[data-project-story]").innerHTML = `
    <p class="eyebrow">Historia de proyecto</p>
    <h1>No se pudo cargar esta historia</h1>
    <p>Revisa que el archivo Markdown exista dentro de <code>docs/content/projects/</code>.</p>
  `;
});
