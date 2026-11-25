// Guard: decides if a request may reach the route. Used with @UseGuards(AuthGuard).
// Guards run after middleware and before validation pipes.
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  // Dependency injection: Nest creates ConfigService and passes it in
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.config.get('API_TOKEN', 'secret123');

    if (request.headers.authorization !== `Bearer ${token}`) {
      throw new UnauthorizedException(); // -> 401 JSON response
    }
    return true;
  }
}
