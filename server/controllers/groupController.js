const Groups = require('../models/Groups');

module.exports.createGroup = async (req, res, next) => {
    try {
        const { members, name } = req.body;
        const newGroup = await new Groups({ members, name }).save();
        if(newGroup) return res.json({msg: 'Group created successfully'});
        return res.json({msg: 'Failed to create group'});
    } catch (err) {
        next(err);
    }
}

module.exports.getAllGroups = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            const groups = await Groups.find().populate('members');
            if(groups) return res.json(groups);
            return res.json({msg: 'Failed to get groups'});
        }
        else{
        const groups = await Groups.find({
            members: userId
        }).populate('members');
        if(groups) return res.json(groups);
        return res.json({msg: 'Failed to get groups'});
        }
    } catch (err) {
        next(err);
    }
}

module.exports.getGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const group = await Groups.findById(groupId);
        if(group) return res.json(group);
        return res.json({msg: 'Failed to get group'});
    } catch (err) {
        next(err);
    }
}

module.exports.addMember = async (req, res, next) => {
    try {
        const { groupId, member } = req.body;
        const group = await Groups.findById(groupId);
        console.log(group);
        group.members.push(member);
        await group.save();
        return res.json({msg: 'Member added successfully'});
    } catch (err) {
        next(err);
    }
}