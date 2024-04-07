import { Injectable } from '@nestjs/common'
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello eeee!'
  }
  getProfile(): string {
    return 'Hello !'
  }
}
