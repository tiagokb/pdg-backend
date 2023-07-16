const model = require('../models').User;

exports.create = (req, res) => {

    const { name, email } = req.body;

    model.findOne({
        where: {
            email: email
        }
    }).then( (emailExist) => {
        if (emailExist)
            return res.status(409).json({ message: "Email already taken"});
    });

    model.create({
        name: name,
        email: email
    }).then( (User) => {
        return res.status(201).json(User)
    }).catch( (error) => {
        return res.status(500).json({ message: "Internal error: " . error.message })
    });
}

exports.get = (req, res) => {

    const { email } = req.body;

    model.findOne({
        where: {
            email: email
        }
    }).then( (user) => {

        if (user)
            return res.status(200).json(user);
        else 
            return res.status(500).json({ message: "User don't exists" });
        
    }).catch( (error) => {
        return res.status(500).json({ message: error.message });
    });
}