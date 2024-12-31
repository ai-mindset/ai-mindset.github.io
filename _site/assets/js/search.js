document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const resultsDiv = document.getElementById("search-results");
    let searchIndex, searchData;

    async function initSearch() {
        try {
            const response = await fetch("/search.json");
            const data = await response.json();
            searchData = data;

            searchIndex = lunr(function () {
                this.ref("url");
                this.field("title", { boost: 10 });
                this.field("content", { boost: 5 });

                data.posts.forEach((post) => {
                    this.add({
                        url: post.url,
                        title: post.title,
                        content: post.content,
                    });
                });
            });

            searchInput.disabled = false;
            searchInput.placeholder = "Search...";
        } catch (error) {
            console.error("Search error:", error);
            searchInput.placeholder = "Search unavailable";
        }
    }

    function performSearch(query) {
        if (!searchIndex || !query) {
            resultsDiv.style.display = "none";
            return;
        }

        try {
            // More flexible search with wildcards and fuzzy matching
            const terms = query.trim().toLowerCase().split(" ");
            const queryString = terms
                .map((term) => `${term}~1 ${term}*`)
                .join(" ");

            const results = searchIndex.search(queryString);

            if (results.length > 0) {
                const html = results
                    .map((result) => {
                        const post = searchData.posts.find((p) =>
                            p.url === result.ref
                        );
                        return `<a href="${post.url}" class="search-result">
              <h3>${post.title}</h3>
              <span>${post.date}</span>
            </a>`;
                    })
                    .join("");

                resultsDiv.innerHTML = html;
            } else {
                resultsDiv.innerHTML =
                    '<div class="search-result" style="color: var(--text-light); padding: 1rem;">No results found</div>';
            }
            resultsDiv.style.display = "block";
        } catch (e) {
            console.error("Search error:", e);
        }
    }

    searchInput.addEventListener(
        "input",
        (e) => performSearch(e.target.value.trim()),
    );
    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
            resultsDiv.style.display = "none";
        }
    });

    initSearch();
});
