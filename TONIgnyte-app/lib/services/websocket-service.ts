// lib/services/websocket-service.ts
// Mock implementation of WebSocket service for real-time notifications
// In a real implementation, this would connect to a WebSocket server

export class WebSocketService {
  private static instance: WebSocketService | null = null;
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  // Simulate connecting to WebSocket server
  connect() {
    console.log('Connecting to WebSocket server...');
    // In a real implementation, this would establish a WebSocket connection
    // For now, we'll just simulate connection
    setTimeout(() => {
      this.emit('connected', { message: 'Connected to WebSocket server' });
    }, 1000);
  }

  // Simulate disconnecting from WebSocket server
  disconnect() {
    console.log('Disconnecting from WebSocket server...');
    // In a real implementation, this would close the WebSocket connection
    this.emit('disconnected', { message: 'Disconnected from WebSocket server' });
  }

  // Add event listener
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  // Remove event listener
  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit event to all listeners
  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Simulate receiving a settlement update
  simulateSettlementUpdate(settlement: any) {
    this.emit('settlementUpdate', settlement);
  }

  // Simulate receiving a payment notification
  simulatePaymentNotification(payment: any) {
    this.emit('paymentNotification', payment);
  }

  // Simulate receiving a loyalty token update
  simulateLoyaltyUpdate(loyalty: any) {
    this.emit('loyaltyUpdate', loyalty);
  }
}