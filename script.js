// Check for dark mode preference
function setThemePreference() {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark" || (savedTheme === null && prefersDarkScheme)) {
    document.body.classList.add("dark-theme");
  }
}

// Add theme toggle button
function createThemeToggle() {
  const themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle";
  themeToggle.setAttribute("aria-label", "Toggle dark mode");
  themeToggle.textContent = "🌓";

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark-theme") ? "dark" : "light",
    );
  });

  document.body.appendChild(themeToggle);
}

// Fetch and parse posts
async function loadPosts() {
  try {
    const response = await fetch("/posts.json");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
}

// Clear all active filter states
function clearAllActiveStates() {
  // Clear tag active states
  document.querySelectorAll(".tag").forEach((t) => {
    t.classList.remove("active");
  });

  // Clear timeline active states
  document.querySelectorAll(".year-label, .month-letter").forEach((el) => {
    el.classList.remove("active");
  });
}

// Render posts
function renderPosts(posts, filterTag = null, searchTerm = null, isExactMatch = false) {
  const postsContainer = document.getElementById("posts-list");
  postsContainer.innerHTML = "";

  const filteredPosts = filterTag ? posts.filter((post) => post.tags.includes(filterTag)) : posts;

  if (filteredPosts.length === 0) {
    postsContainer.innerHTML = "<p>No posts found.</p>";
    return;
  }

  filteredPosts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post-item";

    const dateElement = document.createElement("span");
    dateElement.className = "post-date";
    dateElement.textContent = new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const titleElement = document.createElement("h3");
    titleElement.className = "post-title";

    const linkElement = document.createElement("a");
    linkElement.href = post.url;

    // Highlight search matches in title if search term is provided
    if (searchTerm) {
      const titleText = post.title;
      // For exact matches or regular matches, create appropriate regex
      let searchRegex;

      if (isExactMatch) {
        // Simple highlighting for exact phrase matches
        searchRegex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
      } else {
        // Try to highlight whole words first, fall back to any match
        searchRegex = new RegExp(`\\b${searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b|${searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'gi');
      }

      if (searchRegex.test(titleText)) {
        linkElement.innerHTML = titleText.replace(searchRegex, match => `<span class="highlight-match">${match}</span>`);
      } else {
        linkElement.textContent = titleText;
      }
    } else {
      linkElement.textContent = post.title;
    }

    const tagsElement = document.createElement("div");
    tagsElement.className = "post-tags";

    post.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "post-tag";

      // Highlight search matches in tags
      if (searchTerm) {
        // Create appropriate regex for tag highlighting
        let searchRegex;

        if (isExactMatch) {
          // For exact phrase matches
          searchRegex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
        } else {
          // For word boundary matches
          searchRegex = new RegExp(`\\b${searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b|${searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'gi');
        }

        if (searchRegex.test(tag)) {
          tagElement.innerHTML = tag.replace(searchRegex, match => `<span class="highlight-match">${match}</span>`);
        } else {
          tagElement.textContent = tag;
        }
      } else {
        tagElement.textContent = tag;
      }

      tagsElement.appendChild(tagElement);
    });

    titleElement.appendChild(linkElement);
    postElement.appendChild(dateElement);
    postElement.appendChild(titleElement);
    postElement.appendChild(tagsElement);

    // Extract and add TL;DR if available
    if (post.content) {
      const tldrPattern = /<p><strong>TL;DR:<\/strong>([\s\S]*?)(?=<\/p>)/i;
      const tldrMatch = post.content.match(tldrPattern);

      if (tldrMatch && tldrMatch[1]) {
        const tldrContent = tldrMatch[1].replace(/<!--more-->/g, "").trim();
        const tldrElement = document.createElement("p");
        tldrElement.className = "post-tldr";

        // Highlight search matches in TL;DR
        if (searchTerm) {
          // Create appropriate regex for TL;DR highlighting
          let searchRegex;

          if (isExactMatch) {
            // For exact phrase matches
            searchRegex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
          } else {
            // For word boundary matches
            searchRegex = new RegExp(`\\b${searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
          }

          const highlightedTldr = "<strong>TL;DR:</strong>" + tldrContent.replace(searchRegex, match => `<span class="highlight-match">${match}</span>`);
          tldrElement.innerHTML = highlightedTldr;
        } else {
          tldrElement.innerHTML = "<strong>TL;DR:</strong>" + tldrContent;
        }

        postElement.appendChild(tldrElement);
      }

      // Add excerpt showing the search match if not in TL;DR
      if (searchTerm) {
        // Strip HTML for plain text searching
        const plainContent = post.content.replace(/<[^>]*>/g, '');

        // Create regex for finding matches
        let searchRegex;
        if (isExactMatch) {
          searchRegex = new RegExp(`\\b${searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        } else {
          searchRegex = new RegExp(`\\b${searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        }

        // Find the position of the first match in content
        const match = plainContent.search(searchRegex);

        // If match found in content (not just in title or tags)
        if (match >= 0) {
          // Calculate start and end positions for the excerpt
          const excerptStart = Math.max(0, match - 50);
          const excerptEnd = Math.min(plainContent.length, match + searchTerm.length + 70);

          // Extract the excerpt
          let excerpt = plainContent.substring(excerptStart, excerptEnd);

          // Add ellipsis at the start/end if needed
          if (excerptStart > 0) excerpt = '...' + excerpt;
          if (excerptEnd < plainContent.length) excerpt = excerpt + '...';

          // Create highlight regex for display
          let highlightRegex;
          if (isExactMatch) {
            highlightRegex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
          } else {
            highlightRegex = new RegExp(`\\b${searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
          }

          // Highlight the search term in the excerpt
          excerpt = excerpt.replace(highlightRegex, match => `<span class="highlight-match">${match}</span>`);

          // Create and append the excerpt element
          const excerptElement = document.createElement('p');
          excerptElement.className = 'search-match-excerpt';
          excerptElement.innerHTML = `<strong>Found:</strong> ${excerpt}`;
          postElement.appendChild(excerptElement);
        }
      }
    }

    postsContainer.appendChild(postElement);
  });
}

// Render tags
function renderTags(posts) {
  const tagsContainer = document.getElementById("tags");
  tagsContainer.innerHTML = "";

  // Extract unique tags
  const allTags = posts.flatMap((post) => post.tags);
  const uniqueTags = [...new Set(allTags)].sort();

  uniqueTags.forEach((tag) => {
    const tagElement = document.createElement("span");
    tagElement.className = "tag";
    tagElement.textContent = tag;

    tagElement.addEventListener("click", () => {
      // Check if this tag is already active
      const isActive = tagElement.classList.contains("active");

      // Clear active state from all tags
      document.querySelectorAll(".tag").forEach((t) => {
        t.classList.remove("active");
      });

      // If tag wasn't active, activate it and filter posts
      // If it was already active, leave it deactivated and show all posts
      if (!isActive) {
        tagElement.classList.add("active");
        renderPosts(posts, tag);
      } else {
        // Show all posts when unselecting a tag
        clearAllActiveStates();
        renderPosts(posts);
      }
    });

    tagsContainer.appendChild(tagElement);
  });

  // Add event listener to show all button
  document.getElementById("show-all-btn").addEventListener("click", () => {
    clearAllActiveStates();
    renderPosts(posts);
  });
}

// Generate posts.json from markdown files
function generatePostsJson() {
  // This function is for demonstration purposes
  // In a real implementation, this would be done by a build script
  console.log("Posts data loaded from JSON file");
}

// Toggle tags visibility
function setupTagsToggle() {
  const toggleButton = document.getElementById("toggle-tags");
  const tagsContainer = document.getElementById("tags-container");
  const chevron = toggleButton.querySelector(".chevron");

  // Make entire header clickable
  document.querySelector(".tag-header").addEventListener("click", () => {
    tagsContainer.classList.toggle("collapsed");
    // Rotate chevron when expanded/collapsed
    if (tagsContainer.classList.contains("collapsed")) {
      chevron.style.transform = "rotate(0deg)";
    } else {
      chevron.style.transform = "rotate(90deg)";
    }
  });
}

// Generate timeline strip
function renderTimeline(posts) {
  const timelineContainer = document.getElementById("timeline-strip");
  if (!timelineContainer) return;

  // Extract dates and organize by year/month
  const dateMap = new Map();

  posts.forEach((post) => {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!dateMap.has(year)) {
      dateMap.set(year, new Set());
    }

    dateMap.get(year).add(month);
  });

  // Sort years in descending order
  const years = [...dateMap.keys()].sort((a, b) => b - a);

  // Create timeline elements
  years.forEach((year) => {
    const yearContainer = document.createElement("div");
    yearContainer.className = "year-container";

    const yearLabel = document.createElement("span");
    yearLabel.className = "year-label";
    yearLabel.textContent = year;
    yearLabel.setAttribute("data-year", year);
    yearLabel.addEventListener("click", () => {
      // Toggle year selection
      const isActive = yearLabel.classList.contains("active");

      // Clear all active states
      document.querySelectorAll(".year-label, .month-dot").forEach((el) => {
        el.classList.remove("active");
      });

      if (!isActive) {
        yearLabel.classList.add("active");

        // Filter posts by year
        const filteredPosts = posts.filter((post) => {
          const postDate = new Date(post.date);
          return postDate.getFullYear() === year;
        });

        renderPosts(filteredPosts);
      } else {
        // Show all posts
        clearAllActiveStates();
        renderPosts(posts);
      }
    });

    const monthLetters = document.createElement("div");
    monthLetters.className = "month-letters";

    // Create letters only for months that have posts
    const monthsWithPosts = [...dateMap.get(year)].sort((a, b) => a - b);

    monthsWithPosts.forEach((month) => {
      const monthElement = document.createElement("div");
      monthElement.className = "month-letter has-posts";
      monthElement.setAttribute("data-month", month);
      monthElement.setAttribute("data-year", year);

      // Get first letter and full month name for enhanced tooltip
      const monthFull = new Date(year, month).toLocaleString("default", { month: "long" });
      monthElement.textContent = monthFull[0];
      monthElement.title = `${monthFull} ${year}`;
      monthElement.setAttribute("data-month-name", monthFull);

      monthElement.addEventListener("click", () => {
        // Toggle month selection
        const isActive = monthElement.classList.contains("active");

        // Clear all active states
        document.querySelectorAll(".year-label, .month-letter").forEach((el) => {
          el.classList.remove("active");
        });

        if (!isActive) {
          monthElement.classList.add("active");
          yearLabel.classList.add("active");

          // Filter posts by month and year
          const filteredPosts = posts.filter((post) => {
            const postDate = new Date(post.date);
            return postDate.getFullYear() === year && postDate.getMonth() === month;
          });

          renderPosts(filteredPosts);
        } else {
          // Show all posts
          clearAllActiveStates();
          renderPosts(posts);
        }
      });

      monthLetters.appendChild(monthElement);
    });

    yearContainer.appendChild(yearLabel);
    yearContainer.appendChild(monthLetters);
    timelineContainer.appendChild(yearContainer);
  });
}

// Search functionality
function setupSearch(posts) {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  let searchTimeout;

  // Function to perform the search
  const performSearch = (searchTerm) => {
    const originalSearchTerm = searchTerm.trim();
    searchTerm = originalSearchTerm.toLowerCase();

    if (!searchTerm) {
      clearAllActiveStates();
      renderPosts(posts);
      return;
    }

    // Check if the search is for an exact phrase (enclosed in quotes)
    const isExactMatch = /^".*"$/.test(originalSearchTerm);
    let exactSearchTerm = '';

    if (isExactMatch) {
      // Remove the quotes for searching
      exactSearchTerm = searchTerm.substring(1, searchTerm.length - 1);
    }

    // Filter posts that match the search term in title, content, or tags
    const filteredPosts = posts.filter(post => {
      // Strip HTML tags for plain text search in content
      const plainContent = post.content ? post.content.replace(/<[^>]*>/g, '') : '';

      // For exact matches (with quotes)
      if (isExactMatch) {
        // Create word boundary regex pattern for the exact term
        const exactWordPattern = new RegExp(`\\b${exactSearchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');

        // Check for word boundary matches in each area
        const titleMatch = exactWordPattern.test(post.title.toLowerCase());
        const tagMatch = post.tags.some(tag => exactWordPattern.test(tag.toLowerCase()));
        const contentMatch = exactWordPattern.test(plainContent.toLowerCase());

        return titleMatch || tagMatch || contentMatch;
      } else {
        // For regular searches (without quotes), use word boundary
        const wordPattern = new RegExp(`\\b${searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');

        // Check for whole word matches
        const titleMatch = wordPattern.test(post.title.toLowerCase());
        const tagMatch = post.tags.some(tag => wordPattern.test(tag.toLowerCase()));
        const contentMatch = wordPattern.test(plainContent.toLowerCase());

        return titleMatch || tagMatch || contentMatch;
      }
    });

    // Use original search term for display, but handle quotes for highlighting
    const highlightTerm = isExactMatch ? exactSearchTerm : searchTerm;
    renderPosts(filteredPosts, null, highlightTerm, isExactMatch);

    // Show message when no results
    const postsContainer = document.getElementById("posts-list");
    if (filteredPosts.length === 0) {
      postsContainer.innerHTML = `<p>No posts found matching <strong>${isExactMatch ? `"${exactSearchTerm}"` : searchTerm}</strong>. Try a different search term.</p>`;
    }
  };

  // Event handler for input (typing)
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);

    // Debounce search to prevent excessive rendering on each keystroke
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 300); // 300ms debounce delay
  });

  // Event handler for Enter key press
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(searchTimeout);
      performSearch(searchInput.value);
    }
  });

  // Add clear button functionality
  const clearButton = document.querySelector('.search-clear');
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      clearAllActiveStates();
      renderPosts(posts);
      searchInput.focus();
    });
  }
}


// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  setThemePreference();
  createThemeToggle();

  const posts = await loadPosts();
  renderPosts(posts);
  renderTags(posts);
  renderTimeline(posts);
  setupTagsToggle();
  setupSearch(posts);
});

