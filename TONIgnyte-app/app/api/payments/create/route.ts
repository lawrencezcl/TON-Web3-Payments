// app/api/payments/create/route.ts
import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderAddress, recipientAddress, amount } = body;

    if (!senderAddress || !recipientAddress || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const paymentService = new PaymentService();
    const paymentIntent = await paymentService.createPaymentIntent(
      senderAddress,
      recipientAddress,
      amount
    );

    return NextResponse.json({ paymentIntent });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}