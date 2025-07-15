export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export interface VaultUrlValidationResult extends ValidationResult {
    normalizedUrl?: string;
}

export interface VaultPathValidationResult extends ValidationResult {
    normalizedPath?: string;
}

/**
 * Validates a Vault URL
 * @param url - The vault URL to validate
 * @returns ValidationResult with validation status and error message if invalid
 */
export function validateVaultUrl(url: string): VaultUrlValidationResult {
    if (!url || url.trim() === '') {
        return {
            isValid: false,
            error: 'Vault URL is required'
        };
    }

    const trimmedUrl = url.trim();

    // Check if it's a valid URL format
    try {
        const urlObj = new URL(trimmedUrl);

        // Ensure it's an HTTP or HTTPS URL
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
            return {
                isValid: false,
                error: 'Vault URL must use HTTP or HTTPS protocol'
            };
        }

        // Check if hostname is provided
        if (!urlObj.hostname) {
            return {
                isValid: false,
                error: 'Vault URL must include a valid hostname'
            };
        }

        // Remove trailing slash for consistency
        const normalizedUrl = urlObj.toString().replace(/\/$/, '');

        return {
            isValid: true,
            normalizedUrl
        };
    } catch (error) {
        return {
            isValid: false,
            error: 'Please enter a valid URL (e.g., https://vault.example.com)'
        };
    }
}

/**
 * Validates a Vault secrets path
 * @param path - The vault path to validate
 * @returns ValidationResult with validation status and error message if invalid
 */
export function validateVaultPath(path: string): VaultPathValidationResult {
    if (!path || path.trim() === '') {
        return {
            isValid: false,
            error: 'Secrets path is required'
        };
    }

    const trimmedPath = path.trim();

    // Check for invalid characters
    const invalidChars = /[<>:"|?*]/;
    if (invalidChars.test(trimmedPath)) {
        return {
            isValid: false,
            error: 'Path contains invalid characters. Avoid: < > : " | ? *'
        };
    }

    // Check for consecutive slashes
    if (trimmedPath.includes('//')) {
        return {
            isValid: false,
            error: 'Path cannot contain consecutive slashes'
        };
    }

    // Check for leading slash
    if (trimmedPath.startsWith('/')) {
        return {
            isValid: false,
            error: 'Path should not start with a slash'
        };
    }

    // Check for trailing slash
    if (trimmedPath.endsWith('/')) {
        return {
            isValid: false,
            error: 'Path should not end with a slash'
        };
    }

    // Validate path segments
    const segments = trimmedPath.split('/').filter(segment => segment.length > 0);

    if (segments.length === 0) {
        return {
            isValid: false,
            error: 'Path must contain at least one segment'
        };
    }

    // Check each segment for valid characters and length
    for (const segment of segments) {
        if (segment.length === 0) {
            return {
                isValid: false,
                error: 'Path segments cannot be empty'
            };
        }

        if (segment.length > 255) {
            return {
                isValid: false,
                error: 'Path segments cannot exceed 255 characters'
            };
        }

        // Check for valid segment characters (alphanumeric, hyphens, underscores, dots)
        const validSegmentChars = /^[a-zA-Z0-9\-_.]+$/;
        if (!validSegmentChars.test(segment)) {
            return {
                isValid: false,
                error: 'Path segments can only contain letters, numbers, hyphens, underscores, and dots'
            };
        }
    }

    // Check if path starts with kv/data (recommended but not required)
    const normalizedPath = trimmedPath.toLowerCase();
    if (!normalizedPath.startsWith('kv/data/')) {
        return {
            isValid: true,
            normalizedPath: trimmedPath,
            error: 'Warning: Path should typically start with "kv/data/" for KV v2 secrets engine'
        };
    }

    return {
        isValid: true,
        normalizedPath: trimmedPath
    };
}

/**
 * Validates namespace (optional field)
 * @param namespace - The namespace to validate
 * @returns ValidationResult with validation status and error message if invalid
 */
export function validateNamespace(namespace: string): ValidationResult {
    if (!namespace || namespace.trim() === '') {
        return { isValid: true }; // Namespace is optional
    }

    const trimmedNamespace = namespace.trim();

    // Check for invalid characters
    const invalidChars = /[<>:"|?*]/;
    if (invalidChars.test(trimmedNamespace)) {
        return {
            isValid: false,
            error: 'Namespace contains invalid characters. Avoid: < > : " | ? *'
        };
    }

    // Check for consecutive slashes
    if (trimmedNamespace.includes('//')) {
        return {
            isValid: false,
            error: 'Namespace cannot contain consecutive slashes'
        };
    }

    // Check for leading slash
    if (trimmedNamespace.startsWith('/')) {
        return {
            isValid: false,
            error: 'Namespace should not start with a slash'
        };
    }

    // Check for trailing slash
    if (trimmedNamespace.endsWith('/')) {
        return {
            isValid: false,
            error: 'Namespace should not end with a slash'
        };
    }

    // Validate namespace segments
    const segments = trimmedNamespace.split('/').filter(segment => segment.length > 0);

    for (const segment of segments) {
        if (segment.length === 0) {
            return {
                isValid: false,
                error: 'Namespace segments cannot be empty'
            };
        }

        if (segment.length > 255) {
            return {
                isValid: false,
                error: 'Namespace segments cannot exceed 255 characters'
            };
        }

        // Check for valid segment characters (alphanumeric, hyphens, underscores, dots)
        const validSegmentChars = /^[a-zA-Z0-9\-_.]+$/;
        if (!validSegmentChars.test(segment)) {
            return {
                isValid: false,
                error: 'Namespace segments can only contain letters, numbers, hyphens, underscores, and dots'
            };
        }
    }

    return {
        isValid: true
    };
} 