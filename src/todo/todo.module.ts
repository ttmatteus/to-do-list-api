import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './todo.controller';
import { Taskservice } from './todo.service';
import { Task } from './entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])], 
  providers: [Taskservice],
  controllers: [TaskController],
})
export class TodoModule {}
