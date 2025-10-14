using Application.DTOs.TaskItem;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.TaskItem
{
    public class TaskItemService : ITaskItemService
    {
        private readonly AppDbContext _context;

        public TaskItemService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<TaskItemDto> CreateTaskItemAsync(CreateTaskItemDto dto, Guid userId)
        {
            var column = await _context.Column
                .Include(c => c.Board)
                .FirstOrDefaultAsync(c => c.Id == dto.ColumnId && c.Board.UserId == userId);

            if (column == null)
            {
                throw new Exception("Access denied");
            }

            var maxPosition = await _context.TaskItem
                .Include(c => c.Column)
                .Where(c => c.ColumnId == dto.ColumnId)
                .MaxAsync(c => (int?)c.Position) ?? 0;

            var task = new Domain.Entities.TaskItem
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                ColumnId = dto.ColumnId,
                Position = maxPosition + 1
            };

            _context.TaskItem.Add(task);
            await _context.SaveChangesAsync();

            return new TaskItemDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                ColumnId = task.ColumnId,
                Position = task.Position,
            };

        }

        public async Task DeleteTaskItemAsync(Guid taskId, Guid userId)
        {
            var taskItem = await GetTaskItemAsync(taskId, userId);
            _context.TaskItem.Remove(taskItem);
            await _context.SaveChangesAsync();

            var reoderedTasks = await _context.TaskItem
                .Where(t => t.ColumnId == taskItem.ColumnId)
                .OrderBy(t => t.Position)
                .ToListAsync();

            for (int i = 0; i < reoderedTasks.Count(); i++)
            {
                reoderedTasks[i].Position = i;
            }

            await _context.SaveChangesAsync();

        }

        public async Task<List<TaskItemDto>> GetTaskItemsAsync(Guid columnId, Guid userId)
        {
            var column = await _context.Column
                .Include(c => c.Board)
                .FirstOrDefaultAsync(c => c.Id == columnId && c.Board.UserId == userId);

            if (column == null)
            {
                throw new Exception("Access denied");
            }

            return await _context.TaskItem
                .Where(t => t.ColumnId == columnId && !t.isArchived)
                .OrderBy(t => t.Position)
                .Select(t => new TaskItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    ColumnId = columnId,
                    Position = t.Position,
                })
                .ToListAsync();
        }

        public async Task MoveTaskItemAsync(Guid taskId, Guid newColumnId, int newPosition, Guid userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var taskItem = await GetTaskItemAsync(taskId, userId);
                var columnId = taskItem.ColumnId;

                var newColumn = await _context.Column
                    .Include(c => c.Board)
                    .FirstOrDefaultAsync(c => c.Id == newColumnId && c.Board.UserId == userId);

                if (taskItem == null || newColumn == null)
                {
                    throw new Exception("Access denied");
                }

                var tasksCountInNewColumn = await _context.TaskItem
                    .CountAsync(t => t.ColumnId == newColumnId && t.Id != taskId);

                if (newPosition < 0 || newPosition > tasksCountInNewColumn)
                {
                    throw new ArgumentException("Invalid position");
                }

                var tasksInColumn = await _context.TaskItem
                    .Where(t => t.ColumnId == columnId && t.Id != taskId)
                    .OrderBy(t => t.Position)
                    .ToListAsync();

                for (int i = 0; i < tasksInColumn.Count; i++)
                {
                    tasksInColumn[i].Position = i;
                }

                var tasksInNewColumn = await _context.TaskItem
                    .Where(t => t.ColumnId == newColumnId)
                    .OrderBy(t => t.Position)
                    .ToListAsync();

                taskItem.ColumnId = newColumnId;
                tasksInNewColumn.Insert(newPosition, taskItem);

                for (int i = 0; i < tasksInNewColumn.Count; i++)
                {
                    tasksInNewColumn[i].Position = i;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

            }
            catch(Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task UpdateTaskItemAsync(Guid taskId, UpdateTaskItemDto dto, Guid userId)
        {
            var task = await GetTaskItemAsync(taskId, userId);

            if (task == null) { throw new Exception("Access denied"); }

            task.Title = dto.Title;
            task.Description = dto.Description;
            await _context.SaveChangesAsync();
        }

        public async Task ReorderTaskItemAsync(Guid taskItemId, int newPosition, Guid userId)
        {
            var task = await GetTaskItemAsync(taskItemId, userId);
            var columnId = task.ColumnId;
            var oldPosition = task.Position;

            if (oldPosition == newPosition)
            {
                return;
            }

            var tasksInColumn = await _context.TaskItem
                .Where(t => t.ColumnId == columnId)
                .OrderBy(t => t.Position)
                .ToListAsync();

            tasksInColumn.RemoveAll(t => t.Id == task.Id);
            newPosition = Math.Clamp(newPosition, 0, tasksInColumn.Count);
            tasksInColumn.Insert(newPosition, task);

            for (int i = 0; i < tasksInColumn.Count; i++)
            {
                tasksInColumn[i].Position = i;
            }

            await _context.SaveChangesAsync();

        }

        public async Task ArchiveTaskItemAsync(Guid taskItemId, Guid userId)
        {
            var task = await GetTaskItemAsync(taskItemId, userId);
            task.isArchived = true;
            await _context.SaveChangesAsync();
        }

        public async Task UnarchiveTaskItemAsync(Guid taskItemId, Guid userId)
        {
            var task = await GetTaskItemAsync(taskItemId, userId);
            task.isArchived = false;
            await _context.SaveChangesAsync();
        }

        private async Task<Domain.Entities.TaskItem> GetTaskItemAsync(Guid taskItemId, Guid userId)
        {
            var task = await _context.TaskItem
                .Include(c => c.Column)
                .ThenInclude(c => c.Board)
                .FirstOrDefaultAsync(c => c.Id == taskItemId && c.Column.Board.UserId == userId);

            if (task == null) { throw new Exception("Access denied"); }

            return task;
        }
    }
}
