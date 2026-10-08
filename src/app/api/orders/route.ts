import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? '/tmp/rabbitry-data' : path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// In-memory fallback in case of read-only/lambda restarts
let inMemoryOrders: any[] = [];

function readOrders(): any[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
      if (Array.isArray(data)) {
        inMemoryOrders = data;
        return data;
      }
    }
  } catch {
    // ignore read error
  }
  return inMemoryOrders;
}

function writeOrders(orders: any[]) {
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
      items: body.items || [],
      subtotal: body.subtotal || 0,
      deliveryFee: null, // Set by admin
      total: null,       // Set by admin
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
    const body = await req.json();
    const orders = readOrders();

    const idx = orders.findIndex((o: { id: string }) => o.id === body.id);
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
