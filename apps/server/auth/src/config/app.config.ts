import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  constructor(private configService: ConfigService) {}

  get port() {
    return this.configService.get('AUTH_PORT');
  }

  get refreshTokenKey() {
    return this.configService.get('AUTH_REFRESH_TOKEN_KEY');
  }

  get accessTokenKey() {
    return this.configService.get('ACCESS_TOKEN_KEY');
  }
}
