import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Signed out successfully',
  });

  response.cookies.set('maison_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
