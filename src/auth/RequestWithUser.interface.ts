import User from 'src/users/user.entity';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: User;
}
export default RequestWithUser;
