/**
 * TrackWise - Expense Tracker Frontend Application
 * Strictly Non-Blue Color Palette (Emerald, Amber, Terracotta, Amethyst, Crimson)
 */

// Application State
const state = {
  expenses: [],
  summary: null,
  calendarDays: {},
  currentPeriod: 'all', // 'all', 'today', 'month', 'year'
  selectedDate: null,   // YYYY-MM-DD when clicked in calendar
  selectedCategory: 'All',
  searchQuery: '',
  sortOrder: 'date-desc',
  calendarDate: new Date(), // tracks month/year viewed in calendar
  currency: localStorage.getItem('trackwise_currency') || '₹',
  theme: localStorage.getItem('trackwise_theme') || 'dark',
  editingExpenseId: null,
  deleteExpenseId: null,
  categoryChart: null,
  trendChart: null
};

// Category Configuration (strictly non-blue)
const CATEGORY_CONFIG = {
  'Food': {
    name: 'Food',
    icon: '🍔',
    color: '#ea580c', // Warm Orange
    cssClass: 'food'
  },
  'Cloths': {
    name: 'Cloths',
    icon: '👕',
    color: '#8b5cf6', // Amethyst Purple
    cssClass: 'cloths'
  },
  'Medical': {
    name: 'Medical',
    icon: '💊',
    color: '#e11d48', // Crimson Rose
    cssClass: 'medical'
  },
  'Enjoyment': {
    name: 'Enjoyment',
    icon: '🎮',
    color: '#f59e0b', // Honey Gold
    cssClass: 'enjoyment'
  },
  'Fees': {
    name: 'Fees',
    icon: '🎓',
    color: '#10b981', // Emerald Green
    cssClass: 'fees'
  },
  'Travelling': {
    name: 'Travelling',
    icon: '✈️',
    color: '#059669', // Forest Mint
    cssClass: 'travelling'
  },
  'Other': {
    name: 'Other',
    icon: '✨',
    color: '#c026d3', // Plum / Fuchsia
    cssClass: 'other'
  }
};

// ======================== DOM Elements ======================== //
const elements = {
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  currencySelector: document.getElementById('currencySelector'),
  exportCsvBtn: document.getElementById('exportCsvBtn'),
  openAddModalBtn: document.getElementById('openAddModalBtn'),

  // Summary displays
  dailyTotalDisplay: document.getElementById('dailyTotalDisplay'),
  dailyDateDisplay: document.getElementById('dailyDateDisplay'),
  monthlyTotalDisplay: document.getElementById('monthlyTotalDisplay'),
  monthlyNameDisplay: document.getElementById('monthlyNameDisplay'),
  yearlyTotalDisplay: document.getElementById('yearlyTotalDisplay'),
  yearlyNameDisplay: document.getElementById('yearlyNameDisplay'),
  allTimeTotalDisplay: document.getElementById('allTimeTotalDisplay'),
  totalCountTag: document.getElementById('totalCountTag'),
  topCategoryDisplay: document.getElementById('topCategoryDisplay'),

  // Calendar
  calPrevBtn: document.getElementById('calPrevBtn'),
  calNextBtn: document.getElementById('calNextBtn'),
  calTodayBtn: document.getElementById('calTodayBtn'),
  calCurrentMonthYear: document.getElementById('calCurrentMonthYear'),
  calendarGrid: document.getElementById('calendarGrid'),
  activeDateBanner: document.getElementById('activeDateBanner'),
  selectedDateLabel: document.getElementById('selectedDateLabel'),
  clearDateFilterBtn: document.getElementById('clearDateFilterBtn'),

  // Expenses & Filters
  filterTabs: document.querySelectorAll('.filter-tab'),
  searchInput: document.getElementById('searchInput'),
  categoryFilter: document.getElementById('categoryFilter'),
  sortSelector: document.getElementById('sortSelector'),
  expenseListContainer: document.getElementById('expenseListContainer'),
  emptyState: document.getElementById('emptyState'),
  emptyAddBtn: document.getElementById('emptyAddBtn'),
  filteredCountBadge: document.getElementById('filteredCountBadge'),

  // Form
  expenseForm: document.getElementById('expenseForm'),
  expenseId: document.getElementById('expenseId'),
  expenseAmount: document.getElementById('expenseAmount'),
  expenseCategory: document.getElementById('expenseCategory'),
  otherCategoryGroup: document.getElementById('otherCategoryGroup'),
  otherCategoryName: document.getElementById('otherCategoryName'),
  expenseDate: document.getElementById('expenseDate'),
  paymentMethod: document.getElementById('paymentMethod'),
  expenseDescription: document.getElementById('expenseDescription'),
  submitExpenseBtn: document.getElementById('submitExpenseBtn'),
  btnSubmitText: document.getElementById('btnSubmitText'),
  cancelEditBtn: document.getElementById('cancelEditBtn'),
  amountPrefix: document.getElementById('amountPrefix'),
  currencyLabelSpans: document.querySelectorAll('.currency-label-span'),
  quickChips: document.querySelectorAll('.quick-chip'),

  // Charts
  categoryDonutCanvas: document.getElementById('categoryDonutChart'),
  monthlyTrendCanvas: document.getElementById('monthlyTrendChart'),
  categoryProgressList: document.getElementById('categoryProgressList'),
  trendYearLabel: document.getElementById('trendYearLabel'),
  resetSampleDataBtn: document.getElementById('resetSampleDataBtn'),

  // Delete modal
  deleteModal: document.getElementById('deleteModal'),
  deleteModalMessage: document.getElementById('deleteModalMessage'),
  confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
  cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),

  // Toast
  toastContainer: document.getElementById('toastContainer')
};

// ======================== Helper Utilities ======================== //

// Format currency
function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `${state.currency}${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Format date nicely (e.g., "16 Oct 2026")
function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Get today's ISO date string (YYYY-MM-DD)
function getTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Show Toast
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
  toast.innerHTML = `
    <span>${type === 'error' ? '⚠️' : '✓'}</span>
    <span>${message}</span>
  `;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// ======================== Theme Management ======================== //
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('trackwise_theme', theme);
  if (state.categoryChart) updateCharts();
}

elements.themeToggleBtn.addEventListener('click', () => {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
});

// Currency Selection
elements.currencySelector.value = state.currency;
elements.amountPrefix.textContent = state.currency;
elements.currencyLabelSpans.forEach(el => el.textContent = state.currency);

elements.currencySelector.addEventListener('change', (e) => {
  state.currency = e.target.value;
  localStorage.setItem('trackwise_currency', state.currency);
  elements.amountPrefix.textContent = state.currency;
  elements.currencyLabelSpans.forEach(el => el.textContent = state.currency);
  renderSummary();
  renderExpensesList();
  renderCalendar();
  updateCharts();
});

// ======================== API Operations ======================== //

// Fetch all data
async function loadAllData() {
  await Promise.all([
    fetchExpenses(),
    fetchSummary(),
    fetchCalendarData()
  ]);
}

// Fetch Expenses list with current filters
async function fetchExpenses() {
  try {
    const params = new URLSearchParams();

    if (state.selectedDate) {
      params.append('date', state.selectedDate);
    } else if (state.currentPeriod === 'today') {
      params.append('date', getTodayISO());
    } else if (state.currentPeriod === 'month') {
      const now = new Date();
      params.append('year', now.getFullYear());
      params.append('month', now.getMonth() + 1);
    } else if (state.currentPeriod === 'year') {
      params.append('year', new Date().getFullYear());
    }

    if (state.selectedCategory && state.selectedCategory !== 'All') {
      params.append('category', state.selectedCategory);
    }

    if (state.searchQuery) {
      params.append('search', state.searchQuery);
    }

    if (state.sortOrder) {
      params.append('sort', state.sortOrder);
    }

    const res = await fetch(`/api/expenses?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load expenses');
    state.expenses = await res.json();
    renderExpensesList();
  } catch (err) {
    console.error(err);
    showToast('Error loading expenses', 'error');
  }
}

// Fetch Summary Stats
async function fetchSummary() {
  try {
    const now = new Date();
    const res = await fetch(`/api/expenses/summary?year=${now.getFullYear()}&month=${now.getMonth() + 1}&date=${getTodayISO()}`);
    if (!res.ok) throw new Error('Failed to load summary');
    state.summary = await res.json();
    renderSummary();
    renderCategoryProgressBars();
    updateCharts();
  } catch (err) {
    console.error(err);
  }
}

// Fetch Calendar Data for currently viewed month
async function fetchCalendarData() {
  try {
    const year = state.calendarDate.getFullYear();
    const month = state.calendarDate.getMonth() + 1;
    const res = await fetch(`/api/expenses/calendar?year=${year}&month=${month}`);
    if (!res.ok) throw new Error('Failed to load calendar data');
    const data = await res.json();
    state.calendarDays = data.days || {};
    renderCalendar();
  } catch (err) {
    console.error(err);
  }
}

// ======================== Rendering Functions ======================== //

// Render Summary Cards
function renderSummary() {
  if (!state.summary) return;

  elements.dailyTotalDisplay.textContent = formatCurrency(state.summary.dailyTotal);
  elements.monthlyTotalDisplay.textContent = formatCurrency(state.summary.monthlyTotal);
  elements.yearlyTotalDisplay.textContent = formatCurrency(state.summary.yearlyTotal);
  elements.allTimeTotalDisplay.textContent = formatCurrency(state.summary.allTimeTotal);

  elements.totalCountTag.textContent = `${state.summary.totalCount} records`;

  const topCat = state.summary.topCategory;
  if (topCat && topCat !== 'None') {
    const catConf = CATEGORY_CONFIG[topCat] || { name: topCat, icon: '🏷️' };
    elements.topCategoryDisplay.textContent = `${catConf.icon} ${catConf.name} (${formatCurrency(state.summary.topCategoryAmount)})`;
  } else {
    elements.topCategoryDisplay.textContent = 'None yet';
  }

  // Update date labels on cards
  const now = new Date();
  elements.dailyDateDisplay.textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  elements.monthlyNameDisplay.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  elements.yearlyNameDisplay.textContent = `Year ${now.getFullYear()}`;
  elements.trendYearLabel.textContent = now.getFullYear();
}

// Render Calendar Grid
function renderCalendar() {
  const current = state.calendarDate;
  const year = current.getFullYear();
  const month = current.getMonth();

  // Label: e.g. "October 2026"
  elements.calCurrentMonthYear.textContent = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Clear previous grid
  elements.calendarGrid.innerHTML = '';

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const todayISO = getTodayISO();

  // Prev month padding cells
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthTotalDays - i;
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell other-month';
    cell.innerHTML = `<span class="cal-day-number">${dayNum}</span>`;
    elements.calendarGrid.appendChild(cell);
  }

  // Current month day cells
  for (let day = 1; day <= totalDays; day++) {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    const dateISO = `${year}-${monthStr}-${dayStr}`;

    const cell = document.createElement('div');
    cell.className = 'cal-day-cell';
    cell.dataset.date = dateISO;

    const isToday = dateISO === todayISO;
    const isSelected = dateISO === state.selectedDate;
    if (isToday) cell.classList.add('is-today');
    if (isSelected) cell.classList.add('is-selected');

    const dayExpenseInfo = state.calendarDays[dateISO];

    let contentHTML = `<span class="cal-day-number">${day}</span>`;

    if (dayExpenseInfo && dayExpenseInfo.total > 0) {
      contentHTML += `
        <div class="cal-day-spend" title="${dayExpenseInfo.count} expenses: ${formatCurrency(dayExpenseInfo.total)}">
          ${state.currency}${Math.round(dayExpenseInfo.total)}
        </div>
        <div class="cal-day-dot"></div>
      `;
    }

    cell.innerHTML = contentHTML;

    // Click handler to filter by day
    cell.addEventListener('click', () => {
      onCalendarDayClicked(dateISO);
    });

    elements.calendarGrid.appendChild(cell);
  }

  // Update active date banner
  if (state.selectedDate) {
    elements.activeDateBanner.style.display = 'flex';
    elements.selectedDateLabel.textContent = formatDateDisplay(state.selectedDate);
  } else {
    elements.activeDateBanner.style.display = 'none';
  }
}

// Handle Calendar Day Click
function onCalendarDayClicked(dateISO) {
  if (state.selectedDate === dateISO) {
    // Deselect if already selected
    state.selectedDate = null;
  } else {
    state.selectedDate = dateISO;
    // Set form date to selected day for fast add!
    elements.expenseDate.value = dateISO;
  }
  // Clear period button active highlights when a specific date is active
  elements.filterTabs.forEach(t => t.classList.remove('active'));
  renderCalendar();
  fetchExpenses();
}

// Clear Date Filter
elements.clearDateFilterBtn.addEventListener('click', () => {
  state.selectedDate = null;
  state.currentPeriod = 'all';
  elements.filterTabs.forEach(t => {
    if (t.dataset.period === 'all') t.classList.add('active');
    else t.classList.remove('active');
  });
  renderCalendar();
  fetchExpenses();
});

// Calendar Navigation
elements.calPrevBtn.addEventListener('click', () => {
  state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
  fetchCalendarData();
});

elements.calNextBtn.addEventListener('click', () => {
  state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
  fetchCalendarData();
});

elements.calTodayBtn.addEventListener('click', () => {
  state.calendarDate = new Date();
  state.selectedDate = getTodayISO();
  fetchCalendarData();
  fetchExpenses();
});

// Render Expenses List
function renderExpensesList() {
  const container = elements.expenseListContainer;
  container.innerHTML = '';

  elements.filteredCountBadge.textContent = `${state.expenses.length} items`;

  if (state.expenses.length === 0) {
    elements.emptyState.style.display = 'block';
    return;
  }

  elements.emptyState.style.display = 'none';

  state.expenses.forEach(exp => {
    const config = CATEGORY_CONFIG[exp.category] || CATEGORY_CONFIG['Other'];
    const isOther = exp.category === 'Other';
    const displayCategoryTitle = isOther && exp.otherCategoryName ? exp.otherCategoryName : config.name;

    const item = document.createElement('div');
    item.className = 'expense-item';

    item.innerHTML = `
      <div class="expense-item-left">
        <div class="cat-avatar ${config.cssClass}" title="${exp.category}">
          ${config.icon}
        </div>
        <div class="expense-meta">
          <div class="expense-title-row">
            <span class="expense-category-name">${escapeHTML(displayCategoryTitle)}</span>
            ${isOther ? `<span class="cat-pill pill-other">Custom</span>` : ''}
          </div>
          ${exp.description ? `<div class="expense-desc" title="${escapeHTML(exp.description)}">${escapeHTML(exp.description)}</div>` : ''}
          <div class="expense-subline">
            <span>📅 ${formatDateDisplay(exp.date)}</span>
            <span>•</span>
            <span>💳 ${escapeHTML(exp.paymentMethod || 'Cash')}</span>
          </div>
        </div>
      </div>

      <div class="expense-item-right">
        <div class="expense-amount-tag">${formatCurrency(exp.amount)}</div>
        <div class="expense-action-buttons">
          <button class="action-icon-btn edit-btn" title="Edit expense" data-id="${exp.id}">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button class="action-icon-btn delete-btn" title="Delete expense" data-id="${exp.id}">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Edit button event
    item.querySelector('.edit-btn').addEventListener('click', () => startEditing(exp));

    // Delete button event
    item.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(exp.id, displayCategoryTitle, exp.amount));

    container.appendChild(item);
  });
}

// Render Category Progress Bars
function renderCategoryProgressBars() {
  if (!state.summary) return;
  const container = elements.categoryProgressList;
  container.innerHTML = '';

  const totals = state.summary.categoryTotals || {};
  const totalSpend = state.summary.allTimeTotal || 1;

  for (const [cat, amt] of Object.entries(totals)) {
    if (amt <= 0) continue;
    const conf = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Other'];
    const pct = ((amt / totalSpend) * 100).toFixed(1);

    const barItem = document.createElement('div');
    barItem.className = 'cat-bar-item';
    barItem.innerHTML = `
      <div class="cat-bar-label">
        <span>${conf.icon} ${conf.name}</span>
        <span>${formatCurrency(amt)} <small>(${pct}%)</small></span>
      </div>
      <div class="cat-bar-track">
        <div class="cat-bar-fill" style="width: ${pct}%; background-color: ${conf.color}"></div>
      </div>
    `;
    container.appendChild(barItem);
  }
}

// ======================== Charts Integration (Strictly Non-Blue) ======================== //
function updateCharts() {
  if (!state.summary) return;

  const isLight = state.theme === 'light';
  const textColor = isLight ? '#19241d' : '#f2f5f3';
  const gridColor = isLight ? 'rgba(74, 92, 81, 0.12)' : 'rgba(156, 176, 164, 0.12)';

  // 1. Category Donut Chart
  const categoryLabels = [];
  const categoryData = [];
  const categoryColors = [];

  const totals = state.summary.categoryTotals || {};
  for (const [cat, amt] of Object.entries(totals)) {
    if (amt > 0) {
      const conf = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Other'];
      categoryLabels.push(`${conf.icon} ${conf.name}`);
      categoryData.push(amt);
      categoryColors.push(conf.color);
    }
  }

  if (state.categoryChart) {
    state.categoryChart.destroy();
  }

  const donutCtx = elements.categoryDonutCanvas.getContext('2d');
  state.categoryChart = new Chart(donutCtx, {
    type: 'doughnut',
    data: {
      labels: categoryLabels.length ? categoryLabels : ['No Expenses'],
      datasets: [{
        data: categoryData.length ? categoryData : [1],
        backgroundColor: categoryColors.length ? categoryColors : ['#242f28'],
        borderWidth: 2,
        borderColor: isLight ? '#ede7da' : '#141a16'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 600 },
            boxWidth: 12,
            padding: 10
          }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const val = ctx.parsed || 0;
              return ` ${formatCurrency(val)}`;
            }
          }
        }
      },
      cutout: '68%'
    }
  });

  // 2. Annual Monthly Trend Bar Chart
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendData = state.summary.monthlyTrend || Array(12).fill(0);

  if (state.trendChart) {
    state.trendChart.destroy();
  }

  const trendCtx = elements.monthlyTrendCanvas.getContext('2d');
  state.trendChart = new Chart(trendCtx, {
    type: 'bar',
    data: {
      labels: monthNames,
      datasets: [{
        label: 'Monthly Spend',
        data: trendData,
        backgroundColor: '#10b981',
        hoverBackgroundColor: '#f59e0b',
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ` Total: ${formatCurrency(ctx.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: "'Plus Jakarta Sans', sans-serif", size: 10 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 10 },
            callback: (v) => `${state.currency}${v}`
          }
        }
      }
    }
  });
}

// ======================== Form & CRUD Handlers ======================== //

// Show / Hide "Other" category input
elements.expenseCategory.addEventListener('change', (e) => {
  if (e.target.value === 'Other') {
    elements.otherCategoryGroup.style.display = 'block';
    elements.otherCategoryName.required = true;
    elements.otherCategoryName.focus();
  } else {
    elements.otherCategoryGroup.style.display = 'none';
    elements.otherCategoryName.required = false;
    elements.otherCategoryName.value = '';
  }
});

// Quick amount chips (+100, +500, etc.)
elements.quickChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const addAmt = parseFloat(chip.dataset.amt) || 0;
    const currentAmt = parseFloat(elements.expenseAmount.value) || 0;
    elements.expenseAmount.value = (currentAmt + addAmt).toFixed(0);
  });
});

// Form Submission (Add or Update)
elements.expenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const amount = parseFloat(elements.expenseAmount.value);
  const category = elements.expenseCategory.value;
  const otherName = elements.otherCategoryName.value.trim();
  const date = elements.expenseDate.value;
  const paymentMethod = elements.paymentMethod.value;
  const description = elements.expenseDescription.value.trim();

  if (isNaN(amount) || amount <= 0) {
    showToast('Please enter a valid amount', 'error');
    return;
  }

  if (!category) {
    showToast('Please select a category', 'error');
    return;
  }

  if (category === 'Other' && !otherName) {
    showToast('Please specify the custom category name', 'error');
    elements.otherCategoryName.focus();
    return;
  }

  const payload = {
    amount,
    category,
    otherCategoryName: category === 'Other' ? otherName : '',
    date,
    paymentMethod,
    description
  };

  try {
    elements.submitExpenseBtn.disabled = true;

    if (state.editingExpenseId) {
      // UPDATE
      const res = await fetch(`/api/expenses/${state.editingExpenseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update expense');
      showToast('Expense updated successfully!');
      cancelEditing();
    } else {
      // CREATE
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create expense');
      showToast('Expense recorded successfully!');
      resetForm();
    }

    await loadAllData();
  } catch (err) {
    console.error(err);
    showToast('Failed to save expense', 'error');
  } finally {
    elements.submitExpenseBtn.disabled = false;
  }
});

// Start Editing an Expense
function startEditing(expense) {
  state.editingExpenseId = expense.id;
  elements.expenseId.value = expense.id;
  elements.expenseAmount.value = expense.amount;
  elements.expenseCategory.value = expense.category;

  if (expense.category === 'Other') {
    elements.otherCategoryGroup.style.display = 'block';
    elements.otherCategoryName.required = true;
    elements.otherCategoryName.value = expense.otherCategoryName || '';
  } else {
    elements.otherCategoryGroup.style.display = 'none';
    elements.otherCategoryName.required = false;
  }

  elements.expenseDate.value = expense.date;
  elements.paymentMethod.value = expense.paymentMethod || 'Cash';
  elements.expenseDescription.value = expense.description || '';

  elements.btnSubmitText.textContent = 'Update Expense';
  elements.cancelEditBtn.style.display = 'block';

  // Scroll to form smoothly
  elements.expenseForm.scrollIntoView({ behavior: 'smooth' });
}

// Cancel Editing
function cancelEditing() {
  state.editingExpenseId = null;
  resetForm();
  elements.btnSubmitText.textContent = 'Save Expense';
  elements.cancelEditBtn.style.display = 'none';
}

elements.cancelEditBtn.addEventListener('click', cancelEditing);

function resetForm() {
  elements.expenseForm.reset();
  elements.expenseId.value = '';
  elements.expenseDate.value = state.selectedDate || getTodayISO();
  elements.otherCategoryGroup.style.display = 'none';
  elements.otherCategoryName.required = false;
  elements.paymentMethod.value = 'UPI';
}

// Open Delete Modal
function openDeleteModal(id, title, amount) {
  state.deleteExpenseId = id;
  elements.deleteModalMessage.textContent = `Are you sure you want to delete ${title} (${formatCurrency(amount)})?`;
  elements.deleteModal.style.display = 'flex';
}

elements.cancelDeleteBtn.addEventListener('click', () => {
  elements.deleteModal.style.display = 'none';
  state.deleteExpenseId = null;
});

elements.confirmDeleteBtn.addEventListener('click', async () => {
  if (!state.deleteExpenseId) return;
  try {
    const res = await fetch(`/api/expenses/${state.deleteExpenseId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    showToast('Expense removed');
    elements.deleteModal.style.display = 'none';
    state.deleteExpenseId = null;
    await loadAllData();
  } catch (err) {
    console.error(err);
    showToast('Failed to delete expense', 'error');
  }
});

// Quick period filter tabs (All, Today, This Month, This Year)
elements.filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    elements.filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.currentPeriod = tab.dataset.period;
    state.selectedDate = null; // reset specific calendar day
    renderCalendar();
    fetchExpenses();
  });
});

// Category filter dropdown
elements.categoryFilter.addEventListener('change', (e) => {
  state.selectedCategory = e.target.value;
  fetchExpenses();
});

// Search input
let searchDebounce;
elements.searchInput.addEventListener('input', (e) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    state.searchQuery = e.target.value.trim();
    fetchExpenses();
  }, 250);
});

// Sort Selector
elements.sortSelector.addEventListener('change', (e) => {
  state.sortOrder = e.target.value;
  fetchExpenses();
});

// Export CSV Button
elements.exportCsvBtn.addEventListener('click', () => {
  window.location.href = '/api/expenses/export';
});

// Add Modal button (scrolls to form)
elements.openAddModalBtn.addEventListener('click', () => {
  elements.expenseForm.scrollIntoView({ behavior: 'smooth' });
  elements.expenseAmount.focus();
});

elements.emptyAddBtn.addEventListener('click', () => {
  elements.expenseForm.scrollIntoView({ behavior: 'smooth' });
  elements.expenseAmount.focus();
});

// Reset Sample Data
elements.resetSampleDataBtn.addEventListener('click', async () => {
  if (confirm('Reset to initial sample expenses? Any custom modifications will be reloaded with demo data.')) {
    try {
      const res = await fetch('/api/expenses/reset-sample', { method: 'POST' });
      if (!res.ok) throw new Error('Reset failed');
      showToast('Sample data restored successfully');
      await loadAllData();
    } catch (err) {
      console.error(err);
      showToast('Failed to restore data', 'error');
    }
  }
});

// Utility to escape HTML preventing XSS
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ======================== Initial App Bootstrap ======================== //
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);
  elements.expenseDate.value = getTodayISO();
  loadAllData();
});
