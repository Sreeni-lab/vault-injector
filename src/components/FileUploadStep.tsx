import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, AlertCircle, CheckCircle } from "lucide-react";
import { SecretData } from "@/pages/Index";
import { toast } from "sonner";
import axios from "axios";

interface FileUploadStepProps {
  secrets: SecretData[];
  setSecrets: (secrets: SecretData[]) => void;
  onNext: () => void;
  onPrev: () => void;
  config: any;
}

export const FileUploadStep = ({ secrets, setSecrets, onNext, onPrev, config }: FileUploadStepProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalSecrets, setTotalSecrets] = useState(0);
  const [processedSecrets, setProcessedSecrets] = useState(0);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error("Please select a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      parseCSV(csv);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvContent: string) => {
    const lines = csvContent.trim().split('\n');
    const errors: string[] = [];
    const parsedSecrets: SecretData[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const [SECRET_NAME, SECRET_KEY, SECRET_VALUE] = line.split(',').map(item =>
        item.trim().replace(/^["']|["']$/g, '')
      );

      if (!SECRET_NAME || !SECRET_KEY || !SECRET_VALUE) {
        errors.push(`Line ${i + 1}: Missing required fields`);
        continue;
      }

      parsedSecrets.push({
        SECRET_NAME: SECRET_NAME.replace(/\r\n/g, ''),
        SECRET_KEY: SECRET_KEY.replace(/\r\n/g, ''),
        SECRET_VALUE: SECRET_VALUE.replace(/\r\n/g, '')
      });
    }

    setValidationErrors(errors);
    setSecrets(parsedSecrets);

    if (errors.length === 0) {
      toast.success(`Successfully parsed ${parsedSecrets.length} secrets`);
    } else {
      toast.error(`Found ${errors.length} validation errors`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearFile = () => {
    setSecrets([]);
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadSample = () => {
    const sampleCSV = `SECRET_NAME,SECRET_KEY,SECRET_VALUE
api-service,database_url,postgresql://user:pass@localhost:5432/db
api-service,api_key,sk-1234567890abcdef
web-app,redis_url,redis://localhost:6379
web-app,session_secret,your-session-secret-here`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-secrets.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadStatus('idle');
    setUploadProgress(0);
    setProcessedSecrets(0);

    try {
      const text = await file.text();
      const rows = text.split('\n').filter(row => row.trim());
      const headers = rows[0].split(',').map(h => h.trim());
      const data = rows.slice(1);

      setTotalSecrets(data.length);

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const values = row.split(',').map(v => v.trim());
        const secretData: { [key: string]: string } = {};

        // Skip empty rows
        if (values.length !== headers.length || values.every(v => !v)) {
          continue;
        }

        // Build secret data object
        for (let j = 2; j < headers.length; j++) {
          secretData[headers[j]] = values[j];
        }

        const path = values[0];
        const secretName = values[1];

        try {
          const response = await axios.post('/api/vault/secrets', {
            url: config.url,
            token: config.token,
            namespace: config.namespace,
            path,
            secretName,
            data: secretData
          });

          if (!response.data.success) {
            throw new Error(`Failed to upload secret ${secretName}`);
          }

          setProcessedSecrets(prev => prev + 1);
          setUploadProgress(((i + 1) / data.length) * 100);

        } catch (error: any) {
          toast.error(`Error uploading ${secretName}: ${error.message}`);
          throw error;
        }
      }

      setUploadStatus('success');
      toast.success("All secrets uploaded successfully!");
      setTimeout(() => onNext(), 1000);

    } catch (error: any) {
      setUploadStatus('error');
      toast.error("Failed to process file: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-4">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Upload Secrets File</h2>
        <p className="text-muted-foreground">Upload a CSV file containing your secrets</p>
      </div>

      <Card className="p-6 bg-card/50 border-border">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-foreground">CSV File Format</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={downloadSample}
              className="border-border"
            >
              Download Sample
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg font-mono text-sm text-foreground overflow-x-auto">
            <div className="text-muted-foreground mb-2">Expected format:</div>
            <div className="whitespace-nowrap">SECRET_NAME,SECRET_KEY,SECRET_VALUE</div>
            <div className="whitespace-nowrap">api-service,database_url,postgresql://...</div>
            <div className="whitespace-nowrap">api-service,api_key,sk-1234567890abcdef</div>
          </div>
        </div>
      </Card>

      <Card
        className={`p-8 border-2 border-dashed transition-all duration-200 ${isDragOver
          ? 'border-primary bg-primary/10'
          : secrets.length > 0
            ? 'border-green-500 bg-green-500/10'
            : 'border-border/50 bg-card/50'
          }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="text-center">
          {secrets.length === 0 ? (
            <>
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? 'text-primary' : 'text-muted-foreground'
                }`} />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Drop your CSV file here
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse your files
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-border"
              >
                Browse Files
              </Button>
            </>
          ) : (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                File Uploaded Successfully
              </h3>
              <p className="text-muted-foreground mb-4">
                {secrets.length} secrets parsed from your CSV file
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-border"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Replace File
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFile}
                  className="border-border"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear File
                </Button>
              </div>
            </>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".csv"
          className="hidden"
        />
      </Card>

      {validationErrors.length > 0 && (
        <Card className="p-4 bg-destructive/10 border-destructive/30">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-destructive mr-3 mt-0.5" />
            <div>
              <div className="font-medium text-destructive mb-1">
                Validation Errors
              </div>
              <ul className="text-sm text-destructive space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
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
          Back to Authentication
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={secrets.length === 0}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
};
