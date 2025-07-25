import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'asdf098ujnmki',
    });
  }

  async validate(payload: User) {
    const user = await this.userService.findUserByPhoneNo(payload.phone_no);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
