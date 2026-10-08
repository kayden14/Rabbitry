import { NextRequest, NextResponse } from 'next/server';

// Default password if not set in environment
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'DanethicalsAdmin2026!';
const SESSION_TOKEN_SECRET = 'rabbitry_admin_secure_session_token_2026';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ success: false, message: 'Password is required' }, { status: 400 });
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: 'Invalid administrative password' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      token: SESSION_TOKEN_SECRET,
    });

    // Set secure HTTP cookie
    response.cookies.set('rabbitry_admin_session', SESSION_TOKEN_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Authentication error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('rabbitry_admin_session')?.value;
  const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');

  const isValid = sessionCookie === SESSION_TOKEN_SECRET || authHeader === SESSION_TOKEN_SECRET;

  if (isValid) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('rabbitry_admin_session');
  return response;
}
