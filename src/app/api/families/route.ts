import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface CreateFamilyRequest {
  name: string;
  gender: string;
  age: number;
  relationship: string;
}

// POST /api/families - Create new family member
export async function POST(request: NextRequest) {
  try {
    console.log('=== POST /api/families called ===');
    const body = await request.json();
    console.log('Request body:', body);
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    
    const { name, gender, age, relationship } = body;

    // Validasi input
    if (!name || !gender || age === undefined || age === null || !relationship) {
      return NextResponse.json(
        { error: 'All fields are required', received: { name, gender, age, relationship } },
        { status: 400 }
      );
    }

    // Validasi age harus angka positif
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum <= 0) {
      return NextResponse.json(
        { error: 'Age must be a positive number', receivedAge: age },
        { status: 400 }
      );
    }

    // Validasi relationship - accept any string
    if (!relationship || relationship.trim() === '') {
      return NextResponse.json(
        { error: 'Relationship is required' },
        { status: 400 }
      );
    }

    // Validasi gender - accept any string
    if (!gender || gender.trim() === '') {
      return NextResponse.json(
        { error: 'Gender is required' },
        { status: 400 }
      );
    }

    console.log('Creating family with data:', { name, gender, age: ageNum, relationship });
    const family = await prisma.family.create({
      data: {
        name: String(name),
        gender: String(gender),
        age: ageNum,
        relationship: String(relationship)
      }
    });
    console.log('Family created successfully:', family);

    return NextResponse.json(family, { status: 201 });
  } catch (error) {
    console.error('=== ERROR in POST /api/families ===');
    console.error('Error creating family:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    );
  }
}

// GET /api/families - Get all families
export async function GET() {
  try {
    const families = await prisma.family.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(families);
  } catch (error) {
    console.error('Error fetching families:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}
