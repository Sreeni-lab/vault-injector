# Vault Injector Helm Chart

This Helm chart deploys the Vault Injector application, consisting of a UI and server service.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- Docker images for both UI and server services

## Installation

1. First, build and push your Docker images:
```bash
# Build UI
docker build -t your-registry/vaultinjector-ui:latest -f Dockerfile.frontend .
docker push your-registry/vaultinjector-ui:latest

# Build server
docker build -t your-registry/vaultinjector-server:latest -f Dockerfile.server .
docker push your-registry/vaultinjector-server:latest
```

2. Update the values.yaml file with your image repositories:
```yaml
ui:
  image:
    repository: your-registry/vaultinjector-ui
    tag: latest

server:
  image:
    repository: your-registry/vaultinjector-server
    tag: latest
```

3. Install the chart:
```bash
helm install vaultinjector ./helm/vaultinjector
```

## Configuration

The following table lists the configurable parameters of the chart and their default values.

### UI Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `ui.replicaCount` | Number of UI replicas | `1` |
| `ui.image.repository` | UI image repository | `vaultinjector-ui` |
| `ui.image.tag` | UI image tag | `latest` |
| `ui.service.type` | UI service type | `ClusterIP` |
| `ui.service.port` | UI service port | `8080` |
| `ui.ingress.enabled` | Enable ingress for UI | `false` |

### Server Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `server.replicaCount` | Number of server replicas | `1` |
| `server.image.repository` | Server image repository | `vaultinjector-server` |
| `server.image.tag` | Server image tag | `latest` |
| `server.service.type` | Server service type | `ClusterIP` |
| `server.service.port` | Server service port | `3000` |

## Accessing the Application

By default, the application is accessible through the cluster's internal network. To expose it externally:

1. Enable the ingress in values.yaml:
```yaml
ui:
  ingress:
    enabled: true
    className: "nginx"
    hosts:
      - host: vaultinjector.your-domain.com
        paths:
          - path: /
            pathType: Prefix
```

2. Update your DNS records to point to the ingress controller's IP address.

## Scaling

You can scale the application by adjusting the `replicaCount` in values.yaml:

```yaml
ui:
  replicaCount: 3

server:
  replicaCount: 2
```

## Troubleshooting

1. Check pod status:
```bash
kubectl get pods -l "app.kubernetes.io/name=vaultinjector"
```

2. View pod logs:
```bash
# UI logs
kubectl logs -l "app.kubernetes.io/component=ui"

# Server logs
kubectl logs -l "app.kubernetes.io/component=server"
``` 