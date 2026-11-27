// UI View Components for HearthBudget / FinTrack Home
import { calculateSummary, calculate503020, calculateEmergencyRunway, simulateScenario } from './calculator.js';
import { renderDonutChart, renderCashflowChart } from './charts.js';

export function renderDashboard(state) {
  const summary = calculateSummary(state.transactions, state.income.totalMonthly, state.categories);
  const rule = calculate503020(state.income.totalMonthly, state.categories, summary.categoryTotals);
  const runway = calculateEmergencyRunway(31500, rule.needs.actual);

  // Category breakdown list
  const catItems = state.categories.map(cat => {
    const spent = summary.categoryTotals[cat.id] || 0;
    const pct = summary.totalExpenses > 0 ? Math.round((spent / summary.totalExpenses) * 100) : 0;
    const budgetPct = Math.min(100, Math.round((spent / cat.budgeted) * 100));
    const isOver = spent > cat.budgeted;

    return `
      <div class=\"category-row\">
        <div class=\"cat-header\">
          <span class=\"cat-name\"><span class=\"cat-dot\" style=\"background: ${cat.color};\"></span>${cat.name}</span>
          <span class=\"cat-amount\">$${spent.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span class=\"cat-budget\">/ $${cat.budgeted}</span></span>
        </div>
        <div class=\"progress-track\">
          <div class=\"progress-fill\" style=\"width: ${budgetPct}%; background: ${isOver ? '#ef4444' : cat.color};\"></div>
        </div>
        <div class=\"cat-footer\">
          <span class=\"cat-type ${cat.type.toLowerCase()}\">${cat.type}</span>
          <span class=\"cat-pct ${isOver ? 'alert' : ''}\">${budgetPct}% of budget (${pct}% total)</span>
        </div>
      </div>
    `;
  }).join('');

  // Recurring bills list (sample upcoming)
  const billItems = state.recurringBills.map(b => `
    <div class=\"bill-card\">
      <div class=\"bill-info\">
        <div class=\"bill-name\">${b.name}</div>
        <div class=\"bill-due\">Due ${b.dueDate} of month &bull; ${b.autopay ? 'Auto-Pay On' : 'Manual Pay'}</div>
      </div>
      <div class=\"bill-action\">
        <div class=\"bill-price\">$${b.amount.toFixed(2)}</div>
        <span class=\"badge ${b.status.toLowerCase()}\">${b.status}</span>
      </div>
    </div>
  `).join('');

  return `
    <div class=\"view-container animate-fade\">
      <!-- Headline KPI Cards -->
      <div class=\"kpi-grid\">
        <div class=\"kpi-card highlight\">
          <div class=\"kpi-label\">Total Monthly Income</div>
          <div class=\"kpi-value text-emerald\">$${summary.totalIncome.toLocaleString()}</div>
          <div class=\"kpi-sub\">3 Verified Household Sources</div>
        </div>
        <div class=\"kpi-card\">
          <div class=\"kpi-label\">Total Spent (Month-to-Date)</div>
          <div class=\"kpi-value text-slate\">$${summary.totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          <div class=\"kpi-sub\">${state.transactions.length} Logged Transactions</div>
        </div>
        <div class=\"kpi-card\">
          <div class=\"kpi-label\">Net Family Savings</div>
          <div class=\"kpi-value ${summary.netSavings >= 0 ? 'text-teal' : 'text-rose'}\">$${summary.netSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          <div class=\"kpi-sub\">${summary.savingsRate}% Family Savings Rate</div>
        </div>
        <div class=\"kpi-card\">
          <div class=\"kpi-label\">Emergency Fund Runway</div>
          <div class=\"kpi-value text-indigo\">${runway} Months</div>
          <div class=\"kpi-sub\">$31,500 Liquid Capital Reserves</div>
        </div>
      </div>

      <!-- 50/30/20 Allocation Rule Section -->
      <div class=\"section-card\">
        <div class=\"section-title\">
          <h3>50/30/20 Balanced Budget Allocation</h3>
          <span class=\"badge-pill\">Active Target</span>
        </div>
        <div class=\"rule-grid\">
          <div class=\"rule-box\">
            <div class=\"rule-header\">
              <span class=\"rule-badge needs\">Needs (50% Target: $${rule.needs.target.toLocaleString()})</span>
              <span class=\"rule-status ${rule.needs.actual <= rule.needs.target ? 'ok' : 'warn'}\">${rule.needs.status}</span>
            </div>
            <div class=\"rule-val\">$${rule.needs.actual.toLocaleString(undefined, {maximumFractionDigits: 0})} (${rule.needs.percent.toFixed(1)}%)</div>
            <div class=\"progress-track\"><div class=\"progress-fill\" style=\"width: ${Math.min(100, rule.needs.percent * 2)}%; background: #3b82f6;\"></div></div>
            <p class=\"rule-desc\">Mortgage, groceries, utilities, health insurance, and transport essentials.</p>
          </div>
          <div class=\"rule-box\">
            <div class=\"rule-header\">
              <span class=\"rule-badge wants\">Wants (30% Target: $${rule.wants.target.toLocaleString()})</span>
              <span class=\"rule-status ${rule.wants.actual <= rule.wants.target ? 'ok' : 'warn'}\">${rule.wants.status}</span>
            </div>
            <div class=\"rule-val\">$${rule.wants.actual.toLocaleString(undefined, {maximumFractionDigits: 0})} (${rule.wants.percent.toFixed(1)}%)</div>
            <div class=\"progress-track\"><div class=\"progress-fill\" style=\"width: ${Math.min(100, (rule.wants.percent / 30) * 100)}%; background: #f97316;\"></div></div>
            <p class=\"rule-desc\">Family dining, weekend activities, streaming subscriptions, and hobbies.</p>
          </div>
          <div class=\"rule-box\">
            <div class=\"rule-header\">
              <span class=\"rule-badge savings\">Savings & Debt (20% Target: $${rule.savings.target.toLocaleString()})</span>
              <span class=\"rule-status ${rule.savings.actual >= rule.savings.target ? 'ok' : 'warn'}\">${rule.savings.status}</span>
            </div>
            <div class=\"rule-val\">$${rule.savings.actual.toLocaleString(undefined, {maximumFractionDigits: 0})} (${rule.savings.percent.toFixed(1)}%)</div>
            <div class=\"progress-track\"><div class=\"progress-fill\" style=\"width: ${Math.min(100, (rule.savings.percent / 20) * 100)}%; background: #10b981;\"></div></div>
            <p class=\"rule-desc\">Emergency savings, 529 college investments, and solar financing reserve.</p>
          </div>
        </div>
      </div>

      <!-- Charts & Category Breakdown Grid -->
      <div class=\"two-col-grid\">
        <div class=\"section-card\">
          <div class=\"section-title\">
            <h3>Category Spending Distribution</h3>
            <span class=\"badge-pill\">Visual Breakdown</span>
          </div>
          <div class=\"donut-wrapper\">
            ${renderDonutChart(state.categories, summary.categoryTotals, summary.totalExpenses, 280, 280)}
          </div>
          <div class=\"cat-list\">
            ${catItems}
          </div>
        </div>

        <div class=\"section-card\">
          <div class=\"section-title\">
            <h3>Upcoming Recurring Commitments</h3>
            <span class=\"badge-pill\">Fixed Bills</span>
          </div>
          <div class=\"bills-list\">
            ${billItems}
          </div>

          <div class=\"quick-action-box\">
            <h4>Have a new family expense?</h4>
            <p>Log grocery runs, utility payments, or kids extracurricular costs directly.</p>
            <button class=\"btn-primary\" id=\"btnOpenModal\">+ Log New Expense</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderExpenses(state) {
  const summary = calculateSummary(state.transactions, state.income.totalMonthly, state.categories);

  // Transactions table rows
  const rows = state.transactions.slice().reverse().map(tx => {
    const cat = state.categories.find(c => c.id === tx.category) || { name: tx.category, color: '#94a3b8' };
    return `
      <tr>
        <td><span class=\"font-mono text-muted\">${tx.date}</span></td>
        <td><strong>${tx.description}</strong></td>
        <td><span class=\"tag\" style=\"border-color: ${cat.color}; color: ${cat.color};\">${cat.name}</span></td>
        <td><span class=\"member-pill\">${tx.member}</span></td>
        <td><span class=\"text-muted\">${tx.method || 'Card'}</span></td>
        <td class=\"text-right font-bold\">$${Number(tx.amount).toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class=\"view-container animate-fade\">
      <div class=\"section-card\">
        <div class=\"section-title\">
          <div>
            <h3>6-Month Household Cashflow Momentum</h3>
            <p class=\"text-muted subtitle\">Income stability vs household spending trends over past 6 months.</p>
          </div>
          <div class=\"legend-pills\">
            <span class=\"legend-item\"><span class=\"dot green\"></span> Income Trend</span>
            <span class=\"legend-item\"><span class=\"dot red\"></span> Expense Curve</span>
          </div>
        </div>
        <div class=\"chart-container\">
          ${renderCashflowChart(state.historicalCashflow, 740, 240)}
        </div>
      </div>

      <div class=\"section-card\">
        <div class=\"section-header-bar\">
          <div>
            <h3>Monthly Transaction Ledger</h3>
            <p class=\"text-muted subtitle\">Detailed real-time log of family purchases and recurring bills.</p>
          </div>
          <div class=\"btn-group\">
            <button class=\"btn-primary\" id=\"btnOpenModalExpenses\">+ Log Transaction</button>
          </div>
        </div>

        <div class=\"table-responsive\">
          <table class=\"data-table\">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Family Member</th>
                <th>Method</th>
                <th class=\"text-right\">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function renderGoals(state) {
  const goalCards = state.savingsGoals.map(g => {
    const pct = Math.min(100, Math.round((g.current / g.target) * 100));
    const remaining = g.target - g.current;
    const monthsLeft = g.monthlyContribution > 0 ? Math.ceil(remaining / g.monthlyContribution) : 0;

    return `
      <div class=\"goal-card\">
        <div class=\"goal-header\">
          <div>
            <h4 class=\"goal-title\">${g.title}</h4>
            <span class=\"goal-cat\">${g.category} &bull; Priority: ${g.priority}</span>
          </div>
          <span class=\"badge-percent\">${pct}%</span>
        </div>
        <div class=\"goal-amounts\">
          <div class=\"current\">$${g.current.toLocaleString()}</div>
          <div class=\"target\">Target: $${g.target.toLocaleString()}</div>
        </div>
        <div class=\"progress-track large\">
          <div class=\"progress-fill\" style=\"width: ${pct}%; background: ${g.color};\"></div>
        </div>
        <div class=\"goal-footer\">
          <span><strong>$${g.monthlyContribution}/mo</strong> auto-contribution</span>
          <span class=\"eta\">Est. completion: ${g.targetDate} (${monthsLeft} mos)</span>
        </div>
        <button class=\"btn-secondary btn-sm contribute-btn\" data-id=\"${g.id}\">+ Quick Deposit $250</button>
      </div>
    `;
  }).join('');

  return `
    <div class=\"view-container animate-fade\">
      <div class=\"goals-hero\">
        <div class=\"hero-content\">
          <h3>Family Wealth & Future Security Goals</h3>
          <p>Autonomous tracking toward college 529 savings, emergency liquidity, and family vacation funds.</p>
        </div>
        <div class=\"hero-stats\">
          <div class=\"stat-box\">
            <span class=\"stat-val text-emerald\">$65,300</span>
            <span class=\"stat-lbl\">Total Goal Reserves</span>
          </div>
          <div class=\"stat-box\">
            <span class=\"stat-val text-indigo\">$1,850/mo</span>
            <span class=\"stat-lbl\">Monthly Goal Contributions</span>
          </div>
        </div>
      </div>

      <div class=\"goals-grid\">
        ${goalCards}
      </div>
    </div>
  `;
}

export function renderSimulator(state) {
  const summary = calculateSummary(state.transactions, state.income.totalMonthly, state.categories);
  const rule = calculate503020(state.income.totalMonthly, state.categories, summary.categoryTotals);

  // default initial simulation at 0 delta
  const sim = simulateScenario(state.income.totalMonthly, rule.needs.actual, rule.wants.actual, 0, 0, 0);

  return `
    <div class=\"view-container animate-fade\">
      <div class=\"section-card\">
        <div class=\"section-title\">
          <div>
            <h3>Household "What-If" Financial Resilience Simulator</h3>
            <p class=\"text-muted subtitle\">Stress test family cashflow under income shocks, inflation pressure, or discretionary spending cuts.</p>
          </div>
          <span class=\"badge-pill\">Interactive Engine</span>
        </div>

        <div class=\"sim-grid\">
          <div class=\"sim-controls\">
            <div class=\"control-group\">
              <div class=\"control-label\">
                <span>Household Income Adjustment</span>
                <span id=\"lblIncomeDelta\" class=\"slider-val\">0%</span>
              </div>
              <input type=\"range\" id=\"rangeIncome\" min=\"-30\" max=\"30\" value=\"0\" step=\"5\" class=\"range-slider\">
              <span class=\"hint\">Simulates bonus increase or temporary salary reduction.</span>
            </div>

            <div class=\"control-group\">
              <div class=\"control-label\">
                <span>Cost of Living / Inflation Bump</span>
                <span id=\"lblInflation\" class=\"slider-val\">0%</span>
              </div>
              <input type=\"range\" id=\"rangeInflation\" min=\"0\" max=\"20\" value=\"0\" step=\"2\" class=\"range-slider\">
              <span class=\"hint\">Simulates grocery and utility price shocks.</span>
            </div>

            <div class=\"control-group\">
              <div class=\"control-label\">
                <span>Discretionary Spending Reduction</span>
                <span id=\"lblCutWants\" class=\"slider-val\">0%</span>
              </div>
              <input type=\"range\" id=\"rangeCutWants\" min=\"0\" max=\"50\" value=\"0\" step=\"5\" class=\"range-slider\">
              <span class=\"hint\">Simulates trimming dining out and leisure expenses.</span>
            </div>
          </div>

          <div class=\"sim-results\">
            <div class=\"sim-card\">
              <div class=\"sim-metric\">
                <span class=\"sim-lbl\">Projected Monthly Income</span>
                <span id=\"resIncome\" class=\"sim-val text-emerald\">$${sim.adjustedIncome.toLocaleString()}</span>
              </div>
              <div class=\"sim-metric\">
                <span class=\"sim-lbl\">Projected Monthly Outflow</span>
                <span id=\"resExpenses\" class=\"sim-val text-rose\">$${sim.totalExpenses.toLocaleString()}</span>
              </div>
              <div class=\"sim-metric highlight\">
                <span class=\"sim-lbl\">Projected Net Cashflow</span>
                <span id=\"resSavings\" class=\"sim-val text-teal\">$${sim.projectedSavings.toLocaleString()}</span>
              </div>
              <div class=\"sim-metric\">
                <span class=\"sim-lbl\">Projected Savings Rate</span>
                <span id=\"resSavingsRate\" class=\"sim-val\">${sim.projectedSavingsRate}%</span>
              </div>
              <div class=\"sim-metric\">
                <span class=\"sim-lbl\">Projected Emergency Runway</span>
                <span id=\"resRunway\" class=\"sim-val text-indigo\">${sim.projectedRunway} Months</span>
              </div>
            </div>

            <div class=\"advice-box\" id=\"simAdvice\">
              <h4>Financial Diagnosis: Healthy & Resilient</h4>
              <p>Under current parameters, the Miller household retains strong positive cashflow with over 8 months of emergency reserves.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
