
// File validation utilities for document uploads

const ALLOWED_FILE_TYPES = {
    image: ['image/jpeg', 'image/jpg', 'image/png'],
    document: ['application/pdf'],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const fileValidator = {
    /**
     * Validate file type
     */
    validateFileType(file: File): { valid: boolean; error?: string } {
        const allowedTypes = [...ALLOWED_FILE_TYPES.image, ...ALLOWED_FILE_TYPES.document];

        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: 'Only PDF, JPG, and PNG files are allowed'
            };
        }

        return { valid: true };
    },

    /**
     * Validate file size
     */
    validateFileSize(file: File): { valid: boolean; error?: string } {
        if (file.size > MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
            };
        }

        return { valid: true };
    },

    /**
     * Validate file (type and size)
     */
    validateFile(file: File): { valid: boolean; error?: string } {
        const typeValidation = this.validateFileType(file);
        if (!typeValidation.valid) return typeValidation;

        const sizeValidation = this.validateFileSize(file);
        if (!sizeValidation.valid) return sizeValidation;

        return { valid: true };
    },

    /**
     * Generate preview URL for file
     */
    generateFilePreview(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!ALLOWED_FILE_TYPES.image.includes(file.type)) {
                resolve(''); // No preview for PDFs
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target?.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    /**
     * Format file size for display
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
};
