import { Repository } from "typeorm";
import { Taskservice } from "./todo.service"
import { Task } from "./entities/todo.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateTodoDto } from "./dto/update-todo.dto";



describe('TaskService', () => {
    let service: Taskservice;
    let repository: Repository<Task>;

    const mockTaskRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        remove: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Taskservice,
                {
                    provide: getRepositoryToken(Task),
                    useValue: mockTaskRepository,
                },
            ],
        }).compile();

        service = module.get<Taskservice>(Taskservice);
        repository = module.get<Repository<Task>>(getRepositoryToken(Task));
    });

    describe('createTask', () => {
        it('should create a task successfully', async () => {
            const createTodoDto: CreateTodoDto = { title: 'Test Task' };
            const task = { ...createTodoDto, id: 1};

            mockTaskRepository.findOne.mockResolvedValue(null);            
            mockTaskRepository.create.mockReturnValue(task);            
            mockTaskRepository.save.mockResolvedValue(task);
            
            const result = await service.createTask(createTodoDto);
            expect(result).toEqual(task);
            expect(mockTaskRepository.save).toHaveBeenCalledWith(task);
        });

        it('should throw ConflictException if task title already exists', async () => {
            const createTodoDto: CreateTodoDto = { title: 'Test Task' };
            mockTaskRepository.findOne.mockResolvedValue({ title: 'Test Task' });

            await expect(service.createTask(createTodoDto)).rejects.toThrowError(new ConflictException('A task with this title already exists. Please choose a different title.'));
        });

        it('should throw InternalServerErrorException if there is a database error', async () => {
            const createTodoDto: CreateTodoDto = { title: 'Test Task' };

            mockTaskRepository.findOne.mockResolvedValue(null);
            mockTaskRepository.save.mockRejectedValue(new Error('An error occurred while creating the task. Please try again later.'));

            await expect(service.createTask(createTodoDto)).rejects.toThrowError(new InternalServerErrorException('An error occurred while creating the task. Please try again later.'));
        });
    });

    describe('getTasks', () => {
        it('should return all task', async () => {
            const tasks = [{ id: 1, title: 'Task 1'}, { id: 2, title: 'Task 2'}];
            mockTaskRepository.find.mockResolvedValue(tasks);

            const result = await service.getTasks();
            expect(result).toEqual(tasks);
        });

        it('should throw InterServerErrorException if there is a database error', async () => {
            mockTaskRepository.find.mockRejectedValue(new Error('An error occurred while creating the task. Please try again later.'));

            await expect(service.getTasks()).rejects.toThrow(new InternalServerErrorException('An error occurred while retrieving task. Please try again later.'))
        });
    });

    describe('updateTask', () => {
        it('should update a task sucessfuly', async () => {
            const updateTodoDto: UpdateTodoDto = { title: 'Updated Task' };
            const task = { id: 1, title: 'Old task' };

            mockTaskRepository.findOne.mockResolvedValue(task);
            mockTaskRepository.save.mockResolvedValue({ ...task, ...updateTodoDto });

            const result = await service.updateTask(1, updateTodoDto);
            expect(result.title).toEqual('Updated Task');
        });

        it('should throw NotFoundException if task is not found', async () => {
            const updateTodoDto: UpdateTodoDto = { title: 'Updated Task' };
      
            mockTaskRepository.findOne.mockResolvedValue(null);
      
            await expect(service.updateTask(1, updateTodoDto)).rejects.toThrowError(new NotFoundException('Task with ID 1 not found.'));
          });

          it('should throw InternalServerErrorException if there is a database error', async () => {
            const updateTodoDto: UpdateTodoDto = { title: 'Updated Task' };
      
            mockTaskRepository.findOne.mockRejectedValue(new Error('Database error'));
      
            await expect(service.updateTask(1, updateTodoDto)).rejects.toThrowError(new InternalServerErrorException('An error occurred while retrieving the task. Please try again later.'));
        });
    });

    describe('deleteTask', () => {
        it('should delete a task successfully', async () => {
            const task = { id: 1, title: 'Test Task' };

            mockTaskRepository.findOne.mockResolvedValue(task);
            mockTaskRepository.remove.mockResolvedValue(undefined);

            await service.deleteTask(1);
            expect(mockTaskRepository.remove).toHaveBeenCalledWith(task)
        });

        it('should throw NotFoundException if task is not found', async () => {
            mockTaskRepository.findOne.mockResolvedValue(null);
      
            await expect(service.deleteTask(1)).rejects.toThrowError(new NotFoundException('Task with ID 1 not found.'));
          });

        it('should throw InternalServerErrorException if there is a database error', async () => {
            mockTaskRepository.findOne.mockRejectedValue(new Error('Database error'));
    
            await expect(service.deleteTask(1)).rejects.toThrowError(new InternalServerErrorException('An error occurred while retrieving the task. Please try again later.'))
        })
    })
})