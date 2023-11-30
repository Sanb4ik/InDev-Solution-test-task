import * as bcrypt from 'bcryptjs';
export default function hashString(str: string){
  return bcrypt.hash(str, 3)
}