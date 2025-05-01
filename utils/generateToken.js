import jwt from "jsonwebtoken";

//Create token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

export default generateToken;