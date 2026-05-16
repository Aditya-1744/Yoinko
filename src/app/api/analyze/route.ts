// src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { analyzeSentiment } from '@/app/lib/openai';
import { database } from '@/app/lib/firebase';
import { ref, push, serverTimestamp } from 'firebase/database';

export async function POST(request: NextRequest) {
  try {
    const { text, userId } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    
    const analysis = await analyzeSentiment(text);
    
    // Store in Firebase if userId is provided
    if (userId) {
      // Ensure we're using the correct path structure
      const historyRef = ref(database, `users/${userId}/history`);
      
      // Add a unique timestamp to ensure data doesn't get overwritten
      const timestamp = Date.now();
      
      await push(historyRef, {
        text,
        analysis,
        timestamp,
        createdAt: serverTimestamp()
      });
    }
    
    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze text' }, 
      { status: 500 }
    );
  }
}
