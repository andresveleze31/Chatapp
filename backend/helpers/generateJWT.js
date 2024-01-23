import jwt from "jsonwebtoken";

function generateJWToken(id) {
    return jwt.sign({id}, process.env.KEYWORD_JWT, {
        expiresIn: "30d"
    })
}

export { generateJWToken };
