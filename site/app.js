const themeButton = document.querySelector(".theme-toggle");
let theme;
try {
  theme = localStorage.getItem("theme");
} catch {
  theme = null;
}
document.body.classList.toggle(
  "dark-theme",
  theme === "dark" || (theme === null && matchMedia("(prefers-color-scheme: dark)").matches),
);
themeButton.setAttribute(
  "aria-label",
  document.body.classList.contains("dark-theme") ? "Switch to light mode" : "Switch to dark mode",
);
themeButton.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark-theme");
  themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    // A blocked storage API should not prevent theme changes.
  }
});

// Claim before sending. An uncertain request is never retried.
try {
  const key = "ai-mindset:unique-browser:v2";
  if (localStorage.getItem(key) !== "1") {
    localStorage.setItem(key, "1");
    const beacon = new URL(
      "https://github.com/ai-mindset/ai-mindset.github.io/releases/download/visitor-counter-v2/visit.txt",
    );
    beacon.searchParams.set("visit", String(Date.now()));
    fetch(beacon, {
      cache: "no-store",
      credentials: "omit",
      keepalive: true,
      mode: "no-cors",
      referrerPolicy: "no-referrer",
    }).catch(() => {});
  }
} catch {
  // Without durable storage, this browser cannot be counted safely.
}

const list = document.querySelector("#posts-list");
if (list) {
  const cards = [...list.querySelectorAll(".post-item")];
  const search = document.querySelector("#search-input");
  const controls = [...document.querySelectorAll("#tags [data-tag]")];
  const dateFilter = document.querySelector("#date-filter");
  const resultsStatus = document.querySelector("#results-status");
  const clearFilters = document.querySelector("#show-all-btn");
  const noResults = document.querySelector("#no-results");
  const originals = new Map();
  for (const card of cards) {
    for (const element of card.querySelectorAll(".post-title, .post-tags, .post-tldr")) {
      originals.set(element, element.innerHTML);
    }
  }

  const params = new URLSearchParams(location.search);
  let selectedTag = controls.find((control) => control.dataset.tag === params.get("tag")) || null;
  if (selectedTag) {
    selectedTag.setAttribute("aria-pressed", "true");
    selectedTag.classList.add("active");
  }
  dateFilter.value = params.get("date") || "";
  let searchIndex;
  let searchRequest;

  function updateURL() {
    const url = new URL(location.href);
    if (selectedTag) url.searchParams.set("tag", selectedTag.dataset.tag);
    else url.searchParams.delete("tag");
    if (dateFilter.value) url.searchParams.set("date", dateFilter.value);
    else url.searchParams.delete("date");
    history.replaceState(null, "", url);
  }

  function highlight(root, term) {
    if (!term) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const value = node.textContent;
      const at = value.toLowerCase().indexOf(term);
      if (at < 0) continue;
      const mark = document.createElement("mark");
      mark.className = "highlight-match";
      mark.textContent = value.slice(at, at + term.length);
      node.replaceWith(value.slice(0, at), mark, value.slice(at + term.length));
    }
  }

  async function filterPosts() {
    const raw = search.value.trim();
    const phrase = raw.startsWith('"') && raw.endsWith('"')
      ? raw.slice(1, -1).toLowerCase()
      : "";
    const terms = phrase ? [phrase] : raw.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length && !searchRequest) {
      searchRequest = fetch("/posts.json")
        .then((response) => response.ok ? response.json() : [])
        .then((posts) => new Map(posts.map((post) => [post.url, post.text])))
        .catch(() => new Map());
    }
    if (searchRequest) searchIndex = await searchRequest;
    if (raw !== search.value.trim()) return;

    let visible = 0;
    const [year, month] = dateFilter.value.split("-");
    for (const card of cards) {
      const tags = card.dataset.tags.split(",");
      const inSelection = (!selectedTag || tags.includes(selectedTag.dataset.tag)) &&
        (!year || (card.dataset.year === year && (!month || card.dataset.month === month)));
      const content = searchIndex?.get(card.dataset.url) || "";
      const searchable = `${card.querySelector(".post-title").textContent} ${tags.join(" ")} ${content}`.toLowerCase();
      const matches = terms.every((term) => searchable.includes(term));
      card.hidden = !inSelection || !matches;
      if (card.hidden) continue;
      visible++;

      for (const element of card.querySelectorAll(".post-title, .post-tags, .post-tldr")) {
        element.innerHTML = originals.get(element);
        highlight(element, terms[0]);
      }
      card.querySelector(".search-match-excerpt")?.remove();
      const first = terms[0];
      const at = first && content.toLowerCase().indexOf(first);
      if (first && at >= 0) {
        const excerpt = document.createElement("p");
        excerpt.className = "search-match-excerpt";
        excerpt.textContent = `Found: ${at > 50 ? "..." : ""}${content.slice(Math.max(0, at - 50), at + first.length + 70).trim()}...`;
        highlight(excerpt, first);
        card.append(excerpt);
      }
    }
    noResults.hidden = visible > 0;
    const filters = [];
    if (selectedTag) filters.push(`tagged ${selectedTag.dataset.tag}`);
    if (year) filters.push(`from ${dateFilter.selectedOptions[0].textContent}`);
    if (raw) filters.push(`matching “${raw}”`);
    resultsStatus.textContent = `${visible} ${visible === 1 ? "post" : "posts"}${filters.length ? " " + filters.join(" · ") : ""}`;
    clearFilters.hidden = !selectedTag && !year && !raw;
  }

  for (const control of controls) {
    control.addEventListener("click", () => {
      if (selectedTag) {
        selectedTag.setAttribute("aria-pressed", "false");
        selectedTag.classList.remove("active");
      }
      selectedTag = selectedTag === control ? null : control;
      if (selectedTag) {
        selectedTag.setAttribute("aria-pressed", "true");
        selectedTag.classList.add("active");
      }
      updateURL();
      void filterPosts();
    });
  }
  dateFilter.addEventListener("change", () => {
    updateURL();
    void filterPosts();
  });
  search.addEventListener("input", () => void filterPosts());
  document.querySelector(".search-clear").addEventListener("click", () => {
    search.value = "";
    void filterPosts();
    search.focus();
  });
  clearFilters.addEventListener("click", () => {
    if (selectedTag) {
      selectedTag.setAttribute("aria-pressed", "false");
      selectedTag.classList.remove("active");
    }
    selectedTag = null;
    dateFilter.value = "";
    search.value = "";
    updateURL();
    void filterPosts();
  });
  void filterPosts();
}
