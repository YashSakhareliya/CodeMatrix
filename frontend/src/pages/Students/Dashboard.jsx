import React, { useState } from "react";
import { StudentStats, AssignmentList } from "../../components";
import { useDispatch, useSelector } from "react-redux";


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("problems");
  const [filter, setFilter] = useState("all");

  const mockAssignments = [
    {
      id: 1,
      type: "problem",
      title: "Two Sum",
      group: "Algorithms 101",
      difficulty: "Easy",
      deadline: "March 20, 2024",
      status: "pending",
      description: `Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target.
      
      You may assume that each input would have exactly one solution, and you may not use the same element twice.
      
      You can return the answer in any order.`,
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
      ],
      constraints: [
        "2 <= nums.length <= 104",
        "-109 <= nums[i] <= 109",
        "-109 <= target <= 109",
        "Only one valid answer exists.",
      ],
      timeLimit: 45,
      instructor: "Dr. Sarah Smith",
      defaultCode: {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    
};`,
        python: `def twoSum(nums, target):`,
      },
    },
    {
      id: 2,
      type: "problem",
      title: "Binary Search",
      group: "Algorithms 101",
      difficulty: "Easy",
      deadline: "March 22, 2024",
      status: "pending",
      description: "Implement binary search algorithm...",
      examples: [],
      constraints: [],
      timeLimit: 30,
      instructor: "Dr. Sarah Smith",
      defaultCode: {
        javascript: "// Implement binary search here",
        python: "# Implement binary search here",
      },
    },
    {
      id: 3,
      type: "task",
      title: "Complete Quiz 1",
      group: "Data Structures",
      deadline: "March 21, 2024",
      status: "overdue",
      description: "Complete the quiz on basic data structures",
      examples: [],
      constraints: [],
      timeLimit: 60,
      instructor: "Dr. Sarah Smith",
      defaultCode: {
        javascript: "",
        python: "",
      },
    },
  ];

  // make letter
  const getAssignemnt = () => {
    // using store get current instructor id
    // get this user DashBoard
    // DashBoard Contain All Assignemnt and State
    // thhis function make in use Effact because if Current Instructor Change then Assignemtn and State Change
  }
  const mockStats = {
    problemsSolved: 15,
    totalProblems: 30,
    tasksCompleted: 8,
    totalTasks: 10,
    rank: "#234",
  };

  const onAssignmentSelect = (assignment) => {
    console.log(assignment)
    // check this not due time
    // open the code-editor
  }
  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <StudentStats name="John Doe" instructor="Dr. Sarah Smith" stats={mockStats} />

      <AssignmentList
        assignments={mockAssignments}
        activeTab={activeTab}
        filter={filter}
        setActiveTab={setActiveTab}
        setFilter={setFilter}
        onAssignmentSelect={onAssignmentSelect}
      />
    </div>
  );
}
