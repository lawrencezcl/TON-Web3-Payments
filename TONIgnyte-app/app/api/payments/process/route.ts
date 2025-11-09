// app/api/payments/process/route.ts
import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionId, senderAddress, recipientAddress, amount } = body;

    if (!transactionId || !senderAddress || !recipientAddress || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const paymentService = new PaymentService();
    const success = await paymentService.executePayment(
      transactionId,
      senderAddress,
      recipientAddress,
      amount
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to execute payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Payment executed successfully',
      transactionId
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}