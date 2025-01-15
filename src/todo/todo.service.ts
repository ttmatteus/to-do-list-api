import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class Taskservice {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // Criar tarefa
  async createTask(createTodoDto: CreateTodoDto): Promise<Task> {
    const task = this.taskRepository.create(createTodoDto);
    return this.taskRepository.save(task);
  }

  // Pegar todas as tarefas
  async getTasks(): Promise<Task[]> {
    return this.taskRepository.find(); 
  }
}
