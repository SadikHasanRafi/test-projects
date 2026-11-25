// Root module: lists everything the app is made of.
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { BooksModule } from './books/books.module';
import { LoggerMiddleware } from './common/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env, ConfigService usable everywhere
    BooksModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  // Middleware is registered here, not with app.use()
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
