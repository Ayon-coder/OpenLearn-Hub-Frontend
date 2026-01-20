/**
 * Learning Paths Data
 * Pre-built learning paths for Tech Skills, BSc Subjects, and Competitive Exams
 */

// ============================================
// TYPES
// ============================================

export type LearningCategory = 'tech' | 'bsc' | 'competitive';
export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LearningResource {
    id: string;
    title: string;
    description: string;
    contentId?: string;                    // Internal platform content ID
    externalUrl?: string;                  // External fallback URL
    platform: 'internal' | 'youtube' | 'coursera' | 'freecodecamp' | 'khan-academy';
    duration: string;                      // e.g., "45 mins", "2 hours"
    type: 'video' | 'article' | 'practice' | 'project';
}

export interface LearningCourse {
    id: string;
    title: string;
    description: string;
    resources: LearningResource[];
    estimatedHours: number;
}

export interface LearningPath {
    id: string;
    category: LearningCategory;
    domain: string;
    domainIcon: string;
    level: LearningLevel;
    title: string;
    description: string;
    courses: LearningCourse[];
    totalHours: number;
    totalResources: number;
}

// ============================================
// CATEGORY DEFINITIONS
// ============================================

export const LEARNING_CATEGORIES = [
    { id: 'tech', label: 'Tech Skills', icon: '💻', color: 'blue' },
    { id: 'bsc', label: 'BSc Subjects', icon: '🎓', color: 'green' },
    { id: 'competitive', label: 'Competitive Exams', icon: '🏆', color: 'orange' }
] as const;

export const DOMAINS_BY_CATEGORY: Record<LearningCategory, { id: string; label: string; icon: string }[]> = {
    tech: [
        { id: 'web-dev', label: 'Web Development', icon: '🌐' },
        { id: 'app-dev', label: 'App Development', icon: '📱' },
        { id: 'ml', label: 'Machine Learning', icon: '🤖' },
        { id: 'data-science', label: 'Data Science', icon: '📊' }
    ],
    bsc: [
        { id: 'mathematics', label: 'Mathematics', icon: '📐' },
        { id: 'chemistry', label: 'Chemistry', icon: '⚗️' },
        { id: 'physics', label: 'Physics', icon: '⚛️' }
    ],
    competitive: [
        { id: 'jee-2026', label: 'JEE 2026', icon: '🎯' },
        { id: 'neet-2026', label: 'NEET 2026', icon: '🏥' }
    ]
};

export const LEVELS = [
    { id: 'beginner', label: 'Beginner', icon: '🌱', color: 'green' },
    { id: 'intermediate', label: 'Intermediate', icon: '🌿', color: 'blue' },
    { id: 'advanced', label: 'Advanced', icon: '🌳', color: 'purple' }
] as const;

// ============================================
// LEARNING PATHS DATA
// ============================================

export const LEARNING_PATHS: LearningPath[] = [
    // ==========================================
    // TECH SKILLS - WEB DEVELOPMENT
    // ==========================================
    {
        id: 'web-dev-beginner',
        category: 'tech',
        domain: 'web-dev',
        domainIcon: '🌐',
        level: 'beginner',
        title: 'Web Development Fundamentals',
        description: 'Start your web dev journey with HTML, CSS, and JavaScript basics',
        totalHours: 25,
        totalResources: 12,
        courses: [
            {
                id: 'html-basics',
                title: 'HTML Fundamentals',
                description: 'Learn the building blocks of web pages',
                estimatedHours: 6,
                resources: [
                    {
                        id: 'html-1',
                        title: 'HTML Crash Course',
                        description: 'Complete HTML tutorial for beginners',
                        externalUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
                        platform: 'youtube',
                        duration: '1 hour',
                        type: 'video'
                    },
                    {
                        id: 'html-2',
                        title: 'HTML Forms & Tables',
                        description: 'Master forms, inputs, and tables in HTML',
                        externalUrl: 'https://www.youtube.com/watch?v=fNcJuPIZ2WE',
                        platform: 'youtube',
                        duration: '45 mins',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'css-basics',
                title: 'CSS Styling',
                description: 'Make your websites beautiful with CSS',
                estimatedHours: 8,
                resources: [
                    {
                        id: 'css-1',
                        title: 'CSS Complete Course',
                        description: 'Learn CSS from scratch',
                        externalUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
                        platform: 'youtube',
                        duration: '2 hours',
                        type: 'video'
                    },
                    {
                        id: 'css-2',
                        title: 'Flexbox & Grid',
                        description: 'Master modern CSS layouts',
                        externalUrl: 'https://www.youtube.com/watch?v=JJSoEo8JSnc',
                        platform: 'youtube',
                        duration: '1.5 hours',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'js-basics',
                title: 'JavaScript Basics',
                description: 'Add interactivity with JavaScript',
                estimatedHours: 11,
                resources: [
                    {
                        id: 'js-1',
                        title: 'JavaScript for Beginners',
                        description: 'Complete JavaScript tutorial',
                        contentId: 'content_11',
                        platform: 'internal',
                        duration: '2 hours',
                        type: 'video'
                    },
                    {
                        id: 'js-2',
                        title: 'JavaScript DOM Manipulation',
                        description: 'Learn to manipulate web pages',
                        externalUrl: 'https://www.youtube.com/watch?v=5fb2aPlgoys',
                        platform: 'youtube',
                        duration: '1.5 hours',
                        type: 'video'
                    }
                ]
            }
        ]
    },
    {
        id: 'web-dev-intermediate',
        category: 'tech',
        domain: 'web-dev',
        domainIcon: '🌐',
        level: 'intermediate',
        title: 'Modern Web Development',
        description: 'Build dynamic web apps with React and APIs',
        totalHours: 40,
        totalResources: 15,
        courses: [
            {
                id: 'react-fundamentals',
                title: 'React.js Fundamentals',
                description: 'Build modern UIs with React',
                estimatedHours: 15,
                resources: [
                    {
                        id: 'react-1',
                        title: 'React Hooks Complete Guide',
                        description: 'useState, useEffect, useContext, and custom hooks',
                        contentId: 'content_7',
                        platform: 'internal',
                        duration: '2 hours',
                        type: 'video'
                    },
                    {
                        id: 'react-2',
                        title: 'React Full Course',
                        description: 'Complete React tutorial',
                        externalUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
                        platform: 'youtube',
                        duration: '4 hours',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'apis-fetch',
                title: 'Working with APIs',
                description: 'Connect your frontend to backends',
                estimatedHours: 10,
                resources: [
                    {
                        id: 'api-1',
                        title: 'REST APIs Explained',
                        description: 'Understand RESTful services',
                        externalUrl: 'https://www.youtube.com/watch?v=-MTSQjw5DrM',
                        platform: 'youtube',
                        duration: '1 hour',
                        type: 'video'
                    },
                    {
                        id: 'api-2',
                        title: 'Fetch API & Axios',
                        description: 'Make HTTP requests in JavaScript',
                        externalUrl: 'https://www.youtube.com/watch?v=cuEtnrL9-H0',
                        platform: 'youtube',
                        duration: '30 mins',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'node-basics',
                title: 'Node.js Basics',
                description: 'Backend development with JavaScript',
                estimatedHours: 15,
                resources: [
                    {
                        id: 'node-1',
                        title: 'Node.js Crash Course',
                        description: 'Learn Node.js fundamentals',
                        externalUrl: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
                        platform: 'youtube',
                        duration: '1.5 hours',
                        type: 'video'
                    }
                ]
            }
        ]
    },
    {
        id: 'web-dev-advanced',
        category: 'tech',
        domain: 'web-dev',
        domainIcon: '🌐',
        level: 'advanced',
        title: 'Full-Stack Mastery',
        description: 'Build production-ready full-stack applications',
        totalHours: 50,
        totalResources: 18,
        courses: [
            {
                id: 'fullstack-architecture',
                title: 'Full-Stack Architecture',
                description: 'Design scalable applications',
                estimatedHours: 20,
                resources: [
                    {
                        id: 'fullstack-1',
                        title: 'MERN Stack Complete Course',
                        description: 'MongoDB, Express, React, Node.js',
                        externalUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
                        platform: 'youtube',
                        duration: '5 hours',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'auth-security',
                title: 'Authentication & Security',
                description: 'Secure your web applications',
                estimatedHours: 15,
                resources: [
                    {
                        id: 'auth-1',
                        title: 'JWT Authentication',
                        description: 'Implement secure authentication',
                        externalUrl: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
                        platform: 'youtube',
                        duration: '1 hour',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'deployment',
                title: 'Deployment & DevOps',
                description: 'Deploy to production',
                estimatedHours: 15,
                resources: [
                    {
                        id: 'deploy-1',
                        title: 'Deploy Full-Stack Apps',
                        description: 'Vercel, Netlify, and Railway deployment',
                        externalUrl: 'https://www.youtube.com/watch?v=l134cBAJCuc',
                        platform: 'youtube',
                        duration: '45 mins',
                        type: 'video'
                    }
                ]
            }
        ]
    },

    // ==========================================
    // TECH SKILLS - MACHINE LEARNING
    // ==========================================
    {
        id: 'ml-beginner',
        category: 'tech',
        domain: 'ml',
        domainIcon: '🤖',
        level: 'beginner',
        title: 'Machine Learning Foundations',
        description: 'Start your ML journey with Python and essential libraries',
        totalHours: 30,
        totalResources: 14,
        courses: [
            {
                id: 'python-ml',
                title: 'Python for ML',
                description: 'Python programming essentials for machine learning',
                estimatedHours: 10,
                resources: [
                    {
                        id: 'python-ml-1',
                        title: 'Python Loops Tutorial',
                        description: 'For, while, and nested loops in Python',
                        contentId: 'content_3',
                        platform: 'internal',
                        duration: '1 hour',
                        type: 'video'
                    },
                    {
                        id: 'python-ml-2',
                        title: 'Python for Data Science',
                        description: 'Python fundamentals for ML',
                        externalUrl: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
                        platform: 'youtube',
                        duration: '3 hours',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'numpy-pandas',
                title: 'NumPy & Pandas',
                description: 'Essential data manipulation libraries',
                estimatedHours: 12,
                resources: [
                    {
                        id: 'numpy-1',
                        title: 'NumPy Complete Tutorial',
                        description: 'Master NumPy arrays and operations',
                        externalUrl: 'https://www.youtube.com/watch?v=QUT1VHiLmmI',
                        platform: 'youtube',
                        duration: '1.5 hours',
                        type: 'video'
                    },
                    {
                        id: 'pandas-1',
                        title: 'Pandas for Data Analysis',
                        description: 'Data manipulation with Pandas',
                        externalUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
                        platform: 'youtube',
                        duration: '2 hours',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'ml-basics',
                title: 'ML Concepts',
                description: 'Understanding machine learning fundamentals',
                estimatedHours: 8,
                resources: [
                    {
                        id: 'ml-basics-1',
                        title: 'Machine Learning Basics',
                        description: 'Introduction to ML concepts',
                        contentId: 'content_6',
                        platform: 'internal',
                        duration: '1.5 hours',
                        type: 'video'
                    }
                ]
            }
        ]
    },
    {
        id: 'ml-intermediate',
        category: 'tech',
        domain: 'ml',
        domainIcon: '🤖',
        level: 'intermediate',
        title: 'Applied Machine Learning',
        description: 'Build and evaluate ML models with Scikit-learn',
        totalHours: 45,
        totalResources: 16,
        courses: [
            {
                id: 'sklearn',
                title: 'Scikit-learn Mastery',
                description: 'Build ML models with sklearn',
                estimatedHours: 20,
                resources: [
                    {
                        id: 'sklearn-1',
                        title: 'Scikit-learn Complete Course',
                        description: 'Classification, regression, clustering',
                        externalUrl: 'https://www.youtube.com/watch?v=0B5eIE_1vpU',
                        platform: 'youtube',
                        duration: '3 hours',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'model-eval',
                title: 'Model Evaluation',
                description: 'Evaluate and tune your models',
                estimatedHours: 12,
                resources: [
                    {
                        id: 'eval-1',
                        title: 'Cross-Validation & Metrics',
                        description: 'Model evaluation techniques',
                        externalUrl: 'https://www.youtube.com/watch?v=fSytzGwwBVw',
                        platform: 'youtube',
                        duration: '1 hour',
                        type: 'video'
                    }
                ]
            }
        ]
    },
    {
        id: 'ml-advanced',
        category: 'tech',
        domain: 'ml',
        domainIcon: '🤖',
        level: 'advanced',
        title: 'Deep Learning & MLOps',
        description: 'Master neural networks and production ML',
        totalHours: 60,
        totalResources: 20,
        courses: [
            {
                id: 'deep-learning',
                title: 'Deep Learning',
                description: 'Neural networks with TensorFlow/PyTorch',
                estimatedHours: 30,
                resources: [
                    {
                        id: 'dl-1',
                        title: 'Deep Learning Fundamentals',
                        description: 'Neural networks from scratch',
                        externalUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
                        platform: 'youtube',
                        duration: '15 mins',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'mlops',
                title: 'MLOps',
                description: 'Deploy ML models to production',
                estimatedHours: 20,
                resources: [
                    {
                        id: 'mlops-1',
                        title: 'MLOps Crash Course',
                        description: 'ML in production',
                        externalUrl: 'https://www.youtube.com/watch?v=Kvxaj6pHeVA',
                        platform: 'youtube',
                        duration: '2 hours',
                        type: 'video'
                    }
                ]
            }
        ]
    },

    // ==========================================
    // BSC - MATHEMATICS
    // ==========================================
    {
        id: 'math-beginner',
        category: 'bsc',
        domain: 'mathematics',
        domainIcon: '📐',
        level: 'beginner',
        title: 'Mathematics Foundations',
        description: 'Build strong fundamentals in calculus and algebra',
        totalHours: 35,
        totalResources: 15,
        courses: [
            {
                id: 'calculus-1',
                title: 'Calculus I',
                description: 'Limits, derivatives, and integrals',
                estimatedHours: 18,
                resources: [
                    {
                        id: 'calc-1',
                        title: 'Calculus - Integration Techniques',
                        description: 'Integration by parts, substitution',
                        contentId: 'content_13',
                        platform: 'internal',
                        duration: '1.5 hours',
                        type: 'video'
                    },
                    {
                        id: 'calc-2',
                        title: 'Calculus Full Course',
                        description: 'Complete calculus tutorial',
                        externalUrl: 'https://www.youtube.com/watch?v=HfACrKJ_Y2w',
                        platform: 'khan-academy',
                        duration: '5 hours',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'linear-algebra-basics',
                title: 'Linear Algebra Basics',
                description: 'Vectors, matrices, and transformations',
                estimatedHours: 17,
                resources: [
                    {
                        id: 'la-1',
                        title: 'Linear Algebra - Eigenvalues',
                        description: 'Computing eigenvalues and eigenvectors',
                        contentId: 'content_18',
                        platform: 'internal',
                        duration: '1 hour',
                        type: 'video'
                    },
                    {
                        id: 'la-2',
                        title: 'Linear Algebra Full Course',
                        description: 'Comprehensive linear algebra',
                        externalUrl: 'https://www.youtube.com/watch?v=JnTa9XtvmfI',
                        platform: 'youtube',
                        duration: '3 hours',
                        type: 'video'
                    }
                ]
            }
        ]
    },
    {
        id: 'math-intermediate',
        category: 'bsc',
        domain: 'mathematics',
        domainIcon: '📐',
        level: 'intermediate',
        title: 'Advanced Mathematics',
        description: 'Differential equations and advanced linear algebra',
        totalHours: 45,
        totalResources: 18,
        courses: [
            {
                id: 'ode',
                title: 'Differential Equations',
                description: 'Ordinary differential equations',
                estimatedHours: 25,
                resources: [
                    {
                        id: 'ode-1',
                        title: 'ODEs Complete Course',
                        description: 'First and second order ODEs',
                        externalUrl: 'https://www.youtube.com/watch?v=HQfflAHx5M8',
                        platform: 'youtube',
                        duration: '4 hours',
                        type: 'video'
                    }
                ]
            }
        ]
    },
    {
        id: 'math-advanced',
        category: 'bsc',
        domain: 'mathematics',
        domainIcon: '📐',
        level: 'advanced',
        title: 'Pure Mathematics',
        description: 'Real analysis and abstract algebra',
        totalHours: 55,
        totalResources: 20,
        courses: [
            {
                id: 'real-analysis',
                title: 'Real Analysis',
                description: 'Rigorous calculus foundation',
                estimatedHours: 30,
                resources: [
                    {
                        id: 'ra-1',
                        title: 'Real Analysis Lectures',
                        description: 'Sequences, series, continuity',
                        externalUrl: 'https://www.youtube.com/watch?v=EaKLXK4hFFQ',
                        platform: 'youtube',
                        duration: '2 hours',
                        type: 'video'
                    }
                ]
            }
        ]
    },

    // ==========================================
    // COMPETITIVE EXAMS - JEE 2026
    // ==========================================
    {
        id: 'jee-beginner',
        category: 'competitive',
        domain: 'jee-2026',
        domainIcon: '🎯',
        level: 'beginner',
        title: 'JEE 2026 Foundation',
        description: 'Build strong fundamentals for JEE preparation',
        totalHours: 50,
        totalResources: 25,
        courses: [
            {
                id: 'jee-physics-basics',
                title: 'Physics Fundamentals',
                description: 'Mechanics and thermodynamics basics',
                estimatedHours: 20,
                resources: [
                    {
                        id: 'jee-phy-1',
                        title: 'Rotational Motion - Quick Revision',
                        description: 'Key formulas and concepts',
                        contentId: 'content_9',
                        platform: 'internal',
                        duration: '45 mins',
                        type: 'video'
                    },
                    {
                        id: 'jee-phy-2',
                        title: 'Thermodynamics Laws',
                        description: 'First, second, and third laws',
                        contentId: 'content_15',
                        platform: 'internal',
                        duration: '1 hour',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'jee-chemistry-basics',
                title: 'Chemistry Fundamentals',
                description: 'Organic and inorganic chemistry basics',
                estimatedHours: 18,
                resources: [
                    {
                        id: 'jee-chem-1',
                        title: 'Electrochemistry - Galvanic Cells',
                        description: 'Electrode potentials and Nernst equation',
                        contentId: 'content_17',
                        platform: 'internal',
                        duration: '1 hour',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'jee-math-basics',
                title: 'Mathematics Fundamentals',
                description: 'Algebra and calculus basics',
                estimatedHours: 12,
                resources: [
                    {
                        id: 'jee-math-1',
                        title: 'JEE Math Foundation',
                        description: 'Essential topics for JEE Maths',
                        externalUrl: 'https://www.youtube.com/watch?v=LwCRRUa8yTU',
                        platform: 'youtube',
                        duration: '2 hours',
                        type: 'video'
                    }
                ]
            }
        ]
    },
    {
        id: 'jee-intermediate',
        category: 'competitive',
        domain: 'jee-2026',
        domainIcon: '🎯',
        level: 'intermediate',
        title: 'JEE 2026 Advanced Prep',
        description: 'Master advanced concepts and problem-solving',
        totalHours: 80,
        totalResources: 35,
        courses: [
            {
                id: 'jee-advanced-physics',
                title: 'Advanced Physics',
                description: 'Advanced mechanics and electromagnetism',
                estimatedHours: 35,
                resources: [
                    {
                        id: 'jee-phy-adv-1',
                        title: 'JEE Physics - Advanced Problems',
                        description: 'Challenging problem-solving techniques',
                        externalUrl: 'https://www.youtube.com/watch?v=lCqD0wgN5qE',
                        platform: 'youtube',
                        duration: '3 hours',
                        type: 'video'
                    }
                ]
            }
        ]
    },
    {
        id: 'jee-advanced',
        category: 'competitive',
        domain: 'jee-2026',
        domainIcon: '🎯',
        level: 'advanced',
        title: 'JEE 2026 Final Sprint',
        description: 'Mock tests and previous year papers',
        totalHours: 100,
        totalResources: 40,
        courses: [
            {
                id: 'jee-mocks',
                title: 'Mock Tests & PYQs',
                description: 'Practice with real exam patterns',
                estimatedHours: 60,
                resources: [
                    {
                        id: 'jee-mock-1',
                        title: 'JEE Mock Test Strategy',
                        description: 'How to attempt mock tests effectively',
                        externalUrl: 'https://www.youtube.com/watch?v=1234567890',
                        platform: 'youtube',
                        duration: '30 mins',
                        type: 'video'
                    }
                ]
            }
        ]
    },

    // ==========================================
    // COMPETITIVE EXAMS - NEET 2026
    // ==========================================
    {
        id: 'neet-beginner',
        category: 'competitive',
        domain: 'neet-2026',
        domainIcon: '🏥',
        level: 'beginner',
        title: 'NEET 2026 Foundation',
        description: 'Build strong fundamentals for NEET',
        totalHours: 50,
        totalResources: 25,
        courses: [
            {
                id: 'neet-biology',
                title: 'Biology Fundamentals',
                description: 'NCERT-based biology concepts',
                estimatedHours: 25,
                resources: [
                    {
                        id: 'neet-bio-1',
                        title: 'NEET Biology Complete',
                        description: 'NCERT Biology for NEET',
                        externalUrl: 'https://www.youtube.com/watch?v=xAUq_3EY0mE',
                        platform: 'youtube',
                        duration: '4 hours',
                        type: 'video'
                    }
                ]
            },
            {
                id: 'neet-chemistry',
                title: 'Chemistry for NEET',
                description: 'Organic, inorganic, physical chemistry',
                estimatedHours: 20,
                resources: [
                    {
                        id: 'neet-chem-1',
                        title: 'Organic Chemistry - Reaction Mechanisms',
                        description: 'SN1, SN2, E1, E2 mechanisms',
                        contentId: 'content_10',
                        platform: 'internal',
                        duration: '1.5 hours',
                        type: 'video'
                    }
                ]
            }
        ]
    },
    {
        id: 'neet-intermediate',
        category: 'competitive',
        domain: 'neet-2026',
        domainIcon: '🏥',
        level: 'intermediate',
        title: 'NEET 2026 Advanced',
        description: 'NCERT mastery and advanced topics',
        totalHours: 80,
        totalResources: 35,
        courses: [
            {
                id: 'neet-ncert-master',
                title: 'NCERT Mastery',
                description: 'Complete NCERT for NEET',
                estimatedHours: 50,
                resources: [
                    {
                        id: 'neet-ncert-1',
                        title: 'NCERT Line-by-Line Biology',
                        description: 'Detailed NCERT analysis',
                        externalUrl: 'https://www.youtube.com/watch?v=ncert123',
                        platform: 'youtube',
                        duration: '5 hours',
                        type: 'video'
                    }
                ]
            }
        ]
    },
    {
        id: 'neet-advanced',
        category: 'competitive',
        domain: 'neet-2026',
        domainIcon: '🏥',
        level: 'advanced',
        title: 'NEET 2026 Final Sprint',
        description: 'Mock tests and previous year papers',
        totalHours: 100,
        totalResources: 40,
        courses: [
            {
                id: 'neet-mocks',
                title: 'Mock Tests & PYQs',
                description: 'Practice with real exam patterns',
                estimatedHours: 60,
                resources: [
                    {
                        id: 'neet-mock-1',
                        title: 'NEET PYQ Analysis',
                        description: 'Previous year question analysis',
                        externalUrl: 'https://www.youtube.com/watch?v=neetpyq123',
                        platform: 'youtube',
                        duration: '2 hours',
                        type: 'video'
                    }
                ]
            }
        ]
    }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getPathsByCategory(category: LearningCategory): LearningPath[] {
    return LEARNING_PATHS.filter(p => p.category === category);
}

export function getPathsByDomain(domain: string): LearningPath[] {
    return LEARNING_PATHS.filter(p => p.domain === domain);
}

export function getPathById(id: string): LearningPath | undefined {
    return LEARNING_PATHS.find(p => p.id === id);
}

export function getPathByDomainAndLevel(domain: string, level: LearningLevel): LearningPath | undefined {
    return LEARNING_PATHS.find(p => p.domain === domain && p.level === level);
}
