import { Controller, Post, Body, Get } from '@nestjs/common';
import { Taskservice } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Task } from './entities/todo.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: Taskservice) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTodoDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  async getTasks(): Promise<Task[]> {
    return this.taskService.getTasks();
  }
}
