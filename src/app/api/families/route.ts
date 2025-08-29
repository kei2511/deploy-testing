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
    const body: CreateFamilyRequest = await request.json();
    
    const { name, gender, age, relationship } = body;

    // Validasi input
    if (!name || !gender || !age || !relationship) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validasi age harus angka positif
    if (typeof age !== 'number' || age <= 0) {
      return NextResponse.json(
        { error: 'Age must be a positive number' },
        { status: 400 }
      );
    }

    // Validasi relationship
    const validRelationships = ['anak', 'orang tua', 'saudara kandung', 'yang lain'];
    if (!validRelationships.includes(relationship.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid relationship value' },
        { status: 400 }
      );
    }

    // Validasi gender
    const validGenders = ['laki-laki', 'perempuan', 'male', 'female'];
    if (!validGenders.includes(gender.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid gender value' },
        { status: 400 }
      );
    }

    const family = await prisma.family.create({
      data: {
        name,
        gender,
        age,
        relationship
      }
    });

    return NextResponse.json(family, { status: 201 });
  } catch (error) {
    console.error('Error creating family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
