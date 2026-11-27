// Main Application Controller & Router
import { initialHouseholdData } from './data.js';
import { calculateSummary, calculate503020, simulateScenario } from './calculator.js';
import { renderDashboard, renderExpenses, renderGoals, renderSimulator } from './views.js';

// Application State Container
class AppStore {
  constructor() {
    this.storageKey = 'fintrack_household_data_v1';
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Storage unavailable, using initial data', e);
    }
    return JSON.parse(JSON.stringify(initialHouseholdData));
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save state', e);
    }
  }

  addTransaction(tx) {
    this.state.transactions.push({
      id: 'tx-' + Date.now(),
      date: tx.date || new Date().toISOString().split('T')[0],
      category: tx.category,
      description: tx.description,
      member: tx.member || 'Shared',
      amount: parseFloat(tx.amount) || 0,
      method: tx.method || 'Card'
    });
    this.saveState();
  }

  depositToGoal(goalId, amount) {
    const goal = this.state.savingsGoals.find(g => g.id === goalId);
    if (goal) {
      goal.current = Math.min(goal.target, goal.current + amount);
      this.saveState();
    }
  }
}

const store = new AppStore();

// Router
function getRoute() {
  const hash = window.location.hash || '#/dashboard';
  if (hash.startsWith('#/expenses')) return 'expenses';
  if (hash.startsWith('#/goals')) return 'goals';
  if (hash.startsWith('#/simulator')) return 'simulator';
  return 'dashboard';
}

function updateNavPills(activeRoute) {
  document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(el => {
    if (el.getAttribute('data-route') === activeRoute) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

function render() {
  const route = getRoute();
  updateNavPills(route);
  const mount = document.getElementById('appMount');
  if (!mount) return;

  if (route === 'expenses') {
    mount.innerHTML = renderExpenses(store.state);
  } else if (route === 'goals') {
    mount.innerHTML = renderGoals(store.state);
  } else if (route === 'simulator') {
    mount.innerHTML = renderSimulator(store.state);
    bindSimulatorEvents();
  } else {
    mount.innerHTML = renderDashboard(store.state);
  }

  bindViewEvents();
}

function bindSimulatorEvents() {
  const rangeIncome = document.getElementById('rangeIncome');
  const rangeInflation = document.getElementById('rangeInflation');
  const rangeCutWants = document.getElementById('rangeCutWants');

  if (!rangeIncome || !rangeInflation || !rangeCutWants) return;

  function updateSim() {
    const deltaInc = Number(rangeIncome.value);
    const inflation = Number(rangeInflation.value);
    const cutWants = Number(rangeCutWants.value);

    document.getElementById('lblIncomeDelta').textContent = (deltaInc > 0 ? '+' : '') + deltaInc + '%';
    document.getElementById('lblInflation').textContent = '+' + inflation + '%';
    document.getElementById('lblCutWants').textContent = '-' + cutWants + '%';

    const summary = calculateSummary(store.state.transactions, store.state.income.totalMonthly, store.state.categories);
    const rule = calculate503020(store.state.income.totalMonthly, store.state.categories, summary.categoryTotals);
    const sim = simulateScenario(store.state.income.totalMonthly, rule.needs.actual, rule.wants.actual, deltaInc, inflation, cutWants);

    document.getElementById('resIncome').textContent = '$' + sim.adjustedIncome.toLocaleString();
    document.getElementById('resExpenses').textContent = '$' + sim.totalExpenses.toLocaleString();
    document.getElementById('resSavings').textContent = '$' + sim.projectedSavings.toLocaleString();
    document.getElementById('resSavingsRate').textContent = sim.projectedSavingsRate + '%';
    document.getElementById('resRunway').textContent = sim.projectedRunway + ' Months';

    const advice = document.getElementById('simAdvice');
    if (sim.projectedSavings >= 2000) {
      advice.innerHTML = '<h4>Financial Diagnosis: Healthy & Resilient</h4><p>Under current parameters, the Miller household retains strong positive cashflow with over 8 months of emergency reserves.</p>';
      advice.className = 'advice-box good';
    } else if (sim.projectedSavings >= 0) {
      advice.innerHTML = '<h4>Financial Diagnosis: Moderate Cushion</h4><p>Cashflow remains positive, but non-essential spending should be managed closely to prevent savings stagnation.</p>';
      advice.className = 'advice-box warn';
    } else {
      advice.innerHTML = '<h4>Financial Diagnosis: Budget Deficit Warning</h4><p>Under severe shock, monthly expenses exceed income. Implement discretionary spending cuts or tap liquid buffers.</p>';
      advice.className = 'advice-box alert';
    }
  }

  rangeIncome.addEventListener('input', updateSim);
  rangeInflation.addEventListener('input', updateSim);
  rangeCutWants.addEventListener('input', updateSim);
}

function bindViewEvents() {
  // Modal triggers
  const btnOpen = document.getElementById('btnOpenModal') || document.getElementById('btnOpenModalExpenses');
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      const modal = document.getElementById('txModal');
      if (modal) modal.classList.add('open');
    });
  }

  // Quick Goal Deposits
  document.querySelectorAll('.contribute-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      store.depositToGoal(id, 250);
      render();
    });
  });
}

function initModal() {
  const modal = document.getElementById('txModal');
  const closeBtn = document.getElementById('btnCloseModal');
  const form = document.getElementById('txForm');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const desc = document.getElementById('txDesc').value.trim();
      const amt = parseFloat(document.getElementById('txAmt').value);
      const cat = document.getElementById('txCat').value;
      const member = document.getElementById('txMember').value;

      if (!desc || isNaN(amt) || amt <= 0) return;

      store.addTransaction({
        description: desc,
        amount: amt,
        category: cat,
        member: member,
        date: new Date().toISOString().split('T')[0],
        method: 'Card'
      });

      form.reset();
      modal.classList.remove('open');
      render();
    });
  }
}

// Lifecycle Init
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', () => {
  initModal();
  render();
});
