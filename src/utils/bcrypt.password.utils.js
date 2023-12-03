import bcrypt from "bcrypt";
const saltValue = 10;

export const hashedPassword = (password) => {
  return bcrypt.hash(password, saltValue);
};

export const comparePassword = (password, databasepassword) =>{
    return bcrypt.compare(password, databasepassword)
}
