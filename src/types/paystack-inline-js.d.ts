declare module '@paystack/inline-js' {
  export interface PaystackTransactionOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    metadata?: Record<string, any>;
    onSuccess?: (transaction: { reference: string; status?: string; message?: string }) => void;
    onCancel?: () => void;
    onError?: (error: unknown) => void;
    [key: string]: any;
  }

  export default class PaystackPop {
    constructor();
    newTransaction(options: PaystackTransactionOptions): void;
    resumeTransaction(accessCode: string): void;
  }
}
