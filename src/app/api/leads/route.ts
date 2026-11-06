import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type LeadInput = {
  name?: string;
  phone?: string;
  email?: string | null;
  source?: string;
  inquiryDetails?: string | null;
};

type LeadRecord = {
  id: string;
  name?: string;
  phone?: string;
  email?: string | null;
  source: string;
  inquiryDetails?: string | null;
  createdAt: string;
};

const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? '/tmp/rabbitry-data' : path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

let inMemoryLeads: LeadRecord[] = [];

function readLeads(): LeadRecord[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8')) as unknown;
      if (Array.isArray(data)) {
        inMemoryLeads = data as LeadRecord[];
        return inMemoryLeads;
      }
    }
  } catch {
    // ignore read error
  }
  return inMemoryLeads;
}

function writeLeads(leads: LeadRecord[]) {
  inMemoryLeads = leads;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (err) {
    console.warn('Could not write leads to disk (using in-memory):', err);
  }
}

export async function GET() {
  const leads = readLeads();
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<LeadInput>;
    const leads = readLeads();

    const newLead: LeadRecord = {
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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record lead' }, { status: 500 });
  }
}
