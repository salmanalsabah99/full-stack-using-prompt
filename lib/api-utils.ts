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

// Common task list query options
export const taskListIncludeOptions = {
  tasks: {
    orderBy: {
      order: 'asc',
    },
  },
};

// Higher-order function to handle common API route patterns
export const withApiHandler = <T>(
  handler: (request: Request, params?: any) => Promise<T>,
  operation: string
) => {
  return async (request: Request, params?: any) => {
    try {
      const result = await handler(request, params);
      return createSuccessResponse(result);
    } catch (error) {
      return handleApiError(error, operation);
    }
  };
};

// Helper to handle validation
export const withValidation = <T>(
  data: any,
  validator: (data: any) => NextResponse | null,
  handler: (data: T) => Promise<any>
) => {
  const validationError = validator(data);
  if (validationError) return validationError;
  return handler(data);
}; 