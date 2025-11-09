// components/wallet/transaction-history.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Transaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  transactionHash?: string;
  status: string;
  type: string;
  createdAt: Date;
}

export function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No transactions found
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <Badge variant={
                      tx.type === 'sent' ? 'destructive' : 
                      tx.type === 'received' ? 'default' : 
                      'secondary'
                    }>
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{tx.amount} TON</TableCell>
                  <TableCell className="font-mono text-sm">
                    {tx.type === 'sent' 
                      ? `${tx.toAddress.substring(0, 6)}...${tx.toAddress.substring(tx.toAddress.length - 4)}` 
                      : `${tx.fromAddress.substring(0, 6)}...${tx.fromAddress.substring(tx.fromAddress.length - 4)}`}
                  </TableCell>
                  <TableCell>{format(new Date(tx.createdAt), 'MMM dd, yyyy HH:mm')}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        tx.status === 'completed' ? 'default' : 
                        tx.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}