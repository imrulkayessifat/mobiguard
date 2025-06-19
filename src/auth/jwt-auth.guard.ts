import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

import { GraphQLContext } from './current-user.decorator';
import { User } from 'src/user/dto/user.dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<GraphQLContext>().req;
  }

  canActivate(context: ExecutionContext) {
    // Add custom logic here if needed
    return super.canActivate(context);
  }

  handleRequest<TUser = User>(err: any, user: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or Expired token');
    }
    return user as TUser;
  }
}
