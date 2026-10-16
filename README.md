# TrackWise - Smart Expense Tracker Web Application

A fullstack personal finance dashboard built to expand upon the original C console expense tracker with rich daily, monthly, and yearly insights, an interactive navigation calendar, custom expense categories, dynamic Chart.js analytics, and full deployment readiness for Render.

---

## ✨ Key Features

1. **Original C-Code Categories + Custom "Other" Choice**:
   - 🍔 **Food**
   - 👕 **Cloths**
   - 💊 **Medical**
   - 🎮 **Enjoyment**
   - 🎓 **Fees**
   - ✈️ **Travelling**
   - ✨ **Other (Custom Expense)**: Select "Other" to unlock an interactive input to specify any custom expense name (e.g. *Groceries*, *Gym*, *Electronics*, *Electricity Bill*, etc.).

2. **Daily, Monthly & Yearly Aggregations**:
   - **Daily Expenses**: Instant calculation of today's spending.
   - **Monthly Expenses**: Running tally for the current month.
   - **Yearly Expenses**: Cumulative annual expenditures.
   - **Top Category & All-Time**: Real-time identification of your biggest spending area.

3. **Interactive Calendar Navigation**:
   - High-contrast visual calendar grid with month-by-month and year-by-year traversal.
   - Spending indicator dots and badges display how much was spent on each day.
   - **1-Click Day Filter**: Click any day on the calendar to instantly view all transactions made on that date.
   - Clear banner with a single-click "Show All Expenses" reset.

4. **Palette Strictly Designed Without Blue**:
   - Adheres strictly to the design requirement: **no blue color and no blue/white combination**.
   - Built with an earthy, vibrant, and luxurious palette:
     - **Emerald & Jade** (`#10b981`, `#059669`)
     - **Honey Amber & Gold** (`#f59e0b`, `#d97706`)
     - **Terracotta & Tangerine** (`#ea580c`, `#c2410c`)
     - **Amethyst & Violet** (`#8b5cf6`, `#7c3aed`)
     - **Crimson & Rose** (`#e11d48`, `#be123c`)
     - **Obsidian-Forest Dark Theme** & **Warm Linen Cream Light Theme**.

5. **Additional Power Features**:
   - Multi-currency selector (₹ INR, $ USD, € EUR, £ GBP).
   - Category Donut Chart and 12-Month Spending Trend Bar Chart (powered by Chart.js).
   - Fast Search & Filter (filter by category, search text in description, custom name, or amount).
   - Edit & Delete expense with confirmation modal.
   - One-click CSV Export for record keeping.
   - Responsive design for mobile, tablet, and desktop.

---

## 🚀 Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Running Locally
1. Clone or open this project directory:
   ```bash
   cd "Expences tracker"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## ☁️ How to Deploy to Render (Step-by-Step)

The project is completely configured and ready for 100% free deployment on [Render](https://render.com/).

### Method 1: Deploy with Git (Recommended)

1. **Push your code to GitHub**:
   If you haven't initialized Git yet:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of fullstack expense tracker"
   ```
   Create a new repository on [GitHub](https://github.com/new), and run:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com) and log in.
   - Click **New +** → **Web Service**.
   - Select **Build and deploy from a Git repository** and connect your GitHub repo.
   - Render will detect the configuration or you can configure:
     - **Name**: `trackwise-expense-tracker` (or any name you like)
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: `Free`
   - Click **Deploy Web Service**.

3. **Render Blueprint (1-Click Alternative)**:
   - In Render, click **New +** → **Blueprint**.
   - Select your repository.
   - Render will automatically read `render.yaml` from the root of the project and set up everything with zero manual inputs!

Within 1-2 minutes, Render will provide you with a live URL (e.g. `https://trackwise-expense-tracker.onrender.com`).

---

## 📁 Project Architecture

```
Expences tracker/
├── data/
│   └── expenses.json       # JSON persistence store
├── public/
│   ├── css/
│   │   └── style.css       # Non-blue color palette styling & responsive layout
│   ├── js/
│   │   └── app.js          # Interactive calendar, CRUD, charts, filters
│   ├── index.html          # Web dashboard layout
│   └── favicon.svg         # Custom emerald/amber wallet icon
├── server.js               # Express backend API & aggregations
├── render.yaml             # Render Blueprint configuration
├── package.json            # Project dependencies & scripts
├── .gitignore              # Files excluded from git
├── main.c                  # Original C source code preserved
└── README.md               # Documentation & deployment guide
```

---

## 🛠️ API Endpoints

- `GET /health` - Health check endpoint for Render monitoring.
- `GET /api/expenses` - Fetch expenses (supports query filters: `category`, `search`, `date`, `month`, `year`, `sort`).
- `GET /api/expenses/summary` - Aggregated daily, monthly, yearly statistics and category totals.
- `GET /api/expenses/calendar` - Monthly calendar spending totals and transaction counts.
- `POST /api/expenses` - Create a new expense.
- `PUT /api/expenses/:id` - Edit an existing expense.
- `DELETE /api/expenses/:id` - Delete an expense.
- `GET /api/expenses/export` - Download expenses as CSV.
- `POST /api/expenses/reset-sample` - Reset demo sample data.
