
// Email validation utilities for institutional email detection

const INSTITUTIONAL_DOMAINS = [
    // US Educational Institutions
    '.edu',
    // India
    '.ac.in',
    '.edu.in',
    // UK
    '.ac.uk',
    // Australia
    '.edu.au',
    // Canada
    '.ca',
    // Europe
    '.edu.eu',
    // Add more as needed
];

export const emailValidator = {
    /**
     * Check if an email belongs to an educational institution
     */
    isInstitutionalEmail(email: string): boolean {
        if (!email || !email.includes('@')) return false;

        const domain = this.getEmailDomain(email).toLowerCase();

        return INSTITUTIONAL_DOMAINS.some(institutionalDomain =>
            domain.endsWith(institutionalDomain)
        );
    },

    /**
     * Extract domain from email address
     */
    getEmailDomain(email: string): string {
        const parts = email.split('@');
        return parts.length === 2 ? parts[1] : '';
    },

    /**
     * Validate email format
     */
    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Get verification level based on email type
     */
    getVerificationLevel(email: string): 'basic' | 'medium' | 'strong' {
        if (this.isInstitutionalEmail(email)) {
            return 'strong';
        }
        return 'basic';
    }
};
