import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const position = formData.get('position');
    const resume = formData.get('resume');

    // Validate required fields
    if (!name || !email || !phone || !position || !resume) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (resume.type !== 'application/pdf') {
      return NextResponse.json(
        { message: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (resume.size > maxSize) {
      return NextResponse.json(
        { message: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Send to backend API for file upload and database storage
    const backendFormData = new FormData();
    backendFormData.append('name', name);
    backendFormData.append('email', email);
    backendFormData.append('phone', phone);
    backendFormData.append('position', position);
    backendFormData.append('resume', resume);

    console.log('Sending to backend:', {
      name, email, phone, position,
      resumeSize: resume.size,
      resumeType: resume.type
    });

    const backendResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/v1/career/applications`, {
      method: 'POST',
      body: backendFormData,
    });

    const backendData = await backendResponse.json();
    console.log('Backend response:', backendResponse.status, backendData);

    if (!backendResponse.ok) {
      // Forward the backend error message with appropriate status
      return NextResponse.json(
        { 
          message: backendData.message || 'Failed to submit application',
          details: backendData.details || null
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(
      { 
        message: 'Application submitted successfully',
        applicationId: backendData.data?.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Career application error:', error);
    
    // Handle network or unexpected errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json(
        { message: 'Unable to connect to server. Please check your connection and try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
} 