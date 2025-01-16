import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class Taskservice {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // Criar tarefa
  async createTask(createTodoDto: CreateTodoDto): Promise<Task> {
    const { title } = createTodoDto;

    const existingTask = await this.taskRepository.findOne({
      where: { title },
    });

    if ( existingTask) {
      throw new ConflictException('A task with this title already exists');
    }

    const task = this.taskRepository.create(createTodoDto);
    return this.taskRepository.save(task);
  }

  // Pegar todas as tarefas
  async getTasks(): Promise<Task[]> {
    return this.taskRepository.find(); 
  }

  async updateTask(id: number, updateTodoDto: UpdateTodoDto): Promise<Task> {
    const task = await this.taskRepository.findOne({
        where: { id },
    });
    if (!task) {
        throw new NotFoundException('Task not found')
    }

    Object.assign(task, updateTodoDto);

    return this.taskRepository.save(task)
  }

  // Deletar tarefa
  async deleteTask(id: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.remove(task);
  }
}
