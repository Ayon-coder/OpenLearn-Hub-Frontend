import { ContentOrganization } from '@/types';

export interface DemoContent {
    id: string;
    title: string;
    description: string;
    organization: ContentOrganization;
    uploadedBy: string;
    uploadedAt: string;
    views: number;
    likes: number;
    downloads: number;
    videoUrl?: string;
    coverImage?: string;  // Fallback image when videoUrl is not available
}

const STORAGE_KEY = 'openlearn_demo_contents_v4';

export const addDemoContent = (content: DemoContent) => {
    DEMO_CONTENTS.unshift(content);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CONTENTS));
    } catch (e) {
        console.error('Failed to save to localStorage', e);
    }
};

// Initialize with saved content or default
const loadInitialContents = (): DemoContent[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load from localStorage', e);
    }
    return [
        // SUBJECT-WISE: Array Implementation
        {
            id: 'content_1_subject',
            title: 'Array Implementation in C',
            description: 'Complete guide to implementing arrays in C programming with examples',
            organization: {
                primaryPath: 'subject',
                subjectPath: {
                    subject: 'Computer Science',
                    coreTopic: 'Data Structures',
                    subtopic: 'Arrays',
                    resourceTitle: 'Array Implementation in C'
                }
            },
            uploadedBy: 'Rahul Kumar',
            uploadedAt: '2024-01-15T10:30:00Z',
            views: 1250,
            likes: 89,
            downloads: 342,
            videoUrl: 'https://www.youtube.com/embed/1uADAjweDwk'
        },
        // UNIVERSITY-WISE: Array Implementation (IIT Bombay)
        {
            id: 'content_1_university',
            title: 'Array Implementation in C - IIT Bombay Lecture',
            description: 'IIT Bombay CSE lecture on implementing arrays in C programming',
            organization: {
                primaryPath: 'university',
                universityPath: {
                    university: 'IIT Bombay',
                    semester: '3',
                    department: 'Computer Science & Engineering (CSE)',
                    subject: 'Data Structures and Algorithms',
                    topic: 'Arrays and Linked Lists'
                }
            },
            uploadedBy: 'IIT Bombay CSE',
            uploadedAt: '2024-01-15T10:30:00Z',
            views: 850,
            likes: 67,
            downloads: 230,
            videoUrl: 'https://www.youtube.com/embed/1uADAjweDwk'
        },
        // CHANNEL-WISE: Array Implementation (CodeWithHarry)
        {
            id: 'content_1_channel',
            title: 'Array Implementation in C - CodeWithHarry',
            description: 'CodeWithHarry DSA course: Complete guide to implementing arrays in C',
            organization: {
                primaryPath: 'channel',
                channelPath: {
                    channelName: 'CodeWithHarry',
                    playlistName: 'DSA Full Course',
                    topic: 'Arrays',
                    resourceTitle: 'Array Implementation Notes'
                }
            },
            uploadedBy: 'CodeWithHarry',
            uploadedAt: '2024-01-15T10:30:00Z',
            views: 2100,
            likes: 156,
            downloads: 450,
            videoUrl: 'https://www.youtube.com/embed/1uADAjweDwk'
        },
        // UNIVERSITY-WISE: Binary Search Trees (IIT Delhi)
        {
            id: 'content_2_university',
            title: 'Binary Search Trees - IIT Delhi Lecture',
            description: 'IIT Delhi CSE lecture on BST operations, traversals, and applications',
            organization: {
                primaryPath: 'university',
                universityPath: {
                    university: 'IIT Delhi',
                    semester: '4',
                    department: 'Computer Science & Engineering (CSE)',
                    subject: 'Advanced Data Structures',
                    topic: 'Binary Search Trees'
                }
            },
            uploadedBy: 'IIT Delhi CSE',
            uploadedAt: '2024-01-18T14:20:00Z',
            views: 1200,
            likes: 92,
            downloads: 340,
            videoUrl: 'https://www.youtube.com/embed/pTB0EiFlISw'
        },
        // CHANNEL-WISE: Binary Search Trees (Abdul Bari)
        {
            id: 'content_2_channel',
            title: 'Binary Search Trees - Abdul Bari Algorithms Course',
            description: 'Abdul Bari comprehensive tutorial on BST operations, traversals, and applications',
            organization: {
                primaryPath: 'channel',
                channelPath: {
                    channelName: 'Abdul Bari',
                    playlistName: 'Algorithms',
                    topic: 'Trees',
                    resourceTitle: 'BST Lecture Notes'
                }
            },
            uploadedBy: 'Abdul Bari',
            uploadedAt: '2024-01-18T14:20:00Z',
            views: 3400,
            likes: 245,
            downloads: 780,
            videoUrl: 'https://www.youtube.com/embed/pTB0EiFlISw'
        },
        {
            id: 'content_3',
            title: 'Python Loops Tutorial',
            description: 'For, while, and nested loops in Python with practical examples',
            organization: {
                primaryPath: 'channel',
                subjectPath: {
                    subject: 'Computer Science',
                    coreTopic: 'Programming',
                    subtopic: 'Python Basics',
                    resourceTitle: 'Python Loops Tutorial'
                },
                channelPath: {
                    channelName: 'Apna College',
                    playlistName: 'Python Tutorial Series',
                    topic: 'Loops and Iterations',
                    resourceTitle: 'Complete Loops Guide'
                },
                coursePath: {
                    provider: 'Coursera',
                    instructor: 'Google',
                    courseName: 'Crash Course on Python',
                    topic: 'Loops and Iterations',
                    resourceTitle: 'Complete Loops Guide'
                }
            },
            uploadedBy: 'Amit Patel',
            uploadedAt: '2024-01-20T09:15:00Z',
            views: 3400,
            likes: 245,
            downloads: 890,
            videoUrl: 'https://www.youtube.com/embed/wxds6MAtUQ0'
        },
        // SUBJECT-WISE: OS Process Scheduling
        {
            id: 'content_4_subject',
            title: 'Operating Systems - Process Scheduling',
            description: 'FCFS, SJF, Round Robin, and Priority scheduling algorithms explained',
            organization: {
                primaryPath: 'subject',
                subjectPath: {
                    subject: 'Computer Science',
                    coreTopic: 'Operating Systems',
                    subtopic: 'Process Management',
                    resourceTitle: 'Process Scheduling Algorithms'
                }
            },
            uploadedBy: 'Sneha Reddy',
            uploadedAt: '2024-01-22T11:45:00Z',
            views: 1200,
            likes: 85,
            downloads: 250
        },
        // UNIVERSITY-WISE: OS Process Scheduling (IIT Madras)
        {
            id: 'content_4_university',
            title: 'Process Scheduling - IIT Madras OS Course',
            description: 'IIT Madras lecture on CPU scheduling algorithms: FCFS, SJF, Round Robin',
            organization: {
                primaryPath: 'university',
                universityPath: {
                    university: 'IIT Madras',
                    semester: '5',
                    department: 'Computer Science & Engineering (CSE)',
                    subject: 'Operating Systems',
                    topic: 'CPU Scheduling'
                }
            },
            uploadedBy: 'IIT Madras CSE',
            uploadedAt: '2024-01-22T11:45:00Z',
            views: 980,
            likes: 72,
            downloads: 210
        },
        // CHANNEL-WISE: OS Process Scheduling (Gate Smashers)
        {
            id: 'content_4_channel',
            title: 'Process Scheduling Algorithms - Gate Smashers',
            description: 'Gate Smashers complete guide to OS scheduling algorithms with examples',
            organization: {
                primaryPath: 'channel',
                channelPath: {
                    channelName: 'Gate Smashers',
                    playlistName: 'Operating Systems',
                    topic: 'Process Scheduling',
                    resourceTitle: 'Scheduling Algorithms Notes'
                }
            },
            uploadedBy: 'Gate Smashers',
            uploadedAt: '2024-01-22T11:45:00Z',
            views: 2800,
            likes: 198,
            downloads: 620
        },
        // UNIVERSITY-WISE: Database Normalization (BITS Pilani)
        {
            id: 'content_5_university',
            title: 'Database Normalization - BITS Pilani DBMS Course',
            description: 'BITS Pilani lecture on 1NF, 2NF, 3NF, and BCNF with examples',
            organization: {
                primaryPath: 'university',
                universityPath: {
                    university: 'BITS Pilani',
                    semester: '4',
                    department: 'Computer Science & Engineering (CSE)',
                    subject: 'Database Management Systems',
                    topic: 'Normalization'
                }
            },
            uploadedBy: 'BITS Pilani CSE',
            uploadedAt: '2024-01-25T16:00:00Z',
            views: 1650,
            likes: 112,
            downloads: 380,
            videoUrl: 'https://www.youtube.com/embed/1UrYXuJpvyo'
        },
        // CHANNEL-WISE: Database Normalization (Jenny's Lectures)
        {
            id: 'content_5_channel',
            title: 'Database Normalization Forms - Jenny\'s Lectures',
            description: 'Jenny\'s Lectures comprehensive guide to 1NF, 2NF, 3NF, BCNF with practice problems',
            organization: {
                primaryPath: 'channel',
                channelPath: {
                    channelName: 'Jenny\'s Lectures',
                    playlistName: 'DBMS Complete Course',
                    topic: 'Normalization',
                    resourceTitle: 'Normalization Forms Explained'
                }
            },
            uploadedBy: 'Jenny\'s Lectures',
            uploadedAt: '2024-01-25T16:00:00Z',
            views: 3200,
            likes: 234,
            downloads: 710,
            videoUrl: 'https://www.youtube.com/embed/1UrYXuJpvyo'
        },
        {
            id: 'content_6',
            title: 'Machine Learning Basics',
            description: 'Introduction to ML concepts, supervised and unsupervised learning',
            organization: {
                primaryPath: 'channel',
                subjectPath: {
                    subject: 'Computer Science',
                    coreTopic: 'Artificial Intelligence',
                    subtopic: 'Machine Learning',
                    resourceTitle: 'Machine Learning Basics'
                },
                universityPath: {
                    university: 'Stanford University',
                    semester: '6',
                    department: 'Computer Science & Engineering (CSE)',
                    subject: 'Introduction to Machine Learning',
                    topic: 'ML Fundamentals'
                },
                channelPath: {
                    channelName: 'Stanford Online',
                    playlistName: 'Machine Learning Course',
                    topic: 'Introduction to ML',
                    resourceTitle: 'ML Basics Lecture Notes'
                },
                coursePath: {
                    provider: 'Coursera',
                    instructor: 'Andrew Ng',
                    courseName: 'Machine Learning Specialization',
                    topic: 'Supervised Learning',
                    resourceTitle: 'ML Basics Lecture Notes'
                }
            },
            uploadedBy: 'Ananya Gupta',
            uploadedAt: '2024-01-28T13:30:00Z',
            views: 4200,
            likes: 312,
            downloads: 1200,
            videoUrl: 'https://www.youtube.com/embed/Gv9_4yMHFhI'
        },
        {
            id: 'content_7',
            title: 'React Hooks Complete Guide',
            description: 'useState, useEffect, useContext, and custom hooks explained',
            organization: {
                primaryPath: 'channel',
                subjectPath: {
                    subject: 'Computer Science',
                    coreTopic: 'Web Development',
                    subtopic: 'React',
                    resourceTitle: 'React Hooks Complete Guide'
                },
                channelPath: {
                    channelName: 'CodeWithHarry',
                    playlistName: 'React Tutorial',
                    topic: 'React Hooks',
                    resourceTitle: 'Hooks Comprehensive Notes'
                },
                coursePath: {
                    provider: 'YouTube',
                    instructor: 'CodeWithHarry',
                    courseName: 'React JS - Complete Course for Beginners',
                    topic: 'React Hooks',
                    resourceTitle: 'Hooks Comprehensive Notes'
                }
            },
            uploadedBy: 'Rohan Verma',
            uploadedAt: '2024-02-01T10:00:00Z',
            views: 3100,
            likes: 267,
            downloads: 945,
            videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q' // User provided React Hooks video
        },
        // SUBJECT-WISE: OSI Model
        {
            id: 'content_8_subject',
            title: 'Computer Networks - OSI Model',
            description: 'All 7 layers of OSI model with protocols and examples explained',
            organization: {
                primaryPath: 'subject',
                subjectPath: {
                    subject: 'Computer Science',
                    coreTopic: 'Computer Networks',
                    subtopic: 'Network Models',
                    resourceTitle: 'OSI Model Explained'
                }
            },
            uploadedBy: 'Kavya Iyer',
            uploadedAt: '2024-02-03T15:20:00Z',
            views: 1640,
            likes: 114,
            downloads: 410,
            videoUrl: 'https://www.youtube.com/embed/vv4y_uOneC0'
        },
        // UNIVERSITY-WISE: OSI Model (IIT Kanpur)
        {
            id: 'content_8_university',
            title: 'OSI and TCP/IP Models - IIT Kanpur Networks Course',
            description: 'IIT Kanpur lecture on OSI model layers, protocols, and TCP/IP comparison',
            organization: {
                primaryPath: 'university',
                universityPath: {
                    university: 'IIT Kanpur',
                    semester: '5',
                    department: 'Computer Science & Engineering (CSE)',
                    subject: 'Computer Networks',
                    topic: 'OSI and TCP/IP Models'
                }
            },
            uploadedBy: 'IIT Kanpur CSE',
            uploadedAt: '2024-02-03T15:20:00Z',
            views: 1420,
            likes: 98,
            downloads: 340,
            videoUrl: 'https://www.youtube.com/embed/vv4y_uOneC0'
        },
        // CHANNEL-WISE: OSI Model (Neso Academy)
        {
            id: 'content_8_channel',
            title: 'OSI Model Complete Guide - Neso Academy',
            description: 'Neso Academy detailed explanation of all 7 OSI layers with protocols',
            organization: {
                primaryPath: 'channel',
                channelPath: {
                    channelName: 'Neso Academy',
                    playlistName: 'Computer Networks',
                    topic: 'OSI Model',
                    resourceTitle: 'OSI Layers Complete Notes'
                }
            },
            uploadedBy: 'Neso Academy',
            uploadedAt: '2024-02-03T15:20:00Z',
            views: 3850,
            likes: 278,
            downloads: 890,
            videoUrl: 'https://www.youtube.com/embed/vv4y_uOneC0'
        },
        {
            id: 'content_9',
            title: 'Rotational Motion - Quick Revision',
            description: 'Key formulas and concepts for Rotational Motion',
            organization: {
                primaryPath: 'competitive_exam',
                competitiveExamPath: {
                    exam: 'JEE Advanced',
                    year: 'Target 2025',
                    subject: 'Physics',
                    topic: 'Mechanics',
                    resourceTitle: 'Rotational Motion Revision'
                }
            },
            uploadedBy: 'Amit Kumar',
            uploadedAt: '2024-02-10T09:00:00Z',
            views: 1500,
            likes: 120,
            downloads: 280,
            videoUrl: 'https://www.youtube.com/embed/WQ9AH2S8B6Y' // User provided Rotational Motion video
        },
        {
            id: 'content_10',
            title: 'Organic Chemistry - Reaction Mechanisms',
            description: 'Detailed explanation of SN1, SN2, E1, E2 mechanisms',
            organization: {
                primaryPath: 'competitive_exam',
                competitiveExamPath: {
                    exam: 'NEET',
                    year: 'Target 2024',
                    subject: 'Chemistry',
                    topic: 'Organic Chemistry',
                    resourceTitle: 'Reaction Mechanisms Explained'
                }
            },
            uploadedBy: 'Dr. Neha Gupta',
            uploadedAt: '2024-02-12T11:30:00Z',
            views: 2200,
            likes: 180,
            downloads: 450
        },
        {
            id: 'content_11',
            title: 'JavaScript Async/Await Masterclass',
            description: 'Understanding promises, async functions, and error handling in modern JavaScript',
            organization: {
                primaryPath: 'subject',
                subjectPath: {
                    subject: 'Computer Science',
                    coreTopic: 'Web Development',
                    subtopic: 'JavaScript',
                    resourceTitle: 'Async/Await Guide'
                },
                channelPath: {
                    channelName: 'Traversy Media',
                    playlistName: 'Modern JavaScript',
                    topic: 'Async Programming',
                    resourceTitle: 'Async/Await Tutorial'
                }
            },
            uploadedBy: 'Vikram Singh',
            uploadedAt: '2024-02-15T10:00:00Z',
            views: 3100,
            likes: 267,
            downloads: 720
        },
        {
            id: 'content_12',
            title: 'Machine Learning Basics',
            description: 'Introduction to ML concepts, supervised and unsupervised learning',
            organization: {
                primaryPath: 'subject',
                subjectPath: {
                    subject: 'Computer Science',
                    coreTopic: 'Artificial Intelligence',
                    subtopic: 'Machine Learning',
                    resourceTitle: 'ML Fundamentals'
                }
            },
            uploadedBy: 'Ananya Gupta',
            uploadedAt: '2024-02-16T15:30:00Z',
            views: 4200,
            likes: 312,
            downloads: 890,
            videoUrl: 'https://www.youtube.com/embed/Gv9_4yMHFhI'
        },
        {
            id: 'content_13',
            title: 'Calculus - Integration Techniques',
            description: 'Integration by parts, substitution, and partial fractions explained',
            organization: {
                primaryPath: 'subject',
                subjectPath: {
                    subject: 'Mathematics',
                    coreTopic: 'Calculus',
                    subtopic: 'Integration',
                    resourceTitle: 'Integration Methods'
                },
                channelPath: {
                    channelName: 'Khan Academy',
                    playlistName: 'Calculus',
                    topic: 'Integration',
                    resourceTitle: 'Integration Techniques'
                }
            },
            uploadedBy: 'Rohan Mehta',
            uploadedAt: '2024-02-17T08:45:00Z',
            views: 2800,
            likes: 198,
            downloads: 560,
            videoUrl: 'https://www.youtube.com/embed/6WUjbJEeJwM' // User provided Calculus video
        },
        {
            id: 'content_14',
            title: 'React Hooks Complete Guide',
            description: 'useState, useEffect, useContext, and custom hooks explained',
            organization: {
                primaryPath: 'channel',
                subjectPath: {
                    subject: 'Computer Science',
                    coreTopic: 'Web Development',
                    subtopic: 'React',
                    resourceTitle: 'React Hooks'
                },
                channelPath: {
                    channelName: 'CodeWithHarry',
                    playlistName: 'React Tutorial',
                    topic: 'React Hooks',
                    resourceTitle: 'Hooks Deep Dive'
                }
            },
            uploadedBy: 'Rohan Verma',
            uploadedAt: '2024-02-18T12:00:00Z',
            views: 3100,
            likes: 267,
            downloads: 945,
            videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q' // User provided React Hooks video
        },
        {
            id: 'content_15',
            title: 'Thermodynamics Laws & Applications',
            description: 'First, second, and third laws of thermodynamics with real-world examples',
            organization: {
                primaryPath: 'subject',
                subjectPath: {
                    subject: 'Physics',
                    coreTopic: 'Thermodynamics',
                    subtopic: 'Laws',
                    resourceTitle: 'Thermo Laws Explained'
                }
            },
            uploadedBy: 'Priya Krishnan',
            uploadedAt: '2024-02-19T09:20:00Z',
            views: 1900,
            likes: 145,
            downloads: 380,
            videoUrl: 'https://www.youtube.com/embed/8N1BxHgsoOw' // Working Thermodynamics video
        },
        {
            id: 'content_16',
            title: 'SQL Queries - Joins & Subqueries',
            description: 'Master INNER, LEFT, RIGHT, and FULL OUTER joins with practical examples',
            organization: {
                primaryPath: 'subject',
                subjectPath: {
                    subject: 'Computer Science',
                    coreTopic: 'Database Systems',
                    subtopic: 'SQL',
                    resourceTitle: 'SQL Joins Guide'
                },
                channelPath: {
                    channelName: 'freeCodeCamp',
                    playlistName: 'SQL Tutorial',
                    topic: 'Advanced Queries',
                    resourceTitle: 'Joins and Subqueries'
                }
            },
            uploadedBy: 'Karan Malhotra',
            uploadedAt: '2024-02-20T14:15:00Z',
            views: 2700,
            likes: 203,
            downloads: 615,
            videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY' // Working SQL Joins video
        },
        {
            id: 'content_17',
            title: 'Electrochemistry - Galvanic Cells',
            description: 'Electrode potentials, Nernst equation, and battery applications',
            organization: {
                primaryPath: 'competitive_exam',
                competitiveExamPath: {
                    exam: 'JEE',
                    year: 'Target 2025',
                    subject: 'Chemistry',
                    topic: 'Electrochemistry',
                    resourceTitle: 'Galvanic Cells Notes'
                }
            },
            uploadedBy: 'Sneha Reddy',
            uploadedAt: '2024-02-21T10:30:00Z',
            views: 1890,
            likes: 134,
            downloads: 410,
            videoUrl: 'https://www.youtube.com/embed/7b34XYgADlM' // Working Electrochemistry video
        },
        {
            id: 'content_18',
            title: 'Linear Algebra - Eigenvalues',
            description: 'Computing eigenvalues, eigenvectors, and diagonalization',
            organization: {
                primaryPath: 'subject',
                subjectPath: {
                    subject: 'Mathematics',
                    coreTopic: 'Linear Algebra',
                    subtopic: 'Eigenvalues',
                    resourceTitle: 'Eigenvalue Computations'
                }
            },
            uploadedBy: 'Arjun Kapoor',
            uploadedAt: '2024-02-22T11:45:00Z',
            views: 2300,
            likes: 176,
            downloads: 520,
            videoUrl: 'https://www.youtube.com/embed/fNk_zzaMoSs' // Working Eigenvalues video
        }
    ];
};

export const DEMO_CONTENTS: DemoContent[] = loadInitialContents();
