import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function GET() {
  try {
    console.log('Weekly financial ping triggered');
    
    // Get current week ending (Sunday)
    const now = new Date();
    const daysUntilSunday = 7 - now.getDay();
    const weekEnding = new Date(now);
    weekEnding.setDate(now.getDate() + daysUntilSunday);
    weekEnding.setHours(23, 59, 59, 999);
    
    const weekEndingStr = weekEnding.toISOString().split('T')[0];
    
    // Check if processing is needed
    const storagePath = path.join(process.cwd(), 'data', 'financial', 'weekly_uploads', weekEndingStr);
    const processedFile = path.join(storagePath, 'processed_transactions.json');
    
    // For now, just return status - actual processing will be implemented
    return NextResponse.json({
      status: 'success',
      message: 'Weekly financial ping received',
      week_ending: weekEndingStr,
      processing_needed: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Weekly financial ping error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to process weekly ping',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
