// app/api/splits/settle/route.ts
import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment-service';
import { DatabaseService } from '@/lib/services/database-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { settlements, groupId } = body;

    if (!settlements || !Array.isArray(settlements)) {
      return NextResponse.json(
        { error: 'Settlements array is required' },
        { status: 400 }
      );
    }

    const paymentService = new PaymentService();
    const results = [];

    for (const settlement of settlements) {
      const { from, to, amount } = settlement;

      // In a real implementation, this would create actual transactions on the blockchain
      // For now, we'll simulate the settlement
      const success = await paymentService.executePayment(
        `settlement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        from,
        to,
        amount.toString()
      );

      results.push({
        from,
        to,
        amount,
        success
      });

      if (success) {
        // Create a transaction record in the database
        await DatabaseService.createTransaction(
          from,
          to,
          parseFloat(amount),
          'split_settlement'
        );
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Settlements processed successfully',
      results
    });
  } catch (error) {
    console.error('Error processing settlements:', error);
    return NextResponse.json(
      { error: 'Failed to process settlements' },
      { status: 500 }
    );
  }
}