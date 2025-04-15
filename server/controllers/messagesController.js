const messageModel = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        console.log(req.body);
        const { from, to, message } = req.body;
        const data = await messageModel.create({
            message: { text: message },
            users: { from, to },
            sender: from
        }
        );
        if(data) return res.json({msg: 'Message added successfully'});
        return res.json({msg: 'Failed to add message to the database'});
    } catch (err) {
        next(err);
    }
}

module.exports.addMessageGroups = async (req, res, next) => {
    try {
        console.log(req.body);
        const { from, to, message } = req.body;
        const data = await messageModel.create({
            message: { text: message },
            users: { 
                group_from : from, 
                group_to : to 
            },
            sender: from
        }
        );
        if(data) return res.json({msg: 'Message added successfully'});
        return res.json({msg: 'Failed to add message to the database'});
    } catch (err) {
        next(err);
    }
}

module.exports.getAllMessageGroups = async (req, res, next) => {
    try{
        // console.log(req.body)
        const {from, to} = req.body;
        const messages = await messageModel.find({
            'users.group_to': to
        });
        // console.log(messages);
    
        const projectedMessages = messages.map((msg) => {
            return{
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            };
        });
        return res.json(projectedMessages);
    }catch(err){
        next(err);
    }
}

module.exports.getAllMessage = async (req, res, next) => {
    try{
        console.log(req.body)
        const {from, to} = req.body;
        const messages = await messageModel.find({
            $or: [
                { $and: [{ 'users.from': from }, { 'users.to': to }] },
                { $and: [{ 'users.from': to }, { 'users.to': from }] },
            ],
        });
        // console.log(messages);
    
        const projectedMessages = messages.map((msg) => {
            return{
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            };
        });
        return res.json(projectedMessages);
    }catch(err){
        next(err);
    }
}
