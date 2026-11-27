// Financial Calculations & Household Modeling Engine

export function calculateSummary(transactions, totalIncome, categories) {
  let totalExpenses = 0;
  const categoryTotals = {};

  categories.forEach(cat => {
    categoryTotals[cat.id] = 0;
  });

  transactions.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    totalExpenses += amt;
    if (categoryTotals[tx.category] !== undefined) {
      categoryTotals[tx.category] += amt;
    } else {
      categoryTotals[tx.category] = amt;
    }
  });

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    netSavings: Math.round(netSavings * 100) / 100,
    savingsRate: Math.round(savingsRate * 10) / 10,
    categoryTotals
  };
}

export function calculate503020(totalIncome, categories, categoryTotals) {
  const targetNeeds = totalIncome * 0.50;
  const targetWants = totalIncome * 0.30;
  const targetSavings = totalIncome * 0.20;

  let actualNeeds = 0;
  let actualWants = 0;

  categories.forEach(cat => {
    const spent = categoryTotals[cat.id] || 0;
    if (cat.type === 'Needs') {
      actualNeeds += spent;
    } else if (cat.type === 'Wants') {
      actualWants += spent;
    }
  });

  const actualSavings = totalIncome - (actualNeeds + actualWants);

  return {
    needs: {
      target: targetNeeds,
      actual: actualNeeds,
      percent: totalIncome > 0 ? (actualNeeds / totalIncome) * 100 : 0,
      status: actualNeeds <= targetNeeds ? 'Within Budget' : 'Over Target'
    },
    wants: {
      target: targetWants,
      actual: actualWants,
      percent: totalIncome > 0 ? (actualWants / totalIncome) * 100 : 0,
      status: actualWants <= targetWants ? 'Within Budget' : 'Over Target'
    },
    savings: {
      target: targetSavings,
      actual: actualSavings,
      percent: totalIncome > 0 ? (actualSavings / totalIncome) * 100 : 0,
      status: actualSavings >= targetSavings ? 'Met Target' : 'Below Target'
    }
  };
}

export function calculateEmergencyRunway(savingsBalance, monthlyNeedsExpenses) {
  if (monthlyNeedsExpenses <= 0) return 99;
  const months = savingsBalance / monthlyNeedsExpenses;
  return Math.round(months * 10) / 10;
}

export function simulateScenario(baseIncome, baseNeeds, baseWants, incomeDeltaPct, inflationPct, cutWantsPct) {
  const adjustedIncome = baseIncome * (1 + incomeDeltaPct / 100);
  const adjustedNeeds = baseNeeds * (1 + inflationPct / 100);
  const adjustedWants = baseWants * (1 - cutWantsPct / 100);
  const totalAdjustedExpenses = adjustedNeeds + adjustedWants;
  const projectedSavings = adjustedIncome - totalAdjustedExpenses;
  const projectedSavingsRate = adjustedIncome > 0 ? (projectedSavings / adjustedIncome) * 100 : 0;
  const runwayMonths = adjustedNeeds > 0 ? 31500 / adjustedNeeds : 0;

  return {
    adjustedIncome: Math.round(adjustedIncome),
    adjustedNeeds: Math.round(adjustedNeeds),
    adjustedWants: Math.round(adjustedWants),
    totalExpenses: Math.round(totalAdjustedExpenses),
    projectedSavings: Math.round(projectedSavings),
    projectedSavingsRate: Math.round(projectedSavingsRate * 10) / 10,
    projectedRunway: Math.round(runwayMonths * 10) / 10
  };
}
