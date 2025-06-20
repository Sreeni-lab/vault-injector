import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { VaultConfig } from "@/pages/Index";
import { toast } from "sonner";
import { VaultProxy } from "@/utils/vaultProxy";

interface AuthenticationStepProps {
  config: VaultConfig;
  setConfig: (config: VaultConfig) => void;
  onNext: () => void;
  onPrev: () => void;
  setIsAuthenticated: (auth: boolean) => void;
}

export const AuthenticationStep = ({
  config,
  setConfig,
  onNext,
  onPrev,
  setIsAuthenticated
}: AuthenticationStepProps) => {
  const [showToken, setShowToken] = useState(false);
  const [showSecretId, setShowSecretId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateVaultConnection = async () => {
    setIsLoading(true);
    setAuthStatus('idle');

    try {
      // Only test connection with token if using token authentication
      if (config.authMode === 'token') {
        if (!config.token) {
          throw new Error('Token is required');
        }

        const connectionOk = await VaultProxy.testConnection(config.url, config.token);
        if (!connectionOk) {
          throw new Error('Cannot connect to Vault server');
        }
      }

      // Authenticate based on the selected method
      let authResult;
      if (config.authMode === 'token') {
        authResult = await VaultProxy.authenticateToken(config.url, config.token, config.namespace);
      } else {
        if (!config.roleId || !config.secretId) {
          throw new Error('Role ID and Secret ID are required');
        }
        authResult = await VaultProxy.authenticateAppRole(
          config.url,
          config.roleId,
          config.secretId,
          config.namespace
        );
      }

      if (!authResult.success) {
        throw new Error(authResult.error || 'Authentication failed');
      }

      // Update config with token if we got one from AppRole
      if (authResult.token && config.authMode === 'approle') {
        setConfig({ ...config, token: authResult.token });
      }

      setAuthStatus('success');
      setIsAuthenticated(true);
      toast.success("Authentication successful!");

      setTimeout(() => {
        onNext();
      }, 1000);

    } catch (error: any) {
      setAuthStatus('error');
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateVaultConnection();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-4">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Authenticate to Vault</h2>
        <p className="text-muted-foreground">
          {config.authMode === 'token'
            ? 'Enter your Vault token to authenticate'
            : 'Enter your AppRole credentials to authenticate'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 bg-card/50 border-border">
          {config.authMode === 'token' ? (
            <div>
              <Label htmlFor="token" className="text-foreground flex items-center mb-2">
                <Shield className="w-4 h-4 mr-2" />
                Vault Token
              </Label>
              <div className="relative">
                <Input
                  id="token"
                  type={showToken ? "text" : "password"}
                  placeholder="hvs.xxxxxxxxxxxxxx"
                  value={config.token || ''}
                  onChange={(e) => setConfig({ ...config, token: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:text-foreground"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="role-id" className="text-foreground flex items-center mb-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Role ID
                </Label>
                <Input
                  id="role-id"
                  placeholder="Enter your AppRole Role ID"
                  value={config.roleId || ''}
                  onChange={(e) => setConfig({ ...config, roleId: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="secret-id" className="text-foreground flex items-center mb-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Secret ID
                </Label>
                <div className="relative">
                  <Input
                    id="secret-id"
                    type={showSecretId ? "text" : "password"}
                    placeholder="Enter your AppRole Secret ID"
                    value={config.secretId || ''}
                    onChange={(e) => setConfig({ ...config, secretId: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:text-foreground"
                    onClick={() => setShowSecretId(!showSecretId)}
                  >
                    {showSecretId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {authStatus !== 'idle' && (
          <Card className={`p-4 border ${authStatus === 'success'
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
            }`}>
            <div className="flex items-center">
              {authStatus === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              )}
              <span className={authStatus === 'success' ? 'text-green-400' : 'text-red-400'}>
                {authStatus === 'success'
                  ? 'Authentication successful!'
                  : 'Authentication failed. Please check your credentials and try again.'}
              </span>
            </div>
          </Card>
        )}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            className="border-border"
          >
            Back to Configuration
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              'Authenticate'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
