{{/*
Expand the name of the chart.
*/}}
{{- define "vaultinjector.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "vaultinjector.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "vaultinjector.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "vaultinjector.labels" -}}
helm.sh/chart: {{ include "vaultinjector.chart" . }}
{{ include "vaultinjector.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- with .Values.commonLabels }}
{{ toYaml . }}
{{- end }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "vaultinjector.selectorLabels" -}}
app.kubernetes.io/name: {{ include "vaultinjector.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
UI fullname
*/}}
{{- define "vaultinjector.ui.fullname" -}}
{{- printf "%s-%s" (include "vaultinjector.fullname" .) .Values.ui.name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Server fullname
*/}}
{{- define "vaultinjector.server.fullname" -}}
{{- printf "%s-%s" (include "vaultinjector.fullname" .) .Values.server.name | trunc 63 | trimSuffix "-" }}
{{- end }} 