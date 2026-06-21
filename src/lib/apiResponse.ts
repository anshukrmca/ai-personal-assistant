import { NextResponse } from 'next/server';

export interface IMetaResponse {
  requestId?: string;
  timestamp: string;
}

export interface IApiResponseFormat<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta: IMetaResponse;
  errors?: any[];
  errorCode?: string;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResponseFormat<T> extends IApiResponseFormat<T[]> {
  pagination: IPaginationMeta;
}

export class ApiResponse {
  static success<T>(
    data?: T,
    message: string = 'Success',
    statusCode: number = 200
  ): NextResponse {
    const responseBody: IApiResponseFormat<T> = {
      success: true,
      statusCode,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString()
      }
    };
    return NextResponse.json(responseBody, { status: statusCode });
  }

  static error(
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    errorCode?: string,
    errors?: any[]
  ): NextResponse {
    const responseBody: IApiResponseFormat<null> = {
      success: false,
      statusCode,
      message,
      errorCode: errorCode || 'INTERNAL_ERROR',
      errors: errors || [],
      meta: {
        timestamp: new Date().toISOString()
      }
    };
    return NextResponse.json(responseBody, { status: statusCode });
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success',
    statusCode: number = 200
  ): NextResponse {
    const totalPages = Math.ceil(total / limit);
    const responseBody: IPaginatedResponseFormat<T> = {
      success: true,
      statusCode,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };
    return NextResponse.json(responseBody, { status: statusCode });
  }
}
