import { NextResponse } from 'next/server';

export const handleApiError = (error: unknown, message: string) => {
  console.error(message, error);
  return NextResponse.json(
    { error: `Failed to ${message}` },
    { status: 500 }
  );
};

export const createErrorResponse = (message: string, status: number = 400) => {
  return NextResponse.json(
    { error: message },
    { status }
  );
};

export const createSuccessResponse = <T>(data: T, status: number = 200) => {
  return NextResponse.json(data, { status });
}; 