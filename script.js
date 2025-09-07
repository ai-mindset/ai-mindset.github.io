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
      document.body.classList.contains("dark-theme") ? "dark" : "light"
    );
  });
  
  document.body.appendChild(themeToggle);
}

// Fetch and parse posts
async function loadPosts() {
  try {
    const response = await fetch('/posts.json');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

// Render posts
function renderPosts(posts, filterTag = null) {
  const postsContainer = document.getElementById('posts-list');
  postsContainer.innerHTML = '';
  
  const filteredPosts = filterTag 
    ? posts.filter(post => post.tags.includes(filterTag))
    : posts;
  
  if (filteredPosts.length === 0) {
    postsContainer.innerHTML = '<p>No posts found.</p>';
    return;
  }
  
  filteredPosts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post-item';
    
    const dateElement = document.createElement('span');
    dateElement.className = 'post-date';
    dateElement.textContent = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const titleElement = document.createElement('h3');
    titleElement.className = 'post-title';
    
    const linkElement = document.createElement('a');
    linkElement.href = post.url;
    linkElement.textContent = post.title;
    
    const tagsElement = document.createElement('div');
    tagsElement.className = 'post-tags';
    
    post.tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'post-tag';
      tagElement.textContent = tag;
      tagsElement.appendChild(tagElement);
    });
    
    titleElement.appendChild(linkElement);
    postElement.appendChild(dateElement);
    postElement.appendChild(titleElement);
    postElement.appendChild(tagsElement);
    
    postsContainer.appendChild(postElement);
  });
}

// Render tags
function renderTags(posts) {
  const tagsContainer = document.getElementById('tags');
  tagsContainer.innerHTML = '';
  
  // Extract unique tags
  const allTags = posts.flatMap(post => post.tags);
  const uniqueTags = [...new Set(allTags)].sort();
  
  uniqueTags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.className = 'tag';
    tagElement.textContent = tag;
    
    tagElement.addEventListener('click', () => {
      // Check if this tag is already active
      const isActive = tagElement.classList.contains('active');
      
      // Clear active state from all tags
      document.querySelectorAll('.tag').forEach(t => {
        t.classList.remove('active');
      });
      
      // If tag wasn't active, activate it and filter posts
      // If it was already active, leave it deactivated and show all posts
      if (!isActive) {
        tagElement.classList.add('active');
        renderPosts(posts, tag);
      } else {
        // Show all posts when unselecting a tag
        renderPosts(posts);
      }
    });
    
    tagsContainer.appendChild(tagElement);
  });
  
  // Add event listener to show all button
  document.getElementById('show-all-btn').addEventListener('click', () => {
    document.querySelectorAll('.tag').forEach(t => {
      t.classList.remove('active');
    });
    renderPosts(posts);
  });
}

// Generate posts.json from markdown files
function generatePostsJson() {
  // This function is for demonstration purposes
  // In a real implementation, this would be done by a build script
  console.log('Posts data loaded from JSON file');
}

// Toggle tags visibility
function setupTagsToggle() {
  const toggleButton = document.getElementById('toggle-tags');
  const tagsContainer = document.getElementById('tags-container');
  const chevron = toggleButton.querySelector('.chevron');
  
  // Make entire header clickable
  document.querySelector('.tag-header').addEventListener('click', () => {
    tagsContainer.classList.toggle('collapsed');
    // Rotate chevron when expanded/collapsed
    if (tagsContainer.classList.contains('collapsed')) {
      chevron.style.transform = 'rotate(0deg)';
    } else {
      chevron.style.transform = 'rotate(90deg)';
    }
  });
}

// Generate timeline strip
function renderTimeline(posts) {
  const timelineContainer = document.getElementById('timeline-strip');
  if (!timelineContainer) return;
  
  // Extract dates and organize by year/month
  const dateMap = new Map();
  
  posts.forEach(post => {
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
  years.forEach(year => {
    const yearContainer = document.createElement('div');
    yearContainer.className = 'year-container';
    
    const yearLabel = document.createElement('span');
    yearLabel.className = 'year-label';
    yearLabel.textContent = year;
    yearLabel.setAttribute('data-year', year);
    yearLabel.addEventListener('click', () => {
      // Toggle year selection
      const isActive = yearLabel.classList.contains('active');
      
      // Clear all active states
      document.querySelectorAll('.year-label, .month-dot').forEach(el => {
        el.classList.remove('active');
      });
      
      if (!isActive) {
        yearLabel.classList.add('active');
        
        // Filter posts by year
        const filteredPosts = posts.filter(post => {
          const postDate = new Date(post.date);
          return postDate.getFullYear() === year;
        });
        
        renderPosts(filteredPosts);
      } else {
        // Show all posts
        renderPosts(posts);
      }
    });
    
    const monthLetters = document.createElement('div');
    monthLetters.className = 'month-letters';
    
    // Create letters for all months (0-11)
    for (let month = 0; month < 12; month++) {
      const monthLetter = document.createElement('div');
      monthLetter.className = 'month-letter';
      monthLetter.setAttribute('data-month', month);
      monthLetter.setAttribute('data-year', year);
      
      // Get first letter of month name
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
      monthLetter.textContent = monthName[0];
      monthLetter.title = monthName;
      
      // If this month has posts, mark it and make it clickable
      if (dateMap.get(year).has(month)) {
        monthLetter.classList.add('has-posts');
        
        monthLetter.addEventListener('click', () => {
          // Toggle month selection
          const isActive = monthLetter.classList.contains('active');
          
          // Clear all active states
          document.querySelectorAll('.year-label, .month-letter').forEach(el => {
            el.classList.remove('active');
          });
          
          if (!isActive) {
            monthLetter.classList.add('active');
            yearLabel.classList.add('active');
            
            // Filter posts by month and year
            const filteredPosts = posts.filter(post => {
              const postDate = new Date(post.date);
              return postDate.getFullYear() === year && postDate.getMonth() === month;
            });
            
            renderPosts(filteredPosts);
          } else {
            // Show all posts
            renderPosts(posts);
          }
        });
      }
      
      monthLetters.appendChild(monthLetter);
    }
    
    yearContainer.appendChild(yearLabel);
    yearContainer.appendChild(monthLetters);
    timelineContainer.appendChild(yearContainer);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  setThemePreference();
  createThemeToggle();
  
  const posts = await loadPosts();
  renderPosts(posts);
  renderTags(posts);
  renderTimeline(posts);
  setupTagsToggle();
});