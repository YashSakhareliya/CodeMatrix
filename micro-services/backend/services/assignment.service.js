import groupModel from '../models/group.model.js'

const getStudents = async (groupId) => {
    if(!groupId){
        throw new Error("Group ID is required");
    }

    const group = await groupModel.findById(groupId);
    if(!group){
        throw new Error("Group not found");
    }

    return group.students;
}


export { getStudents };