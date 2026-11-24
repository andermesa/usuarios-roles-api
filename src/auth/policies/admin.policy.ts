
import { Policy, type PolicyBefore } from '@nestjs/authorization';
import type { AuthUser } from '../../users/users.service.js';

@Policy()
export class AdminPolicy implements PolicyBefore<AuthUser> {
  before(user: AuthUser | null) {
    if (user?.roles.includes('admin')) {
      return true;
    }
  }

  manage(user: AuthUser | null) {
    return user?.roles.includes('admin') === true;
  }
}


