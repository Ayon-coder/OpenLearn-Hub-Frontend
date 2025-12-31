
import { Subject, Topic, Subtopic, ContentItem, Difficulty } from '@/types';

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'cs', name: 'Computer Science', icon: 'Cpu', description: 'Foundations of computation, software engineering, and artificial intelligence.', status: 'verified' },
  { id: 'math', name: 'Mathematics', icon: 'Layers', description: 'Pure and applied mathematics from Calculus to Abstract Algebra.', status: 'verified' },
  { id: 'bio', name: 'Biology', icon: 'Globe', description: 'The study of life, molecular structures, and ecological systems.', status: 'verified' },
];

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'os',
    subjectId: 'cs',
    title: 'Operating Systems',
    description: 'The backbone of computer software, managing hardware and program execution.',
    status: 'verified',
    difficulty: Difficulty.Intermediate,
    votes: 1240,
    lastUpdated: '2024-05-20',
    content: `## Operating Systems Fundamentals\n\nAn Operating System (OS) is software that manages computer hardware and software resources. It provides common services for computer programs.\n\n### Key Functions\n- **Memory Management**: Tracking every memory location.\n- **Process Management**: Handling multiple concurrent tasks.\n- **File System**: Organizing data storage.\n- **I/O Management**: Communication with peripherals.`,
    readiness: 92
  },
  {
    id: 'dsa',
    subjectId: 'cs',
    title: 'Data Structures',
    description: 'Efficient ways to organize and store data for algorithmic processing.',
    status: 'verified',
    difficulty: Difficulty.Advanced,
    votes: 2150,
    lastUpdated: '2024-06-10',
    content: `## Data Structures Overview\n\nData structures are essential for managing large amounts of data efficiently. They are used in almost every program or software system.\n\n### Types of Data Structures\n- Linear: Arrays, Linked Lists, Stacks, Queues\n- Non-Linear: Trees, Graphs`,
    readiness: 78
  },
];

export const INITIAL_SUBTOPICS: Subtopic[] = [
  { id: 'scheduling', topicId: 'os', title: 'Process Scheduling', description: 'Strategies used by the OS to allocate CPU time to active processes.', status: 'verified', videoUrl: 'https://www.youtube.com/watch?v=UK1kM2Wq51k' },
  { id: 'memory', topicId: 'os', title: 'Memory Management', description: 'Mapping logical addresses to physical memory and handling swapping.', status: 'verified', videoUrl: 'https://www.youtube.com/watch?v=zFnrATqD-YQ' }, // Updated to working OS Scheduling video
  { id: 'graphs', topicId: 'dsa', title: 'Graph Theory', description: 'Studying nodes and edges to model network structures.', status: 'verified', videoUrl: 'https://www.youtube.com/watch?v=59fUtYYz7ZU' },
];

export const INITIAL_CONTENT: ContentItem[] = [
  {
    id: 'c1',
    subtopicId: 'scheduling',
    topicId: 'os',
    subjectId: 'cs',
    title: 'Deep Dive: Scheduling Algorithms',
    body: `## Core Scheduling Strategies\n\n### 1. FCFS (First Come First Served)\nThe simplest non-preemptive algorithm. While fair in order, it often leads to the "convoy effect" where short processes wait behind long ones.\n\n### 2. SJF (Shortest Job First)\nOptimal for minimizing average wait time. However, it requires knowing CPU burst times in advance, which is rarely possible.\n\n### 3. Round Robin (RR)\nThe standard for time-sharing systems. It uses a fixed "Time Quantum" to ensure no process starves.`,
    author: 'pro_coder_99',
    readiness: 95,
    lastUpdated: '2024-05-20',
    difficulty: Difficulty.Intermediate,
    votes: 342,
    videoUrl: 'https://www.youtube.com/watch?v=zFnrATqD-YQ' // Valid OS Scheduling video
  }
];
