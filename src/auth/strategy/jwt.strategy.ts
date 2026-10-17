import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUPER_SECRET_KEY_CHANGE_LATER', // Must match the secret in AuthModule
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // Whatever is returned here gets attached to request.user
    return { userId: payload.sub, email: payload.email };
  }
}