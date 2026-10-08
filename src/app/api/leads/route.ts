import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

function readLeads() {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
      fs.writeFileSync(LEADS_FILE, '[]');
    }
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeLeads(leads: unknown[]) {
  fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

export async function GET() {
  const leads = readLeads();
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const leads = readLeads();

  const newLead = {
    id: `lead-${Date.now()}`,
    name: body.name,
    phone: body.phone,
    email: body.email || null,
    source: body.source || 'lead-magnet',
    inquiryDetails: body.inquiryDetails || null,
    createdAt: new Date().toISOString(),
  };

  leads.unshift(newLead);
  writeLeads(leads);

  return NextResponse.json({ success: true, lead: newLead }, { status: 201 });
}
