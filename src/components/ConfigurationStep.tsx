import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Server, Key, Database } from "lucide-react";
import { VaultConfig } from "@/pages/Index";
import { validateVaultUrl, validateVaultPath, validateNamespace } from "@/utils/validation";
import { FormError, FormWarning } from "@/components/ui/form-message";

interface ConfigurationStepProps {
  config: VaultConfig;
  setConfig: (config: VaultConfig) => void;
  onNext: () => void;
}

export const ConfigurationStep = ({ config, setConfig, onNext }: ConfigurationStepProps) => {
  const [urlError, setUrlError] = useState<string | undefined>();
  const [pathError, setPathError] = useState<string | undefined>();
  const [namespaceError, setNamespaceError] = useState<string | undefined>();
  const [urlWarning, setUrlWarning] = useState<string | undefined>();
  const [pathWarning, setPathWarning] = useState<string | undefined>();
  const [showValidation, setShowValidation] = useState(false);

  const validateForm = () => {
    const urlValidation = validateVaultUrl(config.url);
    const pathValidation = validateVaultPath(config.secretsPath);
    const namespaceValidation = validateNamespace(config.namespace);

    setUrlError(urlValidation.error);
    setPathError(pathValidation.error);
    setNamespaceError(namespaceValidation.error);

    // Set warnings
    if (urlValidation.isValid && urlValidation.normalizedUrl && urlValidation.normalizedUrl !== config.url) {
      setUrlWarning('URL will be normalized');
    } else {
      setUrlWarning(undefined);
    }

    if (pathValidation.isValid && pathValidation.error?.includes('Warning:')) {
      setPathWarning(pathValidation.error);
    } else {
      setPathWarning(undefined);
    }

    return urlValidation.isValid && pathValidation.isValid && namespaceValidation.isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    // Normalize values before proceeding
    const urlValidation = validateVaultUrl(config.url);
    const pathValidation = validateVaultPath(config.secretsPath);

    const normalizedConfig = {
      ...config,
      url: urlValidation.normalizedUrl || config.url,
      secretsPath: pathValidation.normalizedPath || config.secretsPath
    };

    setConfig(normalizedConfig);
    onNext();
  };

  const getInputClassName = (hasError: boolean, hasWarning?: boolean) => {
    let className = "transition-colors";
    if (hasError && showValidation) {
      className += " border-red-500 focus:border-red-500 focus:ring-red-500";
    } else if (hasWarning && showValidation) {
      className += " border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500";
    }
    return className;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-4">
          <Server className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Configure Vault Connection</h2>
        <p className="text-muted-foreground">Enter your HashiCorp Vault server details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 bg-card/50 border-border">
          <div className="space-y-4">
            <div>
              <Label htmlFor="vault-url" className="text-foreground flex items-center mb-2">
                <Server className="w-4 h-4 mr-2" />
                Vault URL
              </Label>
              <Input
                id="vault-url"
                type="text"
                placeholder="https://vault.example.com"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                className={getInputClassName(!!urlError, !!urlWarning)}
                required
              />
              {urlError && showValidation && (
                <FormError>{urlError}</FormError>
              )}
              {urlWarning && !urlError && showValidation && (
                <FormWarning>{urlWarning}</FormWarning>
              )}
            </div>

            <div>
              <Label htmlFor="namespace" className="text-foreground flex items-center mb-2">
                <Database className="w-4 h-4 mr-2" />
                Namespace (Optional)
              </Label>
              <Input
                id="namespace"
                placeholder="Leave blank for OSS Vault"
                value={config.namespace}
                onChange={(e) => setConfig({ ...config, namespace: e.target.value })}
                className={getInputClassName(!!namespaceError)}
              />
              {namespaceError && showValidation && (
                <FormError>{namespaceError}</FormError>
              )}
            </div>

            <div>
              <Label htmlFor="secrets-path" className="text-foreground flex items-center mb-2">
                <Key className="w-4 h-4 mr-2" />
                Secrets Path
              </Label>
              <Input
                id="secrets-path"
                placeholder="kv/data/path/to/secrets"
                value={config.secretsPath}
                onChange={(e) => setConfig({ ...config, secretsPath: e.target.value })}
                className={getInputClassName(!!pathError, !!pathWarning)}
                required
              />
              {pathError && showValidation && (
                <FormError>{pathError}</FormError>
              )}
              {pathWarning && !pathError && showValidation && (
                <FormWarning>{pathWarning}</FormWarning>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 border-border">
          <Label className="text-foreground flex items-center mb-4">
            <Key className="w-4 h-4 mr-2" />
            Authentication Method
          </Label>
          <RadioGroup
            value={config.authMode}
            onValueChange={(value: 'token' | 'approle') =>
              setConfig({ ...config, authMode: value })
            }
            className="space-y-3"
          >
            <div className={`flex items-center space-x-2 p-3 rounded-lg border border-border/50 ${config.authMode === 'token' ? 'bg-accent' : 'bg-card'} hover:bg-accent/50 transition-colors`}>
              <RadioGroupItem value="token" id="token" />
              <Label htmlFor="token" className="text-foreground cursor-pointer flex-1">
                <div>
                  <div className="font-medium">Token Authentication</div>
                  <div className="text-sm text-muted-foreground">Use a Vault token for authentication</div>
                </div>
              </Label>
            </div>
            <div className={`flex items-center space-x-2 p-3 rounded-lg border border-border/50 ${config.authMode === 'approle' ? 'bg-accent' : 'bg-card'} hover:bg-accent/50 transition-colors`}>
              <RadioGroupItem value="approle" id="approle" />
              <Label htmlFor="approle" className="text-foreground cursor-pointer flex-1">
                <div>
                  <div className="font-medium">AppRole Authentication</div>
                  <div className="text-sm text-muted-foreground">Use Role ID and Secret ID for authentication</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8"
          >
            Continue to Authentication
          </Button>
        </div>
      </form>
    </div>
  );
};
