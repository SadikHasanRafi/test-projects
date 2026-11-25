import { Controller, Get } from '@nestjs/common';

@Controller() // no prefix -> handles "/"
export class AppController {
  @Get()
  hello() {
    return { message: 'Hello from NestJS' }; // returned objects are sent as JSON
  }
}
