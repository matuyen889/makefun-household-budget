// Core Household Budget Dataset: The Miller Family (4 members: Marcus, Elena, Leo, Maya)

export const initialHouseholdData = {
  profile: {
    familyName: 'The Miller Family',
    currency: '$',
    period: 'November 2026',
    members: ['Marcus', 'Elena', 'Leo (10)', 'Maya (7)', 'Shared']
  },
  income: {
    sources: [
      { id: 'inc-1', name: 'Marcus - Software Lead Salary', amount: 5400, frequency: 'Monthly Net', member: 'Marcus' },
      { id: 'inc-2', name: 'Elena - Senior Product UX Salary', amount: 4100, frequency: 'Monthly Net', member: 'Elena' },
      { id: 'inc-3', name: 'High-Yield Savings & Dividends', amount: 150, frequency: 'Monthly Passive', member: 'Shared' }
    ],
    totalMonthly: 9650
  },
  categories: [
    { id: 'housing', name: 'Housing & Mortgage', type: 'Needs', budgeted: 2500, color: '#3b82f6', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'groceries', name: 'Groceries & Household', type: 'Needs', budgeted: 1100, color: '#10b981', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'utilities', name: 'Utilities & Fiber Internet', type: 'Needs', budgeted: 420, color: '#06b6d4', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'transport', name: 'Transport & EV Energy', type: 'Needs', budgeted: 480, color: '#f59e0b', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 16h6a1 1 0 001-1v-5.26a1 1 0 00-.316-.728l-3.418-3.418A1 1 0 0015.56 5H13v11z' },
    { id: 'healthcare', name: 'Healthcare & Wellness', type: 'Needs', budgeted: 380, color: '#ec4899', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'education', name: 'Kids Activities & School', type: 'Needs', budgeted: 450, color: '#8b5cf6', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222' },
    { id: 'dining', name: 'Family Dining & Takeout', type: 'Wants', budgeted: 550, color: '#f97316', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'entertainment', name: 'Subscriptions & Leisure', type: 'Wants', budgeted: 220, color: '#6366f1', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'personal', name: 'Personal Care & Hobbies', type: 'Wants', budgeted: 260, color: '#14b8a6', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ],
  transactions: [
    { id: 'tx-01', date: '2026-11-01', category: 'housing', description: 'Primary Mortgage Payment (Fixed 3.2%)', member: 'Shared', amount: 2150.00, method: 'Auto-Debit' },
    { id: 'tx-02', date: '2026-11-02', category: 'groceries', description: 'Costco Wholesale Bulk Family Run', member: 'Marcus', amount: 312.45, method: 'Credit Card' },
    { id: 'tx-03', date: '2026-11-03', category: 'utilities', description: 'City Water, Sewer & Solid Waste', member: 'Shared', amount: 118.20, method: 'Auto-Debit' },
    { id: 'tx-04', date: '2026-11-05', category: 'education', description: 'Leo Martial Arts Monthly Tuition', member: 'Elena', amount: 165.00, method: 'Credit Card' },
    { id: 'tx-05', date: '2026-11-06', category: 'groceries', description: 'Trader Joe’s Weekly Produce & Dairy', member: 'Elena', amount: 142.80, method: 'Credit Card' },
    { id: 'tx-06', date: '2026-11-08', category: 'utilities', description: 'Clean Energy Electric & Heating Gas', member: 'Shared', amount: 184.60, method: 'Auto-Debit' },
    { id: 'tx-07', date: '2026-11-09', category: 'dining', description: 'Sunday Family Brunch & Artisan Bakery', member: 'Elena', amount: 78.50, method: 'Credit Card' },
    { id: 'tx-08', date: '2026-11-11', category: 'transport', description: 'Home EV Wallbox Charging (Off-Peak)', member: 'Marcus', amount: 64.20, method: 'Direct Debit' },
    { id: 'tx-09', date: '2026-11-12', category: 'healthcare', description: 'Family Pediatrician Co-pays & Rx', member: 'Marcus', amount: 95.00, method: 'FSA Card' },
    { id: 'tx-10', date: '2026-11-14', category: 'groceries', description: 'Local Farmers Market & Organic Goods', member: 'Marcus', amount: 124.30, method: 'Debit Card' },
    { id: 'tx-11', date: '2026-11-15', category: 'housing', description: 'HOA Dues & Neighborhood Park Upkeep', member: 'Shared', amount: 135.00, method: 'Auto-Debit' },
    { id: 'tx-12', date: '2026-11-16', category: 'entertainment', description: 'Streaming Bundle (Netflix, Disney, Spotify)', member: 'Elena', amount: 52.99, method: 'Credit Card' },
    { id: 'tx-13', date: '2026-11-17', category: 'education', description: 'Maya Ballet & Gymnastics Studio', member: 'Elena', amount: 140.00, method: 'Credit Card' },
    { id: 'tx-14', date: '2026-11-18', category: 'dining', description: 'Neighborhood Pizzeria Family Night', member: 'Marcus', amount: 62.40, method: 'Credit Card' },
    { id: 'tx-15', date: '2026-11-20', category: 'groceries', description: 'Whole Foods Fresh Market Essentials', member: 'Elena', amount: 189.15, method: 'Credit Card' },
    { id: 'tx-16', date: '2026-11-21', category: 'utilities', description: 'Gigabit Fiber Home Broadband', member: 'Marcus', amount: 79.99, method: 'Auto-Debit' },
    { id: 'tx-17', date: '2026-11-22', category: 'transport', description: 'Metropolitan Auto Insurance (2 Vehicles)', member: 'Shared', amount: 198.50, method: 'Auto-Debit' },
    { id: 'tx-18', date: '2026-11-23', category: 'personal', description: 'Leo & Maya Winter Outerwear & Shoes', member: 'Elena', amount: 138.40, method: 'Credit Card' },
    { id: 'tx-19', date: '2026-11-24', category: 'dining', description: 'Artisan Espresso & School Run Treats', member: 'Elena', amount: 28.75, method: 'Apple Pay' },
    { id: 'tx-20', date: '2026-11-25', category: 'healthcare', description: 'Dental Cleaning Checkups Co-pay', member: 'Marcus', amount: 120.00, method: 'HSA Card' },
    { id: 'tx-21', date: '2026-11-26', category: 'groceries', description: 'Thanksgiving Family Meal Ingredients', member: 'Shared', amount: 245.80, method: 'Credit Card' },
    { id: 'tx-22', date: '2026-11-26', category: 'entertainment', description: 'Science Museum Family Annual Pass', member: 'Marcus', amount: 135.00, method: 'Credit Card' }
  ],
  recurringBills: [
    { id: 'bill-1', name: 'Primary Home Mortgage', category: 'housing', amount: 2150.00, dueDate: '1st', autopay: true, status: 'Paid' },
    { id: 'bill-2', name: 'Clean Energy Electric & Gas', category: 'utilities', amount: 184.60, dueDate: '8th', autopay: true, status: 'Paid' },
    { id: 'bill-3', name: 'Gigabit Fiber Internet', category: 'utilities', amount: 79.99, dueDate: '21st', autopay: true, status: 'Paid' },
    { id: 'bill-4', name: 'Metropolitan Auto Insurance', category: 'transport', amount: 198.50, dueDate: '22nd', autopay: true, status: 'Paid' },
    { id: 'bill-5', name: 'Leo Martial Arts Academy', category: 'education', amount: 165.00, dueDate: '5th', autopay: true, status: 'Paid' },
    { id: 'bill-6', name: 'City Water & Trash Services', category: 'utilities', amount: 118.20, dueDate: '28th', autopay: true, status: 'Upcoming' },
    { id: 'bill-7', name: 'Family Cloud & Media Services', category: 'entertainment', amount: 52.99, dueDate: '29th', autopay: true, status: 'Upcoming' },
    { id: 'bill-8', name: 'Home Security Monitoring System', category: 'housing', amount: 45.00, dueDate: '30th', autopay: true, status: 'Upcoming' }
  ],
  savingsGoals: [
    { id: 'goal-1', title: '6-Month Emergency Runway', target: 35000, current: 31500, monthlyContribution: 600, targetDate: 'Mar 2027', category: 'Emergency', priority: 'High', color: '#10b981' },
    { id: 'goal-2', title: 'Kids 529 College Growth Fund', target: 30000, current: 22400, monthlyContribution: 500, targetDate: 'Aug 2034', category: 'Education', priority: 'High', color: '#3b82f6' },
    { id: 'goal-3', title: 'Solar Array & Battery Storage', target: 12000, current: 7800, monthlyContribution: 450, targetDate: 'Jun 2027', category: 'Home Eco', priority: 'Medium', color: '#f59e0b' },
    { id: 'goal-4', title: 'Summer National Parks Expedition', target: 4500, current: 3600, monthlyContribution: 300, targetDate: 'Jul 2027', category: 'Family Travel', priority: 'Medium', color: '#ec4899' }
  ],
  historicalCashflow: [
    { month: 'Jun 2026', income: 9400, expenses: 5350, savings: 4050, rate: 43.1 },
    { month: 'Jul 2026', income: 9400, expenses: 5820, savings: 3580, rate: 38.1 },
    { month: 'Aug 2026', income: 9550, expenses: 5410, savings: 4140, rate: 43.4 },
    { month: 'Sep 2026', income: 9550, expenses: 5290, savings: 4260, rate: 44.6 },
    { month: 'Oct 2026', income: 9650, expenses: 5180, savings: 4470, rate: 46.3 },
    { month: 'Nov 2026 (Est)', income: 9650, expenses: 5172, savings: 4478, rate: 46.4 }
  ]
};
