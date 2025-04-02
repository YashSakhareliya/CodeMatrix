import groupModel from '../models/group.model.js';

const addStudentsToGroup = async (groupId, studentIds) => {
    if (!groupId || !studentIds || !Array.isArray(studentIds)) {
        throw new Error("Group ID and student IDs are required");
    }

    const group = await groupModel.findById(groupId);
    if (!group) {
        throw new Error("Group not found");
    }

    // Add students to the group, avoiding duplicates
    studentIds.forEach(studentId => {
        if (!group.students.includes(studentId)) {
            group.students.push(studentId);
        }
    });

    await group.save();
    return group;
}

export { addStudentsToGroup };
