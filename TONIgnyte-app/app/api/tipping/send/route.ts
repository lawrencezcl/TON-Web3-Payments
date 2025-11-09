// app/api/tipping/send/route.ts
import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment-service';
import { DatabaseService } from '@/lib/services/database-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromAddress, toAddress, amount, workerId, rating } = body;

    if (!fromAddress || !toAddress || !amount) {
      return NextResponse.json(
        { error: 'From address, to address, and amount are required' },
        { status: 400 }
      );
    }

    const paymentService = new PaymentService();
    
    // Execute the tip payment
    const transactionId = `tip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const success = await paymentService.executePayment(
      transactionId,
      fromAddress,
      toAddress,
      amount.toString()
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send tip' },
        { status: 500 }
      );
    }

    // Create transaction record
    const transaction = await DatabaseService.createTransaction(
      fromAddress,
      toAddress,
      parseFloat(amount),
      'tip',
      transactionId
    );

    // If rating is provided, store it
    if (workerId && rating) {
      // In a real implementation, we would store the rating in the database
      console.log(`Rating ${rating} submitted for worker ${workerId}`);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Tip sent successfully',
      transaction
    });
  } catch (error) {
    console.error('Error sending tip:', error);
    return NextResponse.json(
      { error: 'Failed to send tip' },
      { status: 500 }
    );
  }
}