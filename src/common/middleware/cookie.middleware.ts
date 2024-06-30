import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CookieMiddleware implements NestMiddleware {
  use(req: any, _: any, next: () => void) {
    const cookies = req.headers.cookie;
    if (cookies) {
      req.headers['Cookie'] = cookies;
    }
    next();
  }
}
