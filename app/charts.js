// Pure SVG Chart Generators (Zero External Dependencies)

export function renderDonutChart(categories, categoryTotals, totalSpent, width = 320, height = 320) {
  if (totalSpent <= 0) return '<div class=\"chart-empty\">No expenses recorded</div>';

  const radius = Math.min(width, height) / 2 - 20;
  const innerRadius = radius * 0.65;
  const cx = width / 2;
  const cy = height / 2;

  let startAngle = 0;
  let paths = '';

  const activeCategories = categories
    .map(c => ({ ...c, total: categoryTotals[c.id] || 0 }))
    .filter(c => c.total > 0);

  activeCategories.forEach((cat, index) => {
    const sliceAngle = (cat.total / totalSpent) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const x3 = cx + innerRadius * Math.cos(endAngle);
    const y3 = cy + innerRadius * Math.sin(endAngle);
    const x4 = cx + innerRadius * Math.cos(startAngle);
    const y4 = cy + innerRadius * Math.sin(startAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const d = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;

    paths += `<path d=\"${d}\" fill=\"${cat.color}\" opacity=\"0.95\" data-cat=\"${cat.name}\" data-val=\"$${cat.total.toLocaleString()}\"><title>${cat.name}: $${cat.total.toLocaleString()} (${Math.round((cat.total/totalSpent)*100)}%)</title></path>`;

    startAngle = endAngle;
  });

  return `
    <svg width=\"${width}\" height=\"${height}\" viewBox=\"0 0 ${width} ${height}\" class=\"svg-donut\">
      <g>${paths}</g>
      <circle cx=\"${cx}\" cy=\"${cy}\" r=\"${innerRadius - 4}\" fill=\"#1e293b\" />
      <text x=\"${cx}\" y=\"${cy - 8}\" text-anchor=\"middle\" fill=\"#94a3b8\" font-size=\"12\" font-weight=\"500\">TOTAL SPENT</text>
      <text x=\"${cx}\" y=\"${cy + 18}\" text-anchor=\"middle\" fill=\"#f8fafc\" font-size=\"20\" font-weight=\"700\">$${Math.round(totalSpent).toLocaleString()}</text>
    </svg>
  `;
}

export function renderCashflowChart(history, width = 640, height = 240) {
  const padLeft = 50;
  const padRight = 20;
  const padTop = 30;
  const padBottom = 35;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxVal = 11000;
  const minVal = 0;

  const getX = (i) => padLeft + (i / (history.length - 1)) * chartW;
  const getY = (val) => padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  let incomePoints = '';
  let expensePoints = '';
  let incomeAreaPoints = `M ${getX(0)} ${padTop + chartH} `;
  let expenseAreaPoints = `M ${getX(0)} ${padTop + chartH} `;
  let xLabels = '';
  let dots = '';

  history.forEach((h, i) => {
    const x = getX(i);
    const yInc = getY(h.income);
    const yExp = getY(h.expenses);

    if (i === 0) {
      incomePoints += `M ${x} ${yInc} `;
      expensePoints += `M ${x} ${yExp} `;
    } else {
      incomePoints += `L ${x} ${yInc} `;
      expensePoints += `L ${x} ${yExp} `;
    }

    incomeAreaPoints += `L ${x} ${yInc} `;
    expenseAreaPoints += `L ${x} ${yExp} `;

    xLabels += `<text x=\"${x}\" y=\"${height - 10}\" text-anchor=\"middle\" fill=\"#64748b\" font-size=\"11\">${h.month.split(' ')[0]}</text>`;
    dots += `<circle cx=\"${x}\" cy=\"${yInc}\" r=\"4\" fill=\"#10b981\" stroke=\"#0f172a\" stroke-width=\"2\" />`;
    dots += `<circle cx=\"${x}\" cy=\"${yExp}\" r=\"4\" fill=\"#ef4444\" stroke=\"#0f172a\" stroke-width=\"2\" />`;
  });

  incomeAreaPoints += `L ${getX(history.length - 1)} ${padTop + chartH} Z`;
  expenseAreaPoints += `L ${getX(history.length - 1)} ${padTop + chartH} Z`;

  // Grid lines
  let grid = '';
  [0, 3000, 6000, 9000].forEach(val => {
    const y = getY(val);
    grid += `<line x1=\"${padLeft}\" y1=\"${y}\" x2=\"${width - padRight}\" y2=\"${y}\" stroke=\"#334155\" stroke-dasharray=\"3,3\" />`;
    grid += `<text x=\"${padLeft - 8}\" y=\"${y + 4}\" text-anchor=\"end\" fill=\"#64748b\" font-size=\"10\">$${val/1000}k</text>`;
  });

  return `
    <svg width=\"100%\" height=\"100%\" viewBox=\"0 0 ${width} ${height}\" class=\"svg-cashflow\">
      <defs>
        <linearGradient id=\"incGrad\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">
          <stop offset=\"0%\" stop-color=\"#10b981\" stop-opacity=\"0.35\" />
          <stop offset=\"100%\" stop-color=\"#10b981\" stop-opacity=\"0.0\" />
        </linearGradient>
        <linearGradient id=\"expGrad\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">
          <stop offset=\"0%\" stop-color=\"#ef4444\" stop-opacity=\"0.25\" />
          <stop offset=\"100%\" stop-color=\"#ef4444\" stop-opacity=\"0.0\" />
        </linearGradient>
      </defs>
      ${grid}
      <path d=\"${incomeAreaPoints}\" fill=\"url(#incGrad)\" />
      <path d=\"${expenseAreaPoints}\" fill=\"url(#expGrad)\" />
      <path d=\"${incomePoints}\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"2.5\" />
      <path d=\"${expensePoints}\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2.5\" />
      ${dots}
      ${xLabels}
    </svg>
  `;
}
