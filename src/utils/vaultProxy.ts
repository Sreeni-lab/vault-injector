// VaultProxy.ts
import axios from 'axios';

const PROXY_URL = '/api';

export interface VaultAuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export class VaultProxy {
  static async authenticateToken(url: string, token: string, namespace?: string): Promise<VaultAuthResponse> {
    try {
      const response = await axios.post(`${PROXY_URL}/vault/auth/token`, {
        url,
        token,
        namespace
      });

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Unknown error',
      };
    }
  }

  static async authenticateAppRole(
    url: string,
    roleId: string,
    secretId: string,
    namespace?: string
  ): Promise<VaultAuthResponse> {
    try {
      const response = await axios.post(`${PROXY_URL}/vault/auth/approle`, {
        url,
        roleId,
        secretId,
        namespace
      });

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'AppRole authentication failed',
      };
    }
  }

  static async testConnection(url: string, token: string): Promise<boolean> {
    try {
      const response = await axios.post(`${PROXY_URL}/vault/test`, {
        url,
        token
      });

      return response.data.success;
    } catch (error: any) {
      return false;
    }
  }
}
