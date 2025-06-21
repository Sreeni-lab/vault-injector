import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Loader2, RefreshCw, Download } from "lucide-react";
import { VaultConfig, SecretData } from "@/pages/Index";
import { toast } from "sonner";

interface ProgressStepProps {
  config: VaultConfig;
  secrets: SecretData[];
  onPrev: () => void;
}

interface UploadResult {
  secretName: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

const PROXY_URL = '/api';

export const ProgressStep = ({ config, secrets, onPrev }: ProgressStepProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Initialize results
    const initialResults = secrets.reduce((acc, secret) => {
      const existing = acc.find(r => r.secretName === secret.SECRET_NAME);
      if (!existing) {
        acc.push({ secretName: secret.SECRET_NAME, status: 'pending' });
      }
      return acc;
    }, [] as UploadResult[]);

    setResults(initialResults);
  }, [secrets]);

  const groupSecretsByName = (secrets: SecretData[]) => {
    const grouped: { [key: string]: { [key: string]: string } } = {};

    secrets.forEach(secret => {
      if (!grouped[secret.SECRET_NAME]) {
        grouped[secret.SECRET_NAME] = {};
      }
      grouped[secret.SECRET_NAME][secret.SECRET_KEY] = secret.SECRET_VALUE;
    });

    return grouped;
  };

  const uploadSecrets = async () => {
    setIsUploading(true);
    setProgress(0);
    setIsComplete(false);

    const groupedSecrets = groupSecretsByName(secrets);
    const secretNames = Object.keys(groupedSecrets);
    let completedCount = 0;
    let newResults = [...results];

    for (const secretName of secretNames) {
      try {
        const response = await fetch(`${PROXY_URL}/vault/secrets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: config.url,
            token: config.token,
            namespace: config.namespace,
            path: config.secretsPath,
            secretName,
            data: groupedSecrets[secretName]
          })
        });

        const result = await response.json();

        if (result.success) {
          newResults = newResults.map(r =>
            r.secretName === secretName
              ? { ...r, status: 'success', message: 'Successfully stored' }
              : r
          );
        } else {
          newResults = newResults.map(r =>
            r.secretName === secretName
              ? { ...r, status: 'error', message: result.error || 'Failed to store secret' }
              : r
          );
        }
      } catch (error: any) {
        newResults = newResults.map(r =>
          r.secretName === secretName
            ? { ...r, status: 'error', message: error.message }
            : r
        );
      }

      completedCount++;
      setProgress((completedCount / secretNames.length) * 100);
      setResults(newResults);

      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsUploading(false);
    setIsComplete(true);

    // Calculate final counts after all updates are complete
    const finalSuccessCount = newResults.filter(r => r.status === 'success').length;
    const finalErrorCount = newResults.filter(r => r.status === 'error').length;

    if (finalErrorCount === 0) {
      toast.success(`All ${finalSuccessCount} secrets uploaded successfully!`);
    } else {
      toast.error(`${finalErrorCount} secrets failed to upload. ${finalSuccessCount} succeeded.`);
    }
  };

  const downloadReport = () => {
    const report = results.map(result => ({
      'Secret Name': result.secretName,
      'Status': result.status,
      'Message': result.message || ''
    }));

    const csv = [
      Object.keys(report[0]).join(','),
      ...report.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-upload-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetUpload = () => {
    setResults(prev => prev.map(r => ({ ...r, status: 'pending', message: undefined })));
    setProgress(0);
    setIsComplete(false);
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const uniqueSecrets = results.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-4">
          <CheckCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Upload Progress</h2>
        <p className="text-muted-foreground">Uploading {uniqueSecrets} unique secrets to Vault</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{uniqueSecrets}</div>
            <div className="text-sm text-muted-foreground">Total Secrets</div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{successCount}</div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{errorCount}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-foreground font-medium">Upload Progress</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      {/* Results List */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-foreground font-medium">Upload Results</span>
            {isComplete && (
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={downloadReport}
                  className="border-border"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetUpload}
                  className="border-border"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${result.status === 'success'
                  ? 'bg-green-500/5 border-green-500/20'
                  : result.status === 'error'
                    ? 'bg-destructive/5 border-destructive/20'
                    : 'bg-muted/50 border-border/50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  {result.status === 'pending' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
                  ) : result.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className="text-foreground font-medium">{result.secretName}</span>
                </div>
                <span className={`text-sm ${result.status === 'success'
                  ? 'text-green-500'
                  : result.status === 'error'
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                  }`}>
                  {result.status === 'pending' ? 'Waiting...' : result.message || result.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="border-border"
        >
          Back to File Upload
        </Button>
        <Button
          type="button"
          onClick={uploadSecrets}
          disabled={isUploading || results.length === 0}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload to Vault'
          )}
        </Button>
      </div>
    </div>
  );
};
