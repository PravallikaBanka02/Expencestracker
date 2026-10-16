const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'expenses.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generate realistic default sample data
function getSampleExpenses() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // Helper to format date offset by days
  const offsetDate = (daysAgo) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dt = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dt}`;
  };

  return [
    {
      id: 'exp_' + Date.now() + '_1',
      amount: 450,
      category: 'Food',
      otherCategoryName: '',
      date: todayStr,
      description: 'Breakfast & coffee with team',
      paymentMethod: 'UPI',
      createdAt: new Date().toISOString()
    },
    {
      id: 'exp_' + Date.now() + '_2',
      amount: 1200,
      category: 'Travelling',
      otherCategoryName: '',
      date: todayStr,
      description: 'Fuel for weekly commute',
      paymentMethod: 'Card',
      createdAt: new Date().toISOString()
    },
    {
      id: 'exp_' + Date.now() + '_3',
      amount: 850,
      category: 'Medical',
      otherCategoryName: '',
      date: offsetDate(1),
      description: 'Prescription medicines & vitamins',
      paymentMethod: 'UPI',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'exp_' + Date.now() + '_4',
      amount: 2400,
      category: 'Cloths',
      otherCategoryName: '',
      date: offsetDate(3),
      description: 'Festival ethnic wear & accessories',
      paymentMethod: 'Card',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'exp_' + Date.now() + '_5',
      amount: 1500,
      category: 'Enjoyment',
      otherCategoryName: '',
      date: offsetDate(5),
      description: 'Weekend cinema and dinner',
      paymentMethod: 'Cash',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'exp_' + Date.now() + '_6',
      amount: 5000,
      category: 'Fees',
      otherCategoryName: '',
      date: offsetDate(8),
      description: 'Semester certification course fee',
      paymentMethod: 'Bank Transfer',
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
    },
    {
      id: 'exp_' + Date.now() + '_7',
      amount: 1250,
      category: 'Other',
      otherCategoryName: 'Groceries',
      date: offsetDate(2),
      description: 'Monthly pantry & dairy essentials',
      paymentMethod: 'UPI',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'exp_' + Date.now() + '_8',
      amount: 650,
      category: 'Food',
      otherCategoryName: '',
      date: offsetDate(10),
      description: 'Dinner delivery with friends',
      paymentMethod: 'UPI',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: 'exp_' + Date.now() + '_9',
      amount: 320,
      category: 'Travelling',
      otherCategoryName: '',
      date: offsetDate(12),
      description: 'Metro pass recharge',
      paymentMethod: 'UPI',
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
    },
    {
      id: 'exp_' + Date.now() + '_10',
      amount: 1999,
      category: 'Other',
      otherCategoryName: 'Gym Membership',
      date: offsetDate(18),
      description: 'Quarterly fitness center renewal',
      paymentMethod: 'Card',
      createdAt: new Date(Date.now() - 18 * 86400000).toISOString()
    }
  ];
}

// Load expenses from file
function loadExpenses() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = getSampleExpenses();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading expenses:', err);
    return [];
  }
}

// Save expenses to file
function saveExpenses(expenses) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving expenses:', err);
    return false;
  }
}

// Ensure initial file exists
loadExpenses();

// ======================== API ROUTES ======================== //

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// GET /api/expenses - List all or filtered expenses
app.get('/api/expenses', (req, res) => {
  let expenses = loadExpenses();
  const { category, search, date, month, year, startDate, endDate, sort } = req.query;

  if (category && category !== 'All') {
    expenses = expenses.filter(e => e.category.toLowerCase() === category.toLowerCase());
  }

  if (date) {
    expenses = expenses.filter(e => e.date === date);
  } else if (month && year) {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    expenses = expenses.filter(e => e.date && e.date.startsWith(prefix));
  } else if (year) {
    expenses = expenses.filter(e => e.date && e.date.startsWith(year));
  }

  if (startDate && endDate) {
    expenses = expenses.filter(e => e.date >= startDate && e.date <= endDate);
  }

  if (search) {
    const q = search.toLowerCase();
    expenses = expenses.filter(e => 
      (e.description && e.description.toLowerCase().includes(q)) ||
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.otherCategoryName && e.otherCategoryName.toLowerCase().includes(q)) ||
      (e.paymentMethod && e.paymentMethod.toLowerCase().includes(q)) ||
      String(e.amount).includes(q)
    );
  }

  // Sorting
  expenses.sort((a, b) => {
    if (sort === 'amount-desc') return b.amount - a.amount;
    if (sort === 'amount-asc') return a.amount - b.amount;
    if (sort === 'date-asc') return new Date(a.date) - new Date(b.date);
    return new Date(b.date) - new Date(a.date); // default date-desc
  });

  res.json(expenses);
});

// GET /api/expenses/summary - Aggregated stats for Daily, Monthly, Yearly
app.get('/api/expenses/summary', (req, res) => {
  const expenses = loadExpenses();
  const now = new Date();
  const targetYear = req.query.year ? parseInt(req.query.year, 10) : now.getFullYear();
  const targetMonth = req.query.month ? parseInt(req.query.month, 10) : (now.getMonth() + 1);
  const targetDay = req.query.date || `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const monthPrefix = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;
  const yearPrefix = `${targetYear}`;

  let dailyTotal = 0;
  let monthlyTotal = 0;
  let yearlyTotal = 0;
  let allTimeTotal = 0;

  const categoryTotals = {
    'Food': 0,
    'Cloths': 0,
    'Medical': 0,
    'Enjoyment': 0,
    'Fees': 0,
    'Travelling': 0,
    'Other': 0
  };

  const monthlyTrend = Array(12).fill(0);
  const otherBreakdown = {};

  expenses.forEach(e => {
    const amt = Number(e.amount) || 0;
    allTimeTotal += amt;

    if (e.date === targetDay) {
      dailyTotal += amt;
    }

    if (e.date && e.date.startsWith(monthPrefix)) {
      monthlyTotal += amt;
    }

    if (e.date && e.date.startsWith(yearPrefix)) {
      yearlyTotal += amt;

      // Extract month index for trend
      const expMonth = parseInt(e.date.split('-')[1], 10) - 1;
      if (expMonth >= 0 && expMonth < 12) {
        monthlyTrend[expMonth] += amt;
      }
    }

    // Category tracking
    const cat = e.category || 'Other';
    if (categoryTotals.hasOwnProperty(cat)) {
      categoryTotals[cat] += amt;
    } else {
      categoryTotals['Other'] += amt;
    }

    if (cat === 'Other' && e.otherCategoryName) {
      const customName = e.otherCategoryName.trim();
      otherBreakdown[customName] = (otherBreakdown[customName] || 0) + amt;
    }
  });

  // Calculate highest spending category
  let topCategory = 'None';
  let topCategoryAmount = 0;
  for (const [cat, amt] of Object.entries(categoryTotals)) {
    if (amt > topCategoryAmount) {
      topCategoryAmount = amt;
      topCategory = cat;
    }
  }

  res.json({
    selectedDate: targetDay,
    selectedMonth: targetMonth,
    selectedYear: targetYear,
    dailyTotal,
    monthlyTotal,
    yearlyTotal,
    allTimeTotal,
    totalCount: expenses.length,
    topCategory,
    topCategoryAmount,
    categoryTotals,
    otherBreakdown,
    monthlyTrend
  });
});

// GET /api/expenses/calendar - Calendar summary for a specific month and year
app.get('/api/expenses/calendar', (req, res) => {
  const expenses = loadExpenses();
  const now = new Date();
  const year = req.query.year || now.getFullYear();
  const month = req.query.month ? String(req.query.month).padStart(2, '0') : String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `${year}-${month}`;

  const dayMap = {};

  expenses.forEach(e => {
    if (e.date && e.date.startsWith(prefix)) {
      if (!dayMap[e.date]) {
        dayMap[e.date] = {
          total: 0,
          count: 0,
          categories: []
        };
      }
      dayMap[e.date].total += Number(e.amount) || 0;
      dayMap[e.date].count += 1;
      const catLabel = e.category === 'Other' && e.otherCategoryName ? e.otherCategoryName : e.category;
      if (!dayMap[e.date].categories.includes(catLabel)) {
        dayMap[e.date].categories.push(catLabel);
      }
    }
  });

  res.json({
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    days: dayMap
  });
});

// POST /api/expenses - Create new expense
app.post('/api/expenses', (req, res) => {
  const { amount, category, otherCategoryName, date, description, paymentMethod } = req.body;

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'Please enter a valid positive expense amount.' });
  }

  const validCategories = ['Food', 'Cloths', 'Medical', 'Enjoyment', 'Fees', 'Travelling', 'Other'];
  if (!category || !validCategories.includes(category)) {
    return res.status(400).json({ error: 'Please select a valid expense category.' });
  }

  if (category === 'Other' && (!otherCategoryName || !otherCategoryName.trim())) {
    return res.status(400).json({ error: 'Please specify the name for Other expense category.' });
  }

  const expenseDate = date || new Date().toISOString().split('T')[0];

  const newExpense = {
    id: 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    amount: parsedAmount,
    category,
    otherCategoryName: category === 'Other' ? (otherCategoryName || '').trim() : '',
    date: expenseDate,
    description: (description || '').trim(),
    paymentMethod: paymentMethod || 'Cash',
    createdAt: new Date().toISOString()
  };

  const expenses = loadExpenses();
  expenses.unshift(newExpense);
  saveExpenses(expenses);

  res.status(201).json(newExpense);
});

// PUT /api/expenses/:id - Update expense
app.put('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { amount, category, otherCategoryName, date, description, paymentMethod } = req.body;

  const expenses = loadExpenses();
  const index = expenses.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Expense not found.' });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'Please enter a valid positive expense amount.' });
  }

  expenses[index] = {
    ...expenses[index],
    amount: parsedAmount,
    category: category || expenses[index].category,
    otherCategoryName: category === 'Other' ? (otherCategoryName || '').trim() : '',
    date: date || expenses[index].date,
    description: description !== undefined ? description.trim() : expenses[index].description,
    paymentMethod: paymentMethod || expenses[index].paymentMethod,
    updatedAt: new Date().toISOString()
  };

  saveExpenses(expenses);
  res.json(expenses[index]);
});

// DELETE /api/expenses/:id - Delete expense
app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  let expenses = loadExpenses();
  const initialLength = expenses.length;
  expenses = expenses.filter(e => e.id !== id);

  if (expenses.length === initialLength) {
    return res.status(404).json({ error: 'Expense not found.' });
  }

  saveExpenses(expenses);
  res.json({ success: true, message: 'Expense deleted successfully.' });
});

// POST /api/expenses/reset-sample - Reset to sample expenses
app.post('/api/expenses/reset-sample', (req, res) => {
  const samples = getSampleExpenses();
  saveExpenses(samples);
  res.json({ success: true, message: 'Sample expenses restored successfully.', data: samples });
});

// GET /api/expenses/export - Export to CSV
app.get('/api/expenses/export', (req, res) => {
  const expenses = loadExpenses();
  let csv = 'ID,Date,Category,Custom Category,Amount,Payment Method,Description,Created At\n';

  expenses.forEach(e => {
    const row = [
      `"${e.id}"`,
      `"${e.date}"`,
      `"${e.category}"`,
      `"${(e.otherCategoryName || '').replace(/"/g, '""')}"`,
      e.amount,
      `"${(e.paymentMethod || '').replace(/"/g, '""')}"`,
      `"${(e.description || '').replace(/"/g, '""')}"`,
      `"${e.createdAt || ''}"`
    ].join(',');
    csv += row + '\n';
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="expenses_${new Date().toISOString().split('T')[0]}.csv"`);
  res.status(200).send(csv);
});

// Fallback to index.html for SPA-like navigation (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Expense Tracker server running on port ${PORT}`);
  console.log(`Local URL: http://localhost:${PORT}`);
});
