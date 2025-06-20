import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AuthenticationStep } from "@/components/AuthenticationStep";
import { ConfigurationStep } from "@/components/ConfigurationStep";
import { FileUploadStep } from "@/components/FileUploadStep";
import { ProgressStep } from "@/components/ProgressStep";
import { Navigation } from "@/components/Navigation";
import { Shield, Database, Upload, CheckCircle } from "lucide-react";

export interface VaultConfig {
  url: string;
  namespace: string;
  secretsPath: string;
  authMode: 'token' | 'approle';
  token?: string;
  roleId?: string;
  secretId?: string;
}

export interface SecretData {
  SECRET_NAME: string;
  SECRET_KEY: string;
  SECRET_VALUE: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [vaultConfig, setVaultConfig] = useState<VaultConfig>({
    url: '',
    namespace: '',
    secretsPath: '',
    authMode: 'token'
  });
  const [secrets, setSecrets] = useState<SecretData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const steps = [
    { id: 1, title: "Configure Vault", icon: Database, description: "Set up your Vault connection" },
    { id: 2, title: "Authenticate", icon: Shield, description: "Login to your Vault instance" },
    { id: 3, title: "Upload Secrets", icon: Upload, description: "Upload your CSV file" },
    { id: 4, title: "Complete", icon: CheckCircle, description: "Review and deploy" }
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Effortless Secret Injection into HashiCorp Vault
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              VaultInjector is a lightweight, script-driven tool designed to simplify the process of importing secrets into HashiCorp Vault from a CSV file.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                  <div key={step.id} className="flex flex-col items-center relative z-10">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                      ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-110' :
                        isCompleted ? 'bg-green-500' : 'bg-muted dark:bg-muted/30'}
                    `}>
                      <Icon className={`w-6 h-6 ${isActive || isCompleted ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 max-w-24 text-center">
                      {step.description}
                    </span>
                  </div>
                );
              })}

              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted -z-10">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/50 border-border backdrop-blur-sm animate-scale-in">
              <div className="p-8">
                {currentStep === 1 && (
                  <ConfigurationStep
                    config={vaultConfig}
                    setConfig={setVaultConfig}
                    onNext={nextStep}
                  />
                )}

                {currentStep === 2 && (
                  <AuthenticationStep
                    config={vaultConfig}
                    setConfig={setVaultConfig}
                    onNext={nextStep}
                    onPrev={prevStep}
                    setIsAuthenticated={setIsAuthenticated}
                  />
                )}

                {currentStep === 3 && (
                  <FileUploadStep
                    secrets={secrets}
                    setSecrets={setSecrets}
                    onNext={nextStep}
                    onPrev={prevStep}
                  />
                )}

                {currentStep === 4 && (
                  <ProgressStep
                    config={vaultConfig}
                    secrets={secrets}
                    onPrev={prevStep}
                  />
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
