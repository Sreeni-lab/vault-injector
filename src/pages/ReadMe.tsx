import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, BookOpen, Key, Upload, Shield, Database, Server, AlertCircle, Lightbulb, FileJson, ChevronLeft, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useNavigate } from "react-router-dom";

interface Section {
    id: string;
    title: string;
    icon: any;
}

export const ReadMe = () => {
    const [activeSection, setActiveSection] = useState("overview");
    const navigate = useNavigate();

    const sections: Section[] = [
        { id: "overview", title: "Overview", icon: BookOpen },
        { id: "authentication", title: "Authentication", icon: Key },
        { id: "configuration", title: "Configuration", icon: Database },
        { id: "file-upload", title: "File Upload", icon: Upload },
        { id: "features", title: "Features", icon: Shield },
        { id: "best-practices", title: "Best Practices", icon: Lightbulb },
        { id: "troubleshooting", title: "Troubleshooting", icon: AlertCircle },
    ];

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setActiveSection(sectionId);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/')}
                            className="flex items-center"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back to App
                        </Button>
                    </div>
                    <div className="flex items-center ml-auto space-x-4">
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-64 border-r bg-background">
                    <div className="p-4 border-b">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-lg">VaultInjector</span>
                        </div>
                    </div>
                    <ScrollArea className="h-[calc(100vh-8.5rem)] py-4">
                        <div className="space-y-1 px-2">
                            {sections.map((section) => (
                                <Button
                                    key={section.id}
                                    variant={activeSection === section.id ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => scrollToSection(section.id)}
                                >
                                    <section.icon className="w-4 h-4 mr-2" />
                                    {section.title}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <ScrollArea className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <section id="overview" className="space-y-4">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                VaultInjector Documentation
                            </h1>
                            <Card className="p-6">
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    VaultInjector is a modern web-based tool designed to simplify the process of uploading secrets to HashiCorp Vault.
                                    It provides an intuitive interface for managing sensitive data while maintaining enterprise-grade security standards.
                                    This tool is the web evolution of a CLI utility, offering the same robust functionality with an enhanced user experience.
                                </p>
                                <div className="mt-6 space-y-4">
                                    <h3 className="text-lg font-semibold">Prerequisites</h3>
                                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                        <li>An accessible Vault server instance</li>
                                        <li>Valid authentication credentials (Token or AppRole)</li>
                                        <li>Proper permissions to store secrets</li>
                                        <li>Secrets prepared in CSV format</li>
                                    </ul>
                                </div>
                                <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
                                    <a
                                        href="https://www.vaultproject.io/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center hover:text-primary transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-1" />
                                        HashiCorp Vault Documentation
                                    </a>
                                </div>
                            </Card>
                        </section>

                        <section id="authentication" className="space-y-4">
                            <h2 className="text-3xl font-semibold">Authentication</h2>
                            <Card className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-medium flex items-center">
                                        <Shield className="w-5 h-5 mr-2 text-blue-500" />
                                        Authentication Methods
                                    </h3>
                                    <p className="text-muted-foreground">
                                        VaultInjector supports multiple authentication methods to securely connect with your Vault instance:
                                    </p>
                                    <ul className="space-y-4 mt-4">
                                        <li className="flex items-start space-x-2">
                                            <Key className="w-5 h-5 text-green-500 mt-1" />
                                            <div>
                                                <span className="font-medium">Token Authentication</span>
                                                <p className="text-sm text-muted-foreground">
                                                    Direct authentication using Vault tokens. To obtain a token:
                                                    <ul className="list-disc list-inside mt-2 ml-4">
                                                        <li>Log into your Vault UI</li>
                                                        <li>Click on the user menu in the left navigation bar</li>
                                                        <li>Select "Copy Token"</li>
                                                    </ul>
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <Server className="w-5 h-5 text-purple-500 mt-1" />
                                            <div>
                                                <span className="font-medium">AppRole Authentication</span>
                                                <p className="text-sm text-muted-foreground">
                                                    Role-based authentication requiring both Role ID and Secret ID. This method is recommended for automated processes and applications.
                                                    <ul className="list-disc list-inside mt-2 ml-4">
                                                        <li>More secure than token-based auth for automation</li>
                                                        <li>Supports fine-grained access control</li>
                                                        <li>Enables secret ID rotation</li>
                                                    </ul>
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                                    <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Important Notes:</h4>
                                    <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                                        <li>All paths must start with 'kv/data/'</li>
                                        <li>Avoid special characters in secret names</li>
                                        <li>Keep paths consistent across environments</li>
                                        <li>Use descriptive secret names</li>
                                    </ul>
                                </div>
                                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-lg">
                                    <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
                                        <AlertCircle className="w-5 h-5" />
                                        <h4 className="font-medium">Warning</h4>
                                    </div>
                                    <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                                        Ensure your secret paths and names follow your organization's naming conventions.
                                        Inconsistent naming can lead to difficulties in secret management and access control.
                                    </p>
                                </div>
                            </Card>
                        </section>

                        <section id="configuration" className="space-y-4">
                            <h2 className="text-3xl font-semibold">Configuration</h2>
                            <Card className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-medium flex items-center">
                                        <Database className="w-5 h-5 mr-2 text-blue-500" />
                                        Secrets Engine Setup
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Configure your secrets engine and path settings. The application currently supports KV v2 secrets engine.
                                    </p>
                                    <div className="mt-4 space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                                <span className="font-semibold text-blue-700 dark:text-blue-300">1</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Secrets Path Structure</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Format: kv/data/path/to/secrets<br />
                                                    Example: kv/data/myapp/production
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                                <span className="font-semibold text-blue-700 dark:text-blue-300">2</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Secret Name</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    A unique identifier for your secret within the path<br />
                                                    Example: database-credentials
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                                <span className="font-semibold text-blue-700 dark:text-blue-300">3</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Secret Data</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Key-value pairs containing your secret data<br />
                                                    Example: username=admin, password=secret123
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </section>

                        <section id="file-upload" className="space-y-4">
                            <h2 className="text-3xl font-semibold">File Upload</h2>
                            <Card className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-medium flex items-center">
                                        <FileText className="w-5 h-5 mr-2 text-blue-500" />
                                        CSV File Structure
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Your secrets should be organized in a CSV file with the following structure:
                                    </p>
                                    <pre className="bg-muted p-4 rounded-lg mt-4 overflow-x-auto">
                                        <code>{`SECRET_NAME,SECRET_KEY,SECRET_VALUE
INSTALL_OWNER_PASSWORD,dcs-pg-0.dcs-pg.documentum.svc.cluster.local,Password@12345
INSTALL_OWNER_PASSWORD,dctm_docbase,Password@12345
PRIMARY_DOCBASE_INSTALL_OWNER_PASSWORD,dctm_docbase,Password@12345
AdminPassword,AdminPassword,YEY22h@t4S=`}</code>
                                    </pre>
                                    <div className="mt-6 space-y-4">
                                        <h4 className="font-medium">CSV Format Requirements:</h4>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                                            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                                                <li>The first row must contain the headers: SECRET_NAME,SECRET_KEY,SECRET_VALUE</li>
                                                <li>SECRET_NAME: Groups related secrets together</li>
                                                <li>SECRET_KEY: The specific identifier for the secret</li>
                                                <li>SECRET_VALUE: The actual secret value to be stored</li>
                                                <li>No empty rows or cells are allowed</li>
                                                <li>Avoid using commas in the values to prevent parsing issues</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-lg">
                                        <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
                                            <Lightbulb className="w-5 h-5" />
                                            <h4 className="font-medium">CSV File Tips</h4>
                                        </div>
                                        <ul className="mt-2 space-y-2 text-amber-700 dark:text-amber-300">
                                            <li>• Use consistent naming conventions for SECRET_NAME and SECRET_KEY</li>
                                            <li>• Keep the file well-organized with related secrets grouped together</li>
                                            <li>• Double-check all values before upload</li>
                                            <li>• Consider using a text editor with CSV support for proper formatting</li>
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        </section>

                        <section id="features" className="space-y-4">
                            <h2 className="text-3xl font-semibold">Features</h2>
                            <Card className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg border bg-card">
                                        <Shield className="w-6 h-6 text-blue-500 mb-2" />
                                        <h3 className="font-medium">Secure Authentication</h3>
                                        <p className="text-sm text-muted-foreground">Multiple auth methods with enterprise support</p>
                                    </div>
                                    <div className="p-4 rounded-lg border bg-card">
                                        <Upload className="w-6 h-6 text-purple-500 mb-2" />
                                        <h3 className="font-medium">Bulk Upload</h3>
                                        <p className="text-sm text-muted-foreground">Upload multiple secrets in one operation</p>
                                    </div>
                                    <div className="p-4 rounded-lg border bg-card">
                                        <Database className="w-6 h-6 text-green-500 mb-2" />
                                        <h3 className="font-medium">KV v2 Support</h3>
                                        <p className="text-sm text-muted-foreground">Full support for versioned secrets</p>
                                    </div>
                                    <div className="p-4 rounded-lg border bg-card">
                                        <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
                                        <h3 className="font-medium">Error Handling</h3>
                                        <p className="text-sm text-muted-foreground">Comprehensive error reporting and validation</p>
                                    </div>
                                </div>
                            </Card>
                        </section>

                        <section id="best-practices" className="space-y-4">
                            <h2 className="text-3xl font-semibold">Best Practices</h2>
                            <Card className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <Lightbulb className="w-6 h-6 text-yellow-500 mt-1" />
                                        <div>
                                            <h3 className="font-medium">Security Recommendations</h3>
                                            <ul className="mt-2 space-y-2 text-muted-foreground">
                                                <li>• Always use HTTPS URLs for your Vault server</li>
                                                <li>• Implement the principle of least privilege for tokens</li>
                                                <li>• Regularly rotate authentication credentials</li>
                                                <li>• Use namespaces to isolate environments (Enterprise)</li>
                                                <li>• Verify your secrets after upload</li>
                                                <li>• Keep secret paths organized and meaningful</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Shield className="w-6 h-6 text-blue-500 mt-1" />
                                        <div>
                                            <h3 className="font-medium">Usage Guidelines</h3>
                                            <ul className="mt-2 space-y-2 text-muted-foreground">
                                                <li>• Use descriptive secret names in your CSV files</li>
                                                <li>• Validate CSV format before upload</li>
                                                <li>• Keep secrets organized by environment/application</li>
                                                <li>• Document secret rotation procedures</li>
                                                <li>• Monitor upload status and verify success</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </section>

                        <section id="troubleshooting" className="space-y-4">
                            <h2 className="text-3xl font-semibold">Troubleshooting</h2>
                            <Card className="p-6">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-medium flex items-center">
                                            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                                            Common Issues
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
                                                <h4 className="font-medium text-red-800 dark:text-red-200 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-2" />
                                                    Authentication Failures
                                                </h4>
                                                <p className="mt-2 space-y-1 text-red-700 dark:text-red-300">
                                                    • Verify token validity and permissions<br />
                                                    • Check token expiration<br />
                                                    • Confirm namespace if using Enterprise<br />
                                                    • Validate AppRole credentials
                                                </p>
                                            </div>
                                            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                                                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-2" />
                                                    Permission Denied
                                                </h4>
                                                <p className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-300">
                                                    • Review token policies<br />
                                                    • Check path permissions<br />
                                                    • Verify secret engine access<br />
                                                    • Confirm namespace permissions
                                                </p>
                                            </div>
                                            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg">
                                                <h4 className="font-medium text-blue-800 dark:text-blue-200 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-2" />
                                                    Connection Issues
                                                </h4>
                                                <p className="mt-2 space-y-1 text-blue-700 dark:text-blue-300">
                                                    • Verify Vault server is accessible<br />
                                                    • Check HTTPS/TLS configuration<br />
                                                    • Confirm network connectivity<br />
                                                    • Validate server URL format
                                                </p>
                                            </div>
                                            <div className="p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-900 rounded-lg">
                                                <h4 className="font-medium text-purple-800 dark:text-purple-200 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-2" />
                                                    CSV Format Issues
                                                </h4>
                                                <p className="mt-2 space-y-1 text-purple-700 dark:text-purple-300">
                                                    • Check CSV header format<br />
                                                    • Verify no empty cells exist<br />
                                                    • Ensure no commas in values<br />
                                                    • Validate row formatting
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-xl font-medium mb-4">Additional Resources</h3>
                                        <div className="space-y-2">
                                            <a
                                                href="https://www.vaultproject.io/docs"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                HashiCorp Vault Documentation
                                            </a>
                                            <a
                                                href="https://www.vaultproject.io/api-docs"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Vault API Documentation
                                            </a>
                                            <a
                                                href="https://www.vaultproject.io/docs/enterprise"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Vault Enterprise Features
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </section>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default ReadMe;