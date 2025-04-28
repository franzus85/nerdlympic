import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = { matcher: '/welcome' }; // Define the route(s) where middleware applies

export async function middleware(req) {
  try {
    const greeting = await get('greeting'); // Fetch data from Vercel Edge Config
    console.log('Greeting from Edge Config:', greeting);

    // Return a JSON response
    return NextResponse.json({ message: greeting || 'Hello from Edge!' });
  } catch (error) {
    console.error('Error fetching Edge Config:', error);
    return NextResponse.json({ error: 'Failed to fetch greeting' }, { status: 500 });
  }
}