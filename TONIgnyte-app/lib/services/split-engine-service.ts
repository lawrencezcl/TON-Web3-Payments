// lib/services/split-engine-service.ts

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  splits: Record<string, number>;
}

export class SplitEngineService {
  static calculateOptimalSettlements(expenses: Expense[]): any[] {
    // Calculate net balances for each user
    const balances = new Map<string, number>();
    
    for (const expense of expenses) {
      // Add amount to payer's balance
      balances.set(expense.paidBy, (balances.get(expense.paidBy) || 0) + expense.amount);
      
      // Subtract split amounts from participants
      const splitAmount = expense.amount / expense.participants.length;
      for (const participant of expense.participants) {
        balances.set(participant, (balances.get(participant) || 0) - splitAmount);
      }
    }
    
    // Convert balances to settlements
    const settlements: any[] = [];
    const creditors = Array.from(balances.entries())
      .filter(([_, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1]); // Sort by highest creditor
    
    const debtors = Array.from(balances.entries())
      .filter(([_, amount]) => amount < 0)
      .sort((a, b) => a[1] - b[1]); // Sort by highest debtor
    
    let creditorIdx = 0;
    let debtorIdx = 0;
    
    while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
      const [creditor, creditorBalance] = creditors[creditorIdx];
      const [debtor, debtorBalance] = debtors[debtorIdx];
      
      const settlementAmount = Math.min(creditorBalance, Math.abs(debtorBalance));
      
      settlements.push({
        from: debtor,
        to: creditor,
        amount: settlementAmount
      });
      
      creditors[creditorIdx][1] -= settlementAmount;
      debtors[debtorIdx][1] += settlementAmount;
      
      if (creditors[creditorIdx][1] === 0) creditorIdx++;
      if (debtors[debtorIdx][1] === 0) debtorIdx++;
    }
    
    return settlements;
  }
}