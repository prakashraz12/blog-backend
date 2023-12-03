
import jwt from "jsonwebtoken";

export const tokenGenrerator = (id)=>{
    const token =jwt.sign({id:id}, process.env.TOKEN)
    return token;
}