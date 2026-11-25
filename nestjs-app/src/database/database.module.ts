import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService], // other modules that import DatabaseModule can inject it
})
export class DatabaseModule {}
