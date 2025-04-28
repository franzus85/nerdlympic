import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export async function POST(req) {
  try {
    const { user } = await req.json();

    if (!user) {
      return NextResponse.json({ error: 'User name is required to proceed.' }, { status: 400 });
    }

    // Edge Config credentials
    const authToken = 'SEJ6XulmrAAvqHDkswFylUmA';
    const edgeConfigId = 'ecfg_bemwzouoxonfgwe7jxckjdrniime';
    
    // Create a value object with role and timestamp
    const userValue = {
      role: "user",
      timestamp: new Date().toISOString()
    };

    // According to Vercel documentation, use PATCH to update items
    const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            operation: 'upsert', // Use upsert to either create or update the key
            key: user, // Using the user name as the key
            value: userValue, // Set the value as an object with role and timestamp
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('API Error Details:', errorDetails);
      return NextResponse.json({ 
        error: `Failed to create user: ${errorDetails.error?.message || 'Unknown error'}` 
      }, { status: response.status });
    }

    return NextResponse.json({ 
      message: 'User created successfully!',
      username: user,
      data: userValue
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while creating the user.' }, { status: 500 });
  }
}