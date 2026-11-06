import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type OrderBody = {
  id?: string;
  name?: string;
  phone?: string;
  email?: string | null;
  state?: string;
  city?: string;
  address?: string;
  items?: Array<Record<string, unknown>>;
  subtotal?: number;
  paymentMethod?: string;
  paymentProofUrl?: string | null;
  paystackReference?: string | null;
  notes?: string | null;
};

type OrderRecord = {
  id: string;
  orderNumber: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string | null;
  deliveryState?: string;
  deliveryCity?: string;
  deliveryAddress?: string;
  items: Array<Record<string, unknown>>;
  subtotal: number;
  deliveryFee: null;
  total: null;
  paymentMethod: string;
  paymentProofUrl: string | null;
  paystackReference: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? '/tmp/rabbitry-data' : path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// In-memory fallback in case of read-only/lambda restarts
let inMemoryOrders: OrderRecord[] = [];

function readOrders(): OrderRecord[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8')) as unknown;
      if (Array.isArray(data)) {
        inMemoryOrders = data as OrderRecord[];
        return inMemoryOrders;
      }
    }
  } catch {
    // ignore read error
  }
  return inMemoryOrders;
}

function writeOrders(orders: OrderRecord[]) {
  inMemoryOrders = orders;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.warn('Could not write orders to disk (using in-memory):', err);
  }
}

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RBY-${timestamp}-${random}`;
}

export async function GET(req: NextRequest) {
  const orders = readOrders();
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<OrderBody>;
    const orders = readOrders();

    const newOrder: OrderRecord = {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      customerName: body.name,
      customerPhone: body.phone,
      customerEmail: body.email || null,
      deliveryState: body.state,
      deliveryCity: body.city,
      deliveryAddress: body.address,
      items: (body.items as Array<Record<string, unknown>>) || [],
      subtotal: body.subtotal || 0,
      deliveryFee: null,
      total: null,
      paymentMethod: body.paymentMethod || 'bank-transfer',
      paymentProofUrl: body.paymentProofUrl || null,
      paystackReference: body.paystackReference || null,
      status: 'pending',
      adminNotes: body.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    writeOrders(orders);

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<OrderBody>;
    const orders = readOrders();

    const idx = orders.findIndex((o) => o.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    orders[idx] = { ...orders[idx], ...body, updatedAt: new Date().toISOString() };
    writeOrders(orders);

    return NextResponse.json({ success: true, order: orders[idx] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
