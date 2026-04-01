/**
 * CARP Dashboard - Overview Cards and Date Navigation
 * Generates and manages scrollable date cards
 */

// ==================== CONFIG ====================
const CONFIG = {
  TODAY: new Date('2026-04-01'),
  DAYS_RANGE: 60,      // 30 days before and after today
};

// ==================== DOM ELEMENTS ====================
const DOM = {
  scrollableCards: document.getElementById('scrollableCards'),
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format date to YYYY-MM-DD string
 */
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Format date to readable display string (e.g., "Apr 1")
 */
function formatDateDisplay(date) {
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Generate array of dates from -DAYS_RANGE/2 to +DAYS_RANGE/2 around TODAY
 */
function generateDates() {
  const dates = [];
  const startDate = new Date(CONFIG.TODAY);
  startDate.setDate(startDate.getDate() - Math.floor(CONFIG.DAYS_RANGE / 2));

  for (let i = 0; i < CONFIG.DAYS_RANGE; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
}

// ==================== CARD GENERATION ====================

/**
 * Create and populate scrollable overview cards
 */
function createOverviewCards(dates) {
  const todayStr = formatDate(CONFIG.TODAY);

  dates.forEach(date => {
    const dateStr = formatDate(date);
    const card = document.createElement('article');
    const dateDisplay = formatDateDisplay(date);
    
    card.className = 'card small';
    card.setAttribute('data-date', dateStr);
    
    // Add date content to card
    const dateContent = document.createElement('section');
    dateContent.className = 'card-date';
    dateContent.textContent = dateDisplay;
    card.appendChild(dateContent);
    
    if (dateStr === todayStr) {
      card.classList.add('today');
    }

    DOM.scrollableCards.appendChild(card);
  });
}

// ==================== EVENT LISTENERS ====================

// Event listeners initialization (scroll syncing no longer needed)

// ==================== INITIALIZATION ====================

/**
 * Initialize dashboard on page load
 */
function initializeDashboard() {
  const dates = generateDates();
  createOverviewCards(dates);
  
  // Scroll to today on load
  setTimeout(() => {
    const card = DOM.scrollableCards.querySelector(`[data-date="${formatDate(CONFIG.TODAY)}"]`);
    if (card) {
      const containerWidth = DOM.scrollableCards.parentElement.clientWidth;
      const cardWidth = card.clientWidth;
      const centerOffset = (containerWidth / 2) - (cardWidth / 2);
      DOM.scrollableCards.scrollLeft = card.offsetLeft - centerOffset;
    }
  }, 100);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
  initializeDashboard();
}

// ==================== NIGHT MODE TOGGLE ====================

/**
 * Initialize theme toggle functionality
 */
function initializeThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  
  if (!themeToggle) return;

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.classList.add('active');
  }

  // Toggle theme on button click
  themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    themeToggle.classList.toggle('active');
    
    // Save preference
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  });
}

// Initialize theme toggle when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeThemeToggle);
} else {
  initializeThemeToggle();
}
