import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

function readOrders() {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.mkdirSync(path.dirname(ORDERS_FILE), { recursive: true });
      fs.writeFileSync(ORDERS_FILE, '[]');
    }
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeOrders(orders: unknown[]) {
  fs.mkdirSync(path.dirname(ORDERS_FILE), { recursive: true });
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RBY-${timestamp}-${random}`;
}

export async function GET() {
  const orders = readOrders();
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orders = readOrders();

  const newOrder = {
    id: `order-${Date.now()}`,
    orderNumber: generateOrderNumber(),
    customerName: body.name,
    customerPhone: body.phone,
    customerEmail: body.email || null,
    deliveryState: body.state,
    deliveryCity: body.city,
    deliveryAddress: body.address,
    items: body.items,
    subtotal: body.subtotal,
    deliveryFee: null, // Set by admin
    total: null,       // Set by admin
    paymentMethod: body.paymentMethod,
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
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const orders = readOrders();

  const idx = orders.findIndex((o: { id: string }) => o.id === body.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  orders[idx] = { ...orders[idx], ...body, updatedAt: new Date().toISOString() };
  writeOrders(orders);

  return NextResponse.json({ success: true, order: orders[idx] });
}
