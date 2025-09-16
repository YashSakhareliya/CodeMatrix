// Dummy data matching backend models for development and testing

// Dummy Instructors
export const dummyInstructors = [
    {
        _id: "674a1b2c3d4e5f6789012340",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        students: ["674a1b2c3d4e5f6789012350", "674a1b2c3d4e5f6789012351"],
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z")
    },
    {
        _id: "674a1b2c3d4e5f6789012341",
        name: "Prof. Michael Chen",
        email: "michael.chen@university.edu",
        students: ["674a1b2c3d4e5f6789012350"],
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z")
    },
    {
        _id: "674a1b2c3d4e5f6789012342",
        name: "Dr. Emily Rodriguez",
        email: "emily.rodriguez@university.edu",
        students: ["674a1b2c3d4e5f6789012350"],
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z")
    }
];

// Dummy Student (current user)
export const dummyStudent = {
    _id: "674a1b2c3d4e5f6789012350",
    name: "John Doe",
    email: "john.doe@student.university.edu",
    uid: "JD2024",
    profilePicture: "",
    bio: "Computer Science student passionate about algorithms and data structures",
    activeInstructors: [
        "674a1b2c3d4e5f6789012340", // Dr. Sarah Johnson
        "674a1b2c3d4e5f6789012341", // Prof. Michael Chen
        "674a1b2c3d4e5f6789012342"  // Dr. Emily Rodriguez
    ],
    currentInstructor: "674a1b2c3d4e5f6789012340", // Default to Dr. Sarah Johnson
    createdAt: new Date("2024-01-01T00:00:00Z")
};

// Helper function to get current dates
const getCurrentDate = () => new Date();
const getDateInDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

// Dummy Assignments by Instructor
export const dummyAssignmentsByInstructor = {
    "674a1b2c3d4e5f6789012340": [ // Dr. Sarah Johnson
        {
            _id: "674a1b2c3d4e5f6789012345",
            title: "Data Structures & Algorithms Challenge",
            description: "This assignment covers fundamental data structures and algorithms concepts including arrays, linked lists, trees, and sorting algorithms.",
            instructorId: "674a1b2c3d4e5f6789012340",
            groupId: "674a1b2c3d4e5f6789012360",
            difficulty: "medium",
            totalTime: 120,
            startTime: getDateInDays(-1), // Started yesterday
            dueDate: getDateInDays(7), // Due in 7 days
            status: "active",
            maxAttempts: 3,
            isVisible: true,
            createdAt: getDateInDays(-2),
            updatedAt: getDateInDays(-2),
            type: "problem"
        },
        {
            _id: "674a1b2c3d4e5f6789012346",
            title: "Binary Search Implementation",
            description: "Implement various binary search algorithms and understand their time complexity.",
            instructorId: "674a1b2c3d4e5f6789012340",
            groupId: "674a1b2c3d4e5f6789012360",
            difficulty: "easy",
            totalTime: 60,
            startTime: getCurrentDate(), // Started today
            dueDate: getDateInDays(3), // Due in 3 days
            status: "active",
            maxAttempts: 5,
            isVisible: true,
            createdAt: getDateInDays(-1),
            updatedAt: getDateInDays(-1),
            type: "problem"
        },
        {
            _id: "674a1b2c3d4e5f6789012347",
            title: "Complete Data Structures Quiz",
            description: "Quiz covering arrays, linked lists, stacks, and queues.",
            instructorId: "674a1b2c3d4e5f6789012340",
            groupId: "674a1b2c3d4e5f6789012360",
            difficulty: "easy",
            totalTime: 30,
            startTime: getDateInDays(-5), // Started 5 days ago
            dueDate: getDateInDays(-2), // Was due 2 days ago (overdue)
            status: "expired",
            maxAttempts: 1,
            isVisible: true,
            createdAt: getDateInDays(-7),
            updatedAt: getDateInDays(-7),
            type: "task"
        }
    ],
    "674a1b2c3d4e5f6789012341": [ // Prof. Michael Chen
        {
            _id: "674a1b2c3d4e5f6789012348",
            title: "Advanced Algorithms Project",
            description: "Implement and analyze advanced algorithms including graph algorithms, dynamic programming, and greedy algorithms.",
            instructorId: "674a1b2c3d4e5f6789012341",
            groupId: "674a1b2c3d4e5f6789012361",
            difficulty: "hard",
            totalTime: 180,
            startTime: getCurrentDate(), // Started today
            dueDate: getDateInDays(14), // Due in 14 days
            status: "active",
            maxAttempts: 2,
            isVisible: true,
            createdAt: getDateInDays(-1),
            updatedAt: getDateInDays(-1),
            type: "problem"
        },
        {
            _id: "674a1b2c3d4e5f6789012349",
            title: "Graph Theory Fundamentals",
            description: "Solve problems related to graph traversal, shortest paths, and minimum spanning trees.",
            instructorId: "674a1b2c3d4e5f6789012341",
            groupId: "674a1b2c3d4e5f6789012361",
            difficulty: "medium",
            totalTime: 90,
            startTime: getDateInDays(-2), // Started 2 days ago
            dueDate: getDateInDays(5), // Due in 5 days
            status: "active",
            maxAttempts: 3,
            isVisible: true,
            createdAt: getDateInDays(-3),
            updatedAt: getDateInDays(-3),
            type: "problem"
        }
    ],
    "674a1b2c3d4e5f6789012342": [ // Dr. Emily Rodriguez
        {
            _id: "674a1b2c3d4e5f6789012350",
            title: "Machine Learning Basics",
            description: "Introduction to machine learning algorithms and their implementation.",
            instructorId: "674a1b2c3d4e5f6789012342",
            groupId: "674a1b2c3d4e5f6789012362",
            difficulty: "medium",
            totalTime: 150,
            startTime: getCurrentDate(), // Started today
            dueDate: getDateInDays(10), // Due in 10 days
            status: "active",
            maxAttempts: 2,
            isVisible: true,
            createdAt: getDateInDays(-1),
            updatedAt: getDateInDays(-1),
            type: "problem"
        },
        {
            _id: "674a1b2c3d4e5f6789012351",
            title: "Neural Networks Assignment",
            description: "Build and train a simple neural network from scratch.",
            instructorId: "674a1b2c3d4e5f6789012342",
            groupId: "674a1b2c3d4e5f6789012362",
            difficulty: "hard",
            totalTime: 240,
            startTime: getDateInDays(3), // Starts in 3 days
            dueDate: getDateInDays(17), // Due in 17 days
            status: "draft",
            maxAttempts: 1,
            isVisible: true,
            createdAt: getCurrentDate(),
            updatedAt: getCurrentDate(),
            type: "problem"
        }
    ]
};

// Dummy Problems for assignments
export const dummyProblems = {
    "674a1b2c3d4e5f6789012345": [ // Data Structures & Algorithms Challenge
        {
            _id: "674a1b2c3d4e5f6789012380",
            title: "Two Sum",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
            assignmentId: "674a1b2c3d4e5f6789012345",
            instructorId: "674a1b2c3d4e5f6789012340",
            difficulty: "easy",
            points: 100,
            timeLimit: 1800, // 30 minutes in seconds
            order: 1,
            tags: ["array", "hash-table"],
            examples: [
                {
                    input: "nums = [2,7,11,15], target = 9",
                    output: "[0,1]",
                    explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
                },
                {
                    input: "nums = [3,2,4], target = 6",
                    output: "[1,2]",
                    explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
                }
            ],
            testCases: [
                {
                    input: "[2,7,11,15]\n9",
                    expectedOutput: "[0,1]",
                    isHidden: false,
                    points: 50
                },
                {
                    input: "[3,2,4]\n6",
                    expectedOutput: "[1,2]",
                    isHidden: false,
                    points: 50
                }
            ],
            constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
            sampleInput: "[2,7,11,15]\n9",
            sampleOutput: "[0,1]",
            hints: ["Try using a hash map to store the numbers you've seen so far"],
            defaultCode: {
                python: "def twoSum(nums, target):\n    # Write your solution here\n    pass",
                javascript: "function twoSum(nums, target) {\n    // Write your solution here\n}",
                java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n    }\n}",
                cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};"
            },
            isActive: true,
            createdAt: getCurrentDate(),
            updatedAt: getCurrentDate()
        },
        {
            _id: "674a1b2c3d4e5f6789012381",
            title: "Binary Tree Traversal",
            description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.\n\nInorder traversal visits nodes in the order: left subtree, root, right subtree.",
            assignmentId: "674a1b2c3d4e5f6789012345",
            instructorId: "674a1b2c3d4e5f6789012340",
            difficulty: "medium",
            points: 150,
            timeLimit: 2700, // 45 minutes in seconds
            order: 2,
            tags: ["tree", "recursion", "dfs"],
            examples: [
                {
                    input: "root = [1,null,2,3]",
                    output: "[1,3,2]",
                    explanation: "Inorder traversal: left -> root -> right. The tree structure is 1(null, 2(3, null))"
                }
            ],
            testCases: [
                {
                    input: "[1,null,2,3]",
                    expectedOutput: "[1,3,2]",
                    isHidden: false,
                    points: 75
                }
            ],
            constraints: "The number of nodes in the tree is in the range [0, 100].\n-100 <= Node.val <= 100",
            sampleInput: "[1,null,2,3]",
            sampleOutput: "[1,3,2]",
            hints: ["Use recursion or stack for iterative approach"],
            defaultCode: {
                python: "def inorderTraversal(root):\n    # Write your solution here\n    pass",
                javascript: "function inorderTraversal(root) {\n    // Write your solution here\n}",
                java: "class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        // Write your solution here\n    }\n}",
                cpp: "class Solution {\npublic:\n    vector<int> inorderTraversal(TreeNode* root) {\n        // Write your solution here\n    }\n};"
            },
            isActive: true,
            createdAt: getCurrentDate(),
            updatedAt: getCurrentDate()
        }
    ]
};

// Dummy Stats by Instructor
export const dummyStatsByInstructor = {
    "674a1b2c3d4e5f6789012340": { // Dr. Sarah Johnson
        problemsSolved: 15,
        totalProblems: 25,
        tasksCompleted: 8,
        totalTasks: 10,
        rank: "#12",
        averageScore: 85.5,
        totalPoints: 1250
    },
    "674a1b2c3d4e5f6789012341": { // Prof. Michael Chen
        problemsSolved: 8,
        totalProblems: 15,
        tasksCompleted: 3,
        totalTasks: 5,
        rank: "#8",
        averageScore: 92.3,
        totalPoints: 980
    },
    "674a1b2c3d4e5f6789012342": { // Dr. Emily Rodriguez
        problemsSolved: 5,
        totalProblems: 12,
        tasksCompleted: 2,
        totalTasks: 4,
        rank: "#15",
        averageScore: 78.9,
        totalPoints: 650
    }
};

// Helper functions
export const getInstructorById = (instructorId) => {
    return dummyInstructors.find(instructor => instructor._id === instructorId);
};

export const getAssignmentsByInstructor = (instructorId) => {
    return dummyAssignmentsByInstructor[instructorId] || [];
};

export const getStatsByInstructor = (instructorId) => {
    return dummyStatsByInstructor[instructorId] || {
        problemsSolved: 0,
        totalProblems: 0,
        tasksCompleted: 0,
        totalTasks: 0,
        rank: "#--",
        averageScore: 0,
        totalPoints: 0
    };
};

export const getProblemsByAssignment = (assignmentId) => {
    return dummyProblems[assignmentId] || [];
};

// Filter assignments by status and type
export const filterAssignments = (assignments, activeTab, filter) => {
    let filtered = assignments;

    // Filter by type (problems/tasks)
    if (activeTab !== 'all') {
        filtered = filtered.filter(assignment => {
            if (activeTab === 'problems') return assignment.type === 'problem';
            if (activeTab === 'tasks') return assignment.type === 'task';
            return true;
        });
    }

    // Filter by status
    if (filter !== 'all') {
        const now = new Date();
        filtered = filtered.filter(assignment => {
            const dueDate = new Date(assignment.dueDate);
            const timeDiff = dueDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (filter === 'due soon') {
                return daysDiff <= 3 && daysDiff >= 0 && assignment.status === 'active';
            }
            if (filter === 'overdue') {
                return assignment.status === 'expired' || (daysDiff < 0 && assignment.status === 'active');
            }
            return true;
        });
    }

    return filtered;
};
