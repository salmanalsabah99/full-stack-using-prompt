import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

export function createApiResponse<T>(
  data?: T,
  error?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      data,
      error,
      success: !error,
    },
    { status }
  );
}

export function validateRequest<T>(
  data: unknown,
  validator: (data: unknown) => data is T
): ApiResponse<T> {
  if (!validator(data)) {
    return {
      error: 'Invalid request data',
      success: false,
    };
  }
  return {
    data,
    success: true,
  };
}

export function handleApiError(error: unknown, message: string): NextResponse<ApiResponse<never>> {
  console.error(message, error);
  return createApiResponse(undefined, message, 500);
} 