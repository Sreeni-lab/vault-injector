# Vault Injector – Automatically Create and Manage Secrets in HashiCorp Vault

Vault Injector is an open-source modern web-based **secrets automation tool** that simplifies **injecting and managing secrets in HashiCorp Vault** for containerized environments like Kubernetes and Docker. 

Designed for DevOps and security teams, Vault Injector enables you to **automatically create Vault secrets** based on your deployment metadata and securely inject them into your applications. This eliminates the need for manual secret management, enhances security posture, and integrates smoothly with Kubernetes pods or Docker containers.

Whether you're looking to **automate Vault secret injection** or **manage secrets dynamically**, Vault Injector offers a lightweight, extensible solution to improve your DevSecOps workflows.


## Key Features

- **Automated Vault Secret Creation** — Generate and inject secrets into Vault dynamically based on deployment data  
- **Supports Kubernetes and Docker** — Works seamlessly in containerized environments  
- **Secure Authentication Methods** — Token and AppRole authentication with fine-grained access control  
- **Bulk Upload via CSV** — Manage multiple secrets efficiently with CSV file uploads  
- **KV Secrets Engine v2 Support** — Full compatibility with Vault’s versioned key-value store  
- **CORS-enabled API and Web UI** — Easy integration and interaction with frontend and backend services  
- **Comprehensive Error Handling** — Detailed validation and error reporting for smooth operations  


### Prerequisites

  * An accessible Vault server instance
  * Valid authentication credentials (Token or AppRole)
  * Proper permissions to store secrets
  * Secrets prepared in CSV format
  * Docker and Docker Compose installed on your machine.  
  * For installation guides:  
    - [Docker](https://docs.docker.com/get-docker/)  
    - [Docker Compose](https://docs.docker.com/compose/install/)

[HashiCorp Vault Documentation](https://www.vaultproject.io/)

---

## Installation Instructions

### Running Vault Injector Locally with Docker Compose

Follow the steps below to build and run Vault Injector locally using Docker Compose.

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Sreeni-lab/vault-injector.git
    cd vault-injector
    ```

2.  **Build and start the services**

    From the root of the repository, run the following command to build and start your services:

    ```bash
    docker-compose up --build -d
    ```

    This command will:
    * Build the backend server image from `Dockerfile.server`.
    * Build the frontend image from `Dockerfile.frontend`.
    * Start both services with automatic restart enabled.



### Accessing the application

* **Frontend UI**: Open your browser and navigate to `http://localhost:3000`.
* **Backend API**: The API is accessible internally at `http://vaultinjector-server:8080` within the Docker network, or from your host machine at `http://localhost:8080`.


### Stopping the services

To stop the containers gracefully, run the following command:

```bash
docker-compose down
```

## Authentication

### Authentication Methods

VaultInjector supports multiple authentication methods to securely connect with your Vault instance:

  * **Token Authentication**
    Direct authentication using Vault tokens. To obtain a token:

      * Log into your Vault UI
      * Click on the user menu in the left navigation bar
      * Select "Copy Token"

  * **AppRole Authentication**
    Role-based authentication requiring both Role ID and Secret ID. This method is recommended for automated processes and applications.

      * More secure than token-based auth for automation
      * Supports fine-grained access control
      * Enables secret ID rotation

#### Important Notes:

  * All paths must start with 'kv/data/'
  * Avoid special characters in secret names
  * Keep paths consistent across environments
  * Use descriptive secret names

#### Warning

Ensure your secret paths and names follow your organization's naming conventions. Inconsistent naming can lead to difficulties in secret management and access control.

-----

## Configuration

### Secrets Engine Setup

Configure your secrets engine and path settings. The application currently supports KV v2 secrets engine.

1.  **Secrets Path Structure**
    Format: kv/data/path/to/secrets
    Example: kv/data/myapp/production
2.  **Secret Name**
    A unique identifier for your secret within the path
    Example: database-credentials
3.  **Secret Data**
    Key-value pairs containing your secret data
    Example: username=admin, password=secret123

-----

## File Upload

### CSV File Structure

Your secrets should be organized in a CSV file with the following structure:

```
SECRET_NAME,SECRET_KEY,SECRET_VALUE
INSTALL_OWNER_PASSWORD,dcs-pg-0.dcs-pg.documentum.svc.cluster.local,Password@12345
INSTALL_OWNER_PASSWORD,dctm_docbase,Password@12345
PRIMARY_DOCBASE_INSTALL_OWNER_PASSWORD,dctm_docbase,Password@12345
AdminPassword,AdminPassword,YEY22h@t4S=
```

#### CSV Format Requirements:

  * The first row must contain the headers: SECRET\_NAME,SECRET\_KEY,SECRET\_VALUE
  * SECRET\_NAME: Groups related secrets together
  * SECRET\_KEY: The specific identifier for the secret
  * SECRET\_VALUE: The actual secret value to be stored
  * No empty rows or cells are allowed
  * Avoid using commas in the values to prevent parsing issues

#### CSV File Tips

  * Use consistent naming conventions for SECRET\_NAME and SECRET\_KEY
  * Keep the file well-organized with related secrets grouped together
  * Double-check all values before upload
  * Consider using a text editor with CSV support for proper formatting

-----

## Features

  * **Secure Authentication**: Multiple auth methods with enterprise support
  * **Bulk Upload**: Upload multiple secrets in one operation
  * **KV v2 Support**: Full support for versioned secrets
  * **Error Handling**: Comprehensive error reporting and validation

-----

## Best Practices

### Security Recommendations

  * Always use HTTPS URLs for your Vault server
  * Implement the principle of least privilege for tokens
  * Regularly rotate authentication credentials
  * Use namespaces to isolate environments (Enterprise)
  * Verify your secrets after upload
  * Keep secret paths organized and meaningful

### Usage Guidelines

  * Use descriptive secret names in your CSV files
  * Validate CSV format before upload
  * Keep secrets organized by environment/application
  * Document secret rotation procedures
  * Monitor upload status and verify success

-----

## Troubleshooting

### Common Issues

  * **Authentication Failures**

      * Verify token validity and permissions
      * Check token expiration
      * Confirm namespace if using Enterprise
      * Validate AppRole credentials

  * **Permission Denied**

      * Review token policies
      * Check path permissions
      * Verify secret engine access
      * Confirm namespace permissions

  * **Connection Issues**

      * Verify Vault server is accessible
      * Check HTTPS/TLS configuration
      * Confirm network connectivity
      * Validate server URL format

  * **CSV Format Issues**

      * Check CSV header format
      * Verify no empty cells exist
      * Ensure no commas in values
      * Validate row formatting