import { NextResponse } from 'next/server';
import { getSession } from './auth';
import { getUserById } from './db/users';
import { CryptoUtil } from './crypto';
import { ApiResponse } from './apiResponse';

export function withEncryption(
  handler: (req: Request, ...args: any[]) => Promise<NextResponse> | NextResponse
) {
  return async (req: Request, ...args: any[]) => {
    try {
      // 1. Authenticate and retrieve dynamic keys
      const session = await getSession();
      if (!session) {
        return ApiResponse.error("Not authenticated", 401);
      }

      const user = await getUserById(session.userId);
      if (!user) {
        return ApiResponse.error("User not found", 404);
      }

      const encryptionKey = user.sessionKeys?.key;
      const encryptionIv = user.sessionKeys?.iv;

      // 2. Decrypt incoming payload if present
      let decryptedBody: any = null;
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        try {
          const body = await req.json();
          if (body && body.payload && encryptionKey && encryptionIv) {
            const decrypted = CryptoUtil.decrypt(body.payload, encryptionKey, encryptionIv);
            if (decrypted !== null) {
              decryptedBody = typeof decrypted === 'string' ? JSON.parse(decrypted) : decrypted;
            }
          } else {
            decryptedBody = body; // Unencrypted or no keys
          }
        } catch (err) {
          // Body parsing failed or decryption failed
          decryptedBody = {};
        }
      }

      // Inject decrypted body into request
      const clonedReq = new Request(req.url, {
        method: req.method,
        headers: req.headers,
        body: decryptedBody ? JSON.stringify(decryptedBody) : null
      });

      // Also attach user to a custom property if we want, but NextRequest doesn't support custom properties easily
      // We will just let the handlers call getSession() again (it's cached by React/Next.js locally)

      // 3. Execute the actual handler
      const response = await handler(clonedReq, ...args);

      // 4. Encrypt the outgoing response
      // We assume the handler returns a standard NextResponse.json() or ApiResponse
      const responseData = await response.json();
      
      // If it's an ApiResponse format and it has data
      if (responseData.success !== undefined) {
        if (responseData.data && encryptionKey && encryptionIv) {
          const encrypted = CryptoUtil.encrypt(responseData.data, encryptionKey, encryptionIv);
          if (encrypted) {
            responseData.data = encrypted;
          }
        }
        return NextResponse.json(responseData, { status: response.status });
      }

      // If it's a raw JSON response, wrap it in ApiResponse and encrypt
      if (encryptionKey && encryptionIv) {
        const encrypted = CryptoUtil.encrypt(responseData, encryptionKey, encryptionIv);
        if (encrypted) {
          return ApiResponse.success(encrypted, "Success", response.status);
        }
      }

      // Fallback
      return ApiResponse.success(responseData, "Success", response.status);

    } catch (error: any) {
      console.error("[API Wrapper] Error:", error);
      return ApiResponse.error(error.message || "Internal Server Error", 500);
    }
  };
}
