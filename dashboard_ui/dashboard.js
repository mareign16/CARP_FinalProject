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

  const chartTypeEl = document.getElementById('chartType');
  if (chartTypeEl) {
    chartTypeEl.addEventListener('change', (event) => {
      renderAnalyticsChart(event.target.value);
    });
    renderAnalyticsChart(chartTypeEl.value);
  }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
  initializeDashboard();
}

// ==================== ANALYTICS CHART TOGGLE ====================

const ANALYTICS_DATA = {
  temperature: {
    values: [26, 27, 28, 29, 30, 31, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19],
    unit: '°C',
  },
  humidity: {
    values: [65, 62, 58, 55, 52, 48, 45, 42, 40, 38, 36, 38, 42, 48, 55, 60, 65, 68, 70],
    unit: '%',
  },
  uv: {
    values: [0, 1, 2, 3, 5, 7, 8, 7, 6, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0],
    unit: 'UV Index',
  },
  rain: {
    values: [0, 0, 0, 0, 0.2, 0.5, 1, 2, 3, 2, 1, 0.5, 0.2, 0, 0, 0, 0, 0, 0],
    unit: 'mm',
  },
};

const CHART_LABELS = ['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM'];

function renderAnalyticsChart(type) {
  const chartArea = document.getElementById('analyticsChartArea');
  if (!chartArea || !ANALYTICS_DATA[type]) {
    return;
  }

  const data = ANALYTICS_DATA[type].values;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue('--color-primary').trim() || '#EA9D63';
  const secondary = styles.getPropertyValue('--color-secondary').trim() || '#4a6b7f';
  const muted = styles.getPropertyValue('--color-muted').trim() || '#6b7f8f';
  const borderColor = styles.getPropertyValue('--color-border').trim() || '#e5e7eb';
  const chartHeight = 220;
  const leftPadding = 40;
  const rightPadding = 20;
  const topPadding = 20;
  const bottomPadding = 30;
  const pointSpacing = 120; // 1-hour spacing
  const chartWidth = leftPadding + rightPadding + pointSpacing * (data.length - 1);
  const drawWidth = chartWidth - leftPadding - rightPadding;
  const drawHeight = chartHeight - topPadding - bottomPadding;

  const points = data
    .map((value, idx) => {
      const x = leftPadding + (drawWidth / (data.length - 1)) * idx;
      const y = topPadding + drawHeight - ((value - min) / range) * drawHeight;
      return `${x},${y}`;
    })
    .join(' ');

  const pointCircles = data
    .map((value, idx) => {
      const x = leftPadding + (drawWidth / (data.length - 1)) * idx;
      const y = topPadding + drawHeight - ((value - min) / range) * drawHeight;
      return `<circle cx="${x}" cy="${y}" r="4" fill="${secondary}"><title>${value} ${ANALYTICS_DATA[type].unit}</title></circle>`;
    })
    .join('');

  const yAxisLabels = '';

  const xAxisLabels = CHART_LABELS
    .map((label, idx) => {
      const x = leftPadding + (drawWidth / (CHART_LABELS.length - 1)) * idx;
      return `<text x="${x}" y="${chartHeight - 8}" text-anchor="middle" font-size="11" fill="${muted}">${label}</text>`;
    })
    .join('');

  const gridLines = 5;
  const gridSvgLines = Array.from({ length: gridLines }, (_, i) => {
    const y = topPadding + (drawHeight / (gridLines - 1)) * i;
    return `<line x1="${leftPadding}" y1="${y}" x2="${chartWidth - rightPadding}" y2="${y}" />`;
  }).join('');

  const svg = `
    <svg width="${chartWidth}" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}" preserveAspectRatio="none" aria-label="${type} analytics chart">
      <defs>
        <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.35" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0.08" />
        </linearGradient>
      </defs>
      <g stroke="${borderColor}" stroke-width="1">
        ${gridSvgLines}
      </g>
      <g class="y-axis-labels">${yAxisLabels}</g>
      <polyline points="${points}" fill="url(#analyticsGradient)" stroke="${secondary}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      ${pointCircles}
      <g class="x-axis-labels">${xAxisLabels}</g>
    </svg>
  `;

  const titleEl = document.getElementById('analyticsTitle');
  if (titleEl) {
    titleEl.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} trend`;
  }

  const legendValues = Array.from({ length: gridLines }, (_, i) => {
    const ratio = 1 - i / (gridLines - 1);
    const value = min + ratio * (max - min);
    return Math.round(value);
  });

  const legendHtml = `
    <div class="analytics-chart-legend">
      ${legendValues.map((value) => `<span>${value} ${ANALYTICS_DATA[type].unit}</span>`).join('')}
    </div>
  `;

  chartArea.innerHTML = `
    ${legendHtml}
    <div class="analytics-chart-view" id="analyticsChartView">
      ${svg}
    </div>
  `;

  const scrollBar = document.getElementById('analyticsScrollbar');
  const scrollContent = document.getElementById('analyticsScrollContent');
  const chartView = document.getElementById('analyticsChartView');
  const chartSvg = chartView ? chartView.querySelector('svg') : null;

  if (scrollContent) {
    scrollContent.style.width = `${chartWidth}px`;
  }

  if (scrollBar && chartView && chartSvg) {
    const updateChartTranslate = () => {
      const maxScroll = scrollBar.scrollWidth - scrollBar.clientWidth;
      const percentage = maxScroll > 0 ? scrollBar.scrollLeft / maxScroll : 0;
      const chartMaxTranslate = Math.max(0, chartSvg.clientWidth - chartView.clientWidth);
      chartSvg.style.transform = `translateX(-${percentage * chartMaxTranslate}px)`;
    };

    scrollBar.addEventListener('scroll', updateChartTranslate);

    const snapToEnd = () => {
      const target = scrollBar.scrollWidth - scrollBar.clientWidth;
      scrollBar.scrollLeft = target > 0 ? target : 0;
      updateChartTranslate();
    };

    snapToEnd();
    window.addEventListener('resize', snapToEnd);
  }
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
