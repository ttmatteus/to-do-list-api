import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
      throw new ConflictException('A task with this title already exists. Please choose a different title.');
    }

    try {
      const task = this.taskRepository.create(createTodoDto);
      return this.taskRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while creating the task. Please try again later.');
    }
  }

  // Pegar todas as tarefas
  async getTasks(): Promise<Task[]> {
    try {
      return await this.taskRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while retrieving task. Please try again later.');
    }
  }

  async updateTask(id: number, updateTodoDto: UpdateTodoDto): Promise<Task> {
    let task;
    try {
      task = await this.taskRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while retrieving the task. Please try again later.')
    }

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    try {
      Object.assign(task, updateTodoDto);
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while updating the task. Please try again later.')
    }
  }

  // Deletar tarefa
  async deleteTask(id: number): Promise<void> {
    let task;
    try {
      task = await this.taskRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while retrieving the task. Please try again later.');
    }

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    try {
      await this.taskRepository.remove(task);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while deleting the task. Please try again later.');
    }
  }
}
