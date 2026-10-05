export const INITIAL_DATA = {
  goals: [
    {
      id: 'g-1',
      title: 'Complete React Component Architecture Chapter',
      category: 'Computer Science',
      priority: 'high',
      completed: true,
      estimatedMinutes: 45,
      createdAt: new Date().toISOString()
    },
    {
      id: 'g-2',
      title: 'Review 20 Spaced Repetition Flashcards',
      category: 'Memory & Recall',
      priority: 'high',
      completed: false,
      estimatedMinutes: 20,
      createdAt: new Date().toISOString()
    },
    {
      id: 'g-3',
      title: 'Practice Algorithms MCQ Quiz',
      category: 'Algorithms',
      priority: 'medium',
      completed: false,
      estimatedMinutes: 30,
      createdAt: new Date().toISOString()
    },
    {
      id: 'g-4',
      title: 'Draft summary notes on System Design basics',
      category: 'System Design',
      priority: 'low',
      completed: false,
      estimatedMinutes: 25,
      createdAt: new Date().toISOString()
    }
  ],

  flashcardDecks: [
    {
      id: 'deck-1',
      title: 'Core JavaScript & React Mastery',
      description: 'Closures, Event Loop, Hooks, Virtual DOM, and Reconciliation concepts.',
      category: 'Web Development',
      color: '#6366f1',
      cards: [
        {
          id: 'c-1',
          question: 'What is a Closure in JavaScript?',
          answer: 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). It gives inner functions access to outer scope variables even after the outer function has executed.',
          hint: 'Think about lexical scoping and retaining state.'
        },
        {
          id: 'c-2',
          question: 'What is the purpose of useEffect dependency array?',
          answer: 'It instructs React to skip applying the effect if the specified values have not changed between renders. Passing an empty array [] ensures the effect runs only once after the initial mount.',
          hint: 'Controls when the side-effect re-triggers.'
        },
        {
          id: 'c-3',
          question: 'How does the JavaScript Event Loop handle Promises vs setTimeout?',
          answer: 'Promises (microtasks) have higher priority and run in the microtask queue right after the current script finishes and before the next macrotask (like setTimeout) is executed from the callback queue.',
          hint: 'Microtask vs Macrotask queue hierarchy.'
        },
        {
          id: 'c-4',
          question: 'What is memoization and how does React.memo work?',
          answer: 'Memoization is an optimization technique that caches function results. React.memo is a higher-order component that prevents re-rendering a functional component if its props have not shallowly changed.',
          hint: 'Higher-order component for props comparison.'
        }
      ]
    },
    {
      id: 'deck-2',
      title: 'Data Structures & Algorithms Essentials',
      description: 'Time complexities, Big-O notations, Trees, Graphs, and Hash Tables.',
      category: 'Algorithms',
      color: '#10b981',
      cards: [
        {
          id: 'c-5',
          question: 'What is the average and worst-case time complexity of QuickSort?',
          answer: 'Average time complexity is O(n log n). Worst-case complexity is O(n²) when the pivot selection is unbalanced (e.g. already sorted array without random pivot).',
          hint: 'Divide and conquer partitioning.'
        },
        {
          id: 'c-6',
          question: 'What makes a Binary Search Tree (BST) valid?',
          answer: 'For every node, all values in its left subtree must be strictly less than the node’s key, and all values in its right subtree must be strictly greater.',
          hint: 'Left < Node < Right condition.'
        },
        {
          id: 'c-7',
          question: 'How does a Hash Map handle collisions in Separate Chaining?',
          answer: 'Separate Chaining places colliding keys into a linked list or balanced red-black tree at the same bucket index.',
          hint: 'Bucket chaining with lists.'
        }
      ]
    },
    {
      id: 'deck-3',
      title: 'Human Biology & Neuroscience',
      description: 'Brain anatomy, neurotransmitters, and cellular respiration.',
      category: 'Science',
      color: '#ec4899',
      cards: [
        {
          id: 'c-8',
          question: 'What is the primary role of the Hippocampus?',
          answer: 'The hippocampus is a major component of the brain essential for the consolidation of information from short-term memory to long-term memory, and in spatial navigation.',
          hint: 'Memory consolidation and navigation center.'
        },
        {
          id: 'c-9',
          question: 'What neurotransmitter is most associated with focus and reward?',
          answer: 'Dopamine plays a crucial role in motivational salience, reward anticipation, and sustained focus.',
          hint: 'The motivation molecule.'
        }
      ]
    }
  ],

  quizzes: [
    {
      id: 'quiz-1',
      title: 'Frontend & JavaScript Speed Challenge',
      category: 'Web Dev',
      timeLimitPerQuestion: 30, // seconds
      description: 'Test your understanding of modern JavaScript, asynchronous execution, and React principles.',
      questions: [
        {
          id: 'q-1',
          question: 'Which statement accurately describes JavaScript variables declared with "const"?',
          options: [
            'They cannot be reassigned, but properties of objects assigned to const can be mutated.',
            'They are completely immutable and frozen.',
            'They are hoisted to the top and initialized as undefined.',
            'They are scoped globally regardless of where they are defined.'
          ],
          correctIndex: 0,
          explanation: '"const" creates an immutable binding, preventing reassignment. However, objects and arrays referenced by a const variable can have their internal properties mutated.'
        },
        {
          id: 'q-2',
          question: 'What is the output of typeof null in JavaScript?',
          options: [
            '"null"',
            '"undefined"',
            '"object"',
            '"boolean"'
          ],
          correctIndex: 2,
          explanation: 'In JavaScript, typeof null returns "object", which is an acknowledged historical artifact from the original JS implementation.'
        },
        {
          id: 'q-3',
          question: 'What is the main benefit of React Keys in lists?',
          options: [
            'They uniquely style each child component with CSS.',
            'They help React identify which items have changed, been added, or been removed during reconciliation.',
            'They bind event listeners automatically.',
            'They enable asynchronous state updates.'
          ],
          correctIndex: 1,
          explanation: 'Keys provide a stable identity to list elements so React diffing algorithm can preserve state and minimize DOM re-renders.'
        },
        {
          id: 'q-4',
          question: 'Which method returns a new array with all elements that pass the test implemented by the provided function?',
          options: [
            'Array.prototype.map()',
            'Array.prototype.filter()',
            'Array.prototype.forEach()',
            'Array.prototype.reduce()'
          ],
          correctIndex: 1,
          explanation: 'filter() creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test.'
        }
      ]
    },
    {
      id: 'quiz-2',
      title: 'Data Structures & Logic Benchmark',
      category: 'Algorithms',
      timeLimitPerQuestion: 45,
      description: 'Quick check on algorithmic complexity, stacks, queues and trees.',
      questions: [
        {
          id: 'q-5',
          question: 'Which data structure operates on a First-In-First-Out (FIFO) principle?',
          options: [
            'Stack',
            'Queue',
            'Binary Search Tree',
            'Heap'
          ],
          correctIndex: 1,
          explanation: 'A Queue works on FIFO (First In First Out), where elements are enqueued at the back and dequeued from the front.'
        },
        {
          id: 'q-6',
          question: 'What is the worst-case lookup time in a balanced binary search tree (like AVL or Red-Black)?',
          options: [
            'O(1)',
            'O(log n)',
            'O(n)',
            'O(n log n)'
          ],
          correctIndex: 1,
          explanation: 'Balanced BSTs maintain a height proportional to log(n), guaranteeing O(log n) lookup, insertion, and deletion.'
        }
      ]
    }
  ],

  notes: [
    {
      id: 'n-1',
      title: '💡 Active Recall & Spaced Repetition Techniques',
      subject: 'Study Strategy',
      tag: 'Productivity',
      pinned: true,
      color: '#6366f1',
      content: `### Why Active Recall Outperforms Passive Rereading
- **Retrieval Practice:** Testing yourself forces neural pathways to reconstruct memories.
- **Feynman Technique:** Explain complex concepts in simple terms without jargon.
- **Pomodoro Rule:** 25 mins deep work + 5 mins break prevents cognitive fatigue.

> *"Repetition is the mother of learning, the father of action, which makes it the architect of accomplishment."*`,
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'n-2',
      title: '⚡ React 19 State Architecture & Actions',
      subject: 'Computer Science',
      tag: 'React',
      pinned: true,
      color: '#10b981',
      content: `### Key Notes:
1. **Actions:** Functions that use async transitions automatically handle pending states and optimistic UI.
2. **use() hook:** Allows reading promises or context directly inside conditionals.
3. **Ref as a prop:** In modern React, ref is passed directly without forwardRef wrapper.`,
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'n-3',
      title: '📐 Big-O Cheat Sheet & Complexity Tiers',
      subject: 'Algorithms',
      tag: 'CS Theory',
      pinned: false,
      color: '#f59e0b',
      content: `- O(1) -> Constant (Array index access, Hash lookup)
- O(log n) -> Logarithmic (Binary Search)
- O(n) -> Linear (Simple loops, traversal)
- O(n log n) -> Linearithmic (MergeSort, QuickSort avg)
- O(n²) -> Quadratic (Nested loops, BubbleSort)`,
      updatedAt: new Date(Date.now() - 3600000 * 36).toISOString()
    }
  ],

  plannerEvents: [
    {
      id: 'p-1',
      day: 'Monday',
      subject: 'Computer Science',
      topic: 'React Context & State Management',
      startTime: '09:00',
      endTime: '10:30',
      priority: 'high',
      status: 'completed'
    },
    {
      id: 'p-2',
      day: 'Monday',
      subject: 'Algorithms',
      topic: 'Graph BFS & DFS Implementations',
      startTime: '14:00',
      endTime: '15:30',
      priority: 'medium',
      status: 'in-progress'
    },
    {
      id: 'p-3',
      day: 'Tuesday',
      subject: 'Science',
      topic: 'Neurobiology Review & Flashcards',
      startTime: '10:00',
      endTime: '11:30',
      priority: 'medium',
      status: 'scheduled'
    },
    {
      id: 'p-4',
      day: 'Wednesday',
      subject: 'System Design',
      topic: 'Caching Strategies & Redis',
      startTime: '11:00',
      endTime: '12:30',
      priority: 'high',
      status: 'scheduled'
    },
    {
      id: 'p-5',
      day: 'Thursday',
      subject: 'Web Dev',
      topic: 'Performance Profiling & Web Vitals',
      startTime: '15:00',
      endTime: '16:30',
      priority: 'low',
      status: 'scheduled'
    },
    {
      id: 'p-6',
      day: 'Friday',
      subject: 'Review',
      topic: 'Weekly MCQ Quiz Marathon',
      startTime: '16:00',
      endTime: '17:30',
      priority: 'high',
      status: 'scheduled'
    }
  ],

  pomodoroSettings: {
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    soundEnabled: true
  },

  stats: {
    totalStudyMinutes: 145,
    todayStudyMinutes: 75,
    completedPomodoros: 6,
    streakDays: 4,
    lastActiveDate: new Date().toISOString().split('T')[0],
    quizScores: [
      { quizId: 'quiz-1', quizTitle: 'Frontend & JS Challenge', score: 4, total: 4, percentage: 100, date: new Date().toISOString() },
      { quizId: 'quiz-2', quizTitle: 'Data Structures Logic', score: 2, total: 2, percentage: 100, date: new Date(Date.now() - 86400000).toISOString() }
    ],
    dailyStudyHistory: [
      { day: 'Mon', minutes: 85, date: '2026-09-29' },
      { day: 'Tue', minutes: 110, date: '2026-09-30' },
      { day: 'Wed', minutes: 60, date: '2026-10-01' },
      { day: 'Thu', minutes: 95, date: '2026-10-02' },
      { day: 'Fri', minutes: 120, date: '2026-10-03' },
      { day: 'Sat', minutes: 45, date: '2026-10-04' },
      { day: 'Sun', minutes: 75, date: '2026-10-05' }
    ]
  }
};
