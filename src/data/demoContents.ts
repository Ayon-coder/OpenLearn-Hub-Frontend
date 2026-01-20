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
    coverImage?: string;
    tags?: string[];
    level?: 'Beginner' | 'Intermediate' | 'Advanced'; // Added level matching
}

const STORAGE_KEY = 'openlearn_demo_contents_v5';

export const addDemoContent = (content: DemoContent) => {
    DEMO_CONTENTS.unshift(content);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CONTENTS));
    } catch (e) {
        console.error('Failed to save to localStorage', e);
    }
};

// Refresh DEMO_CONTENTS from localStorage (for cross-tab or page refresh scenarios)
export const refreshContents = (): DemoContent[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Update the DEMO_CONTENTS array in-place
            DEMO_CONTENTS.length = 0;
            DEMO_CONTENTS.push(...parsed);
            return DEMO_CONTENTS;
        }
    } catch (e) {
        console.error('Failed to refresh from localStorage', e);
    }
    return DEMO_CONTENTS;
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
        // --- DATA STRUCTURES & ALGORITHMS ---
        {
            id: 'dsa_1',
            title: 'Array Implementation in C',
            description: 'Complete guide to implementing arrays in C programming with examples.',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Computer Science', coreTopic: 'Data Structures', subtopic: 'Arrays', resourceTitle: 'Array Implementation' } },
            uploadedBy: 'Rahul Kumar', uploadedAt: '2024-01-15T10:30:00Z', views: 1250, likes: 89, downloads: 342,
            videoUrl: 'https://www.youtube.com/embed/1uADAjweDwk',
            tags: ['C', 'Arrays', 'Data Structures', 'Programming'], level: 'Beginner'
        },
        {
            id: 'dsa_2',
            title: 'Graph Algorithms - BFS & DFS',
            description: 'Visual explanation of Breadth-First and Depth-First Search algorithms.',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Computer Science', coreTopic: 'Algorithms', subtopic: 'Graphs', resourceTitle: 'Graph Traversal' } },
            uploadedBy: 'Jenny\'s Lectures', uploadedAt: '2024-02-10T14:20:00Z', views: 5600, likes: 450, downloads: 120,
            videoUrl: 'https://www.youtube.com/embed/pcKY4hjDrxk',
            tags: ['Graphs', 'BFS', 'DFS', 'Algorithms', 'DSA'], level: 'Intermediate'
        },
        {
            id: 'dsa_3',
            title: 'Dynamic Programming - 0/1 Knapsack Problem',
            description: 'Step-by-step derivation of the Knapsack problem using DP.',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Computer Science', coreTopic: 'Algorithms', subtopic: 'Dynamic Programming', resourceTitle: 'Knapsack Problem' } },
            uploadedBy: 'Abdul Bari', uploadedAt: '2024-03-05T09:15:00Z', views: 8900, likes: 780, downloads: 500,
            videoUrl: 'https://www.youtube.com/embed/nzA2yrOV3Lw',
            tags: ['Dynamic Programming', 'Knapsack', 'Optimization', 'DSA', 'Algorithms'], level: 'Advanced'
        },

        // --- DATA SCIENCE & AI ---
        {
            id: 'data_1',
            title: 'Data Visualization with Python (Matplotlib & Seaborn)',
            description: 'Learn to create stunning plots and charts using Python libraries.',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Data Science', coreTopic: 'Visualization', subtopic: 'Python', resourceTitle: 'Data Viz Guide' } },
            uploadedBy: 'Krish Naik', uploadedAt: '2024-02-12T10:00:00Z', views: 15600, likes: 1200, downloads: 450,
            videoUrl: 'https://www.youtube.com/embed/O3682E87f70',
            tags: ['Data Visualization', 'Python', 'Matplotlib', 'Seaborn', 'Data Science'], level: 'Beginner'
        },
        {
            id: 'data_2',
            title: 'Pandas & Numpy Complete Tutorial',
            description: 'Data analysis and manipulation mastery with Pandas.',
            organization: { primaryPath: 'channel', channelPath: { channelName: 'CodeBasics', playlistName: 'Data Science', topic: 'Pandas', resourceTitle: 'Pandas Tutorial' } },
            uploadedBy: 'CodeBasics', uploadedAt: '2024-01-25T14:30:00Z', views: 25000, likes: 2100, downloads: 980,
            videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
            tags: ['Data Analysis', 'Python', 'Pandas', 'Numpy', 'Data'], level: 'Intermediate'
        },

        // --- WEB DEVELOPMENT ---
        {
            id: 'web_1',
            title: 'React Hooks Complete Tutorial',
            description: 'Master useState, useEffect, and custom hooks in modern React.',
            organization: { primaryPath: 'channel', channelPath: { channelName: 'Web Dev Simplified', playlistName: 'React Course', topic: 'React', resourceTitle: 'Hooks Tutorial' } },
            uploadedBy: 'Web Dev Simplified', uploadedAt: '2024-01-20T16:00:00Z', views: 12000, likes: 1500, downloads: 800,
            videoUrl: 'https://www.youtube.com/embed/hQAHSlTtcmY',
            tags: ['React', 'Hooks', 'Frontend', 'JavaScript', 'Web Development'], level: 'Intermediate'
        },
        {
            id: 'web_2',
            title: 'Next.js 14 Crash Course',
            description: 'Build a full-stack app with Next.js 14, Server Actions, and Tailwind CSS.',
            organization: { primaryPath: 'channel', channelPath: { channelName: 'Traversy Media', playlistName: 'Next.js', topic: 'Next.js', resourceTitle: 'Next.js 14 Tutorial' } },
            uploadedBy: 'Traversy Media', uploadedAt: '2024-02-28T11:45:00Z', views: 9500, likes: 920, downloads: 450,
            videoUrl: 'https://www.youtube.com/embed/ZVnjOPwW4ZA',
            tags: ['Next.js', 'React', 'Full Stack', 'Tailwind', 'Web Development'], level: 'Advanced'
        },
        {
            id: 'web_3',
            title: 'CSS Flexbox & Grid Masterclass',
            description: 'Learn modern CSS layouts with Flexbox and Grid fundamentals.',
            organization: { primaryPath: 'channel', channelPath: { channelName: 'Kevin Powell', playlistName: 'CSS', topic: 'CSS', resourceTitle: 'Layouts' } },
            uploadedBy: 'Kevin Powell', uploadedAt: '2024-01-05T08:30:00Z', views: 7800, likes: 600, downloads: 300,
            videoUrl: 'https://www.youtube.com/embed/3YM95p_LMco',
            tags: ['CSS', 'Flexbox', 'Grid', 'Web Design', 'Frontend'], level: 'Beginner'
        },

        // --- SCIENCE (PHYSICS/CHEMISTRY) ---
        {
            id: 'sci_1',
            title: 'Quantum Physics - Wave Particle Duality',
            description: 'Introduction to Quantum Mechanics and the double-slit experiment.',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Physics', coreTopic: 'Quantum Mechanics', subtopic: 'Wave Theory', resourceTitle: 'Quantum Basics' } },
            uploadedBy: 'Veritasium', uploadedAt: '2023-12-15T10:00:00Z', views: 45000, likes: 3200, downloads: 1500,
            videoUrl: 'https://www.youtube.com/embed/p7bzE1E5PMY',
            tags: ['Physics', 'Quantum', 'Science', 'Mechanics'], level: 'Advanced'
        },
        {
            id: 'sci_2',
            title: 'Organic Chemistry - Benzene & Aromaticity',
            description: 'Understanding the structure of Benzene and aromatic compounds.',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Chemistry', coreTopic: 'Organic Chemistry', subtopic: 'Hydrocarbons', resourceTitle: 'Benzene Structure' } },
            uploadedBy: 'Professor Dave', uploadedAt: '2024-02-15T13:15:00Z', views: 3200, likes: 240, downloads: 90,
            videoUrl: 'https://www.youtube.com/embed/7DjsD7Hcd9U',
            tags: ['Chemistry', 'Organic', 'Benzene', 'Science', 'JEE', 'NEET'], level: 'Intermediate'
        },

        // --- MATHEMATICS ---
        {
            id: 'math_1',
            title: 'Calculus: Derivatives Explained',
            description: 'Intuitive understanding of derivatives and rates of change.',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Mathematics', coreTopic: 'Calculus', subtopic: 'Derivatives', resourceTitle: 'Intro to Derivatives' } },
            uploadedBy: '3Blue1Brown', uploadedAt: '2023-11-20T15:00:00Z', views: 89000, likes: 5600, downloads: 2100,
            videoUrl: 'https://www.youtube.com/embed/9vKqVkMQHKk',
            tags: ['Calculus', 'Math', 'Derivatives', 'Integration', 'Education'], level: 'Beginner'
        },

        // --- CLOUD & DEVOPS ---
        {
            id: 'cloud_1',
            title: 'Docker for Beginners',
            description: 'Containerize your applications with Docker - Full Course.',
            organization: { primaryPath: 'channel', channelPath: { channelName: 'TechWorld with Nana', playlistName: 'DevOps', topic: 'Docker', resourceTitle: 'Docker Tutorial' } },
            uploadedBy: 'TechWorld with Nana', uploadedAt: '2024-01-12T09:00:00Z', views: 15000, likes: 1100, downloads: 670,
            videoUrl: 'https://www.youtube.com/embed/3c-iBn73dDE',
            tags: ['Docker', 'DevOps', 'Containers', 'Cloud'], level: 'Beginner'
        },
        {
            id: 'cloud_2',
            title: 'AWS Basics - EC2 & S3',
            description: 'Getting started with Amazon Web Services: EC2 instances and S3 storage.',
            organization: { primaryPath: 'channel', channelPath: { channelName: 'FreeCodeCamp', playlistName: 'AWS', topic: 'Cloud Computing', resourceTitle: 'AWS Course' } },
            uploadedBy: 'FreeCodeCamp', uploadedAt: '2024-03-01T12:00:00Z', views: 22000, likes: 1800, downloads: 950,
            videoUrl: 'https://www.youtube.com/embed/ulprqHHWlng',
            tags: ['AWS', 'Cloud', 'EC2', 'S3', 'Web Development'], level: 'Beginner'
        },

        // --- COMPETITIVE EXAMS ---
        {
            id: 'exam_1',
            title: 'JEE Physics - Rotational Motion',
            description: 'One shot revision for Rotational Motion for JEE Mains & Advanced.',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Physics', coreTopic: 'Mechanics', subtopic: 'Rotation', resourceTitle: 'Rotation One Shot' } },
            uploadedBy: 'Physics Wallah', uploadedAt: '2024-01-25T11:00:00Z', views: 45000, likes: 3500, downloads: 1200,
            videoUrl: 'https://www.youtube.com/embed/6qgGq7z2qGQ',
            tags: ['JEE', 'Physics', 'Mechanics', 'Exam Prep'], level: 'Advanced'
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
        },
        // =================== NEW TAGGED CONTENT WITH LEVELS ===================
        // Machine Learning
        {
            id: 'ml_linear_regression',
            title: 'Linear Regression from Scratch',
            description: 'Complete guide to linear regression, gradient descent, and cost functions',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Computer Science', coreTopic: 'Machine Learning', subtopic: 'Regression', resourceTitle: 'Linear Regression' } },
            uploadedBy: 'Andrew NG',
            uploadedAt: '2024-03-01T10:00:00Z',
            views: 5200,
            likes: 420,
            downloads: 890,
            tags: ['machine_learning', 'linear_regression', 'regression', 'gradient_descent', 'python', 'sklearn'],
            level: 'Beginner'
        },
        {
            id: 'ml_logistic_regression',
            title: 'Logistic Regression for Classification',
            description: 'Binary classification using logistic regression with sigmoid function',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Computer Science', coreTopic: 'Machine Learning', subtopic: 'Classification', resourceTitle: 'Logistic Regression' } },
            uploadedBy: 'StatQuest',
            uploadedAt: '2024-03-02T10:00:00Z',
            views: 4800,
            likes: 380,
            downloads: 720,
            tags: ['machine_learning', 'logistic_regression', 'classification', 'sigmoid', 'python'],
            level: 'Beginner'
        },
        {
            id: 'ml_neural_networks',
            title: 'Neural Networks Fundamentals',
            description: 'Perceptrons, activation functions, backpropagation, and training neural networks',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Computer Science', coreTopic: 'Deep Learning', subtopic: 'Neural Networks', resourceTitle: 'NN Basics' } },
            uploadedBy: '3Blue1Brown',
            uploadedAt: '2024-03-04T10:00:00Z',
            views: 8500,
            likes: 890,
            downloads: 1200,
            tags: ['machine_learning', 'neural_networks', 'deep_learning', 'backpropagation', 'activation_functions'],
            level: 'Intermediate'
        },
        // Web Development
        {
            id: 'web_html_basics',
            title: 'HTML5 Complete Course',
            description: 'HTML fundamentals, semantic elements, forms, and accessibility',
            organization: { primaryPath: 'channel', channelPath: { channelName: 'Traversy Media', playlistName: 'Web Dev', topic: 'HTML', resourceTitle: 'HTML5 Course' } },
            uploadedBy: 'Brad Traversy',
            uploadedAt: '2024-03-06T10:00:00Z',
            views: 12000,
            likes: 1100,
            downloads: 2500,
            tags: ['web_development', 'html', 'html5', 'frontend', 'semantic_html'],
            level: 'Beginner'
        },
        {
            id: 'web_react_intro',
            title: 'React.js Complete Tutorial',
            description: 'Components, hooks, state management, and building modern React apps',
            organization: { primaryPath: 'channel', channelPath: { channelName: 'Codevolution', playlistName: 'React', topic: 'React', resourceTitle: 'React Tutorial' } },
            uploadedBy: 'Codevolution',
            uploadedAt: '2024-03-09T10:00:00Z',
            views: 18000,
            likes: 1800,
            downloads: 4100,
            tags: ['web_development', 'react', 'javascript', 'frontend', 'hooks', 'jsx'],
            level: 'Intermediate'
        },
        // Data Structures
        {
            id: 'dsa_linked_list',
            title: 'Linked Lists Complete Guide',
            description: 'Singly, doubly, circular linked lists with insertion, deletion operations',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Computer Science', coreTopic: 'Data Structures', subtopic: 'Linked List', resourceTitle: 'Linked Lists' } },
            uploadedBy: 'Jenny Lectures',
            uploadedAt: '2024-03-15T10:00:00Z',
            views: 5400,
            likes: 460,
            downloads: 1200,
            tags: ['data_structures', 'linked_list', 'dsa', 'pointers', 'algorithm'],
            level: 'Beginner'
        },
        {
            id: 'dsa_graph_algorithms',
            title: 'Graph Algorithms - BFS & DFS',
            description: 'Breadth-First Search, Depth-First Search, and graph traversal techniques',
            organization: { primaryPath: 'subject', subjectPath: { subject: 'Computer Science', coreTopic: 'Algorithms', subtopic: 'Graphs', resourceTitle: 'Graph Algorithms' } },
            uploadedBy: 'William Fiset',
            uploadedAt: '2024-03-18T10:00:00Z',
            views: 4100,
            likes: 350,
            downloads: 800,
            tags: ['data_structures', 'graphs', 'algorithms', 'bfs', 'dfs', 'dsa'],
            level: 'Advanced'
        }
    ];
};

export const DEMO_CONTENTS: DemoContent[] = loadInitialContents();
