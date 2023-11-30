import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
export default async function compareHashedStrings(str1: string, str2: string): Promise<void> {
  const compare = await bcrypt.compare(str1, str2)
  if (!compare)
throw new UnauthorizedException('Access Denied')
}