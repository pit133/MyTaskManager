using Application.DTOs.TaskCheckListItem;
using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.TaskCheckListItemService
{
    public class TaskCheckListItemService : ITaskCheckListItemService
    {
        private readonly AppDbContext _context;

        public TaskCheckListItemService(AppDbContext context)
        {
            _context = context;
        }

        public async Task ChangeIsCompleted(Guid taskCheckListItemId, Guid userId)
        {
            var taskCheckListItem = await GetTaskCheckListItemAsync(taskCheckListItemId, userId);
            
            if (taskCheckListItem.IsCompleted == true) {
                taskCheckListItem.IsCompleted = false;
            }
            else
            {
                taskCheckListItem.IsCompleted = true;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<TaskCheckListItemDto> CreateTaskCheckListItem(CreateTaskCheckListItemDto dto, Guid userId)
        {
            var taskCheckList = await GetTaskCheckListAsync(dto.TaskCheckListId, userId);

            var maxPosition = await _context.TaskCheckListItem
                .Include(t => t.TaskCheckList)
                .Where(t => t.TaskCheckListId == dto.TaskCheckListId)
                .MaxAsync(t => (int?)t.Position) ?? 0;

            var taskCheckListItem = new TaskCheckListItem()
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                TaskCheckListId = dto.TaskCheckListId,
                Position = maxPosition + 1,
                IsCompleted = false
            };

            _context.TaskCheckListItem.Add(taskCheckListItem);
            await _context.SaveChangesAsync();

            return new TaskCheckListItemDto
            {
                Id = taskCheckListItem.Id,
                Title = taskCheckListItem.Title,
                TaskCheckListId = taskCheckListItem.TaskCheckListId,
                Position = taskCheckListItem.Position,
                IsCompleted = taskCheckListItem.IsCompleted
                
            };
        }

        public async Task DeleteTaskCheckListItem(Guid taskCheckListItemId, Guid userId)
        {
            var taskCheckListItem = await GetTaskCheckListItemAsync(taskCheckListItemId, userId);

            _context.TaskCheckListItem.Remove(taskCheckListItem);
            await _context.SaveChangesAsync();

            var reorderedTaskCheckListItems = await _context.TaskCheckListItem
                .Where(t => t.TaskCheckListId == taskCheckListItem.TaskCheckListId)
                .OrderBy(t => t.Position)
                .ToListAsync();

            for (int i = 0; i < reorderedTaskCheckListItems.Count(); i++)
            {
                reorderedTaskCheckListItems[i].Position = i;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<TaskCheckListItemDto>> GetTaskCheckListItemsAsync(Guid taskCheckListId, Guid userId)
        {
            var taskCheckList = await GetTaskCheckListAsync(taskCheckListId, userId);

            return await _context.TaskCheckListItem
                .Where(t => t.TaskCheckListId == taskCheckListId)
                .OrderBy(t => t.Position)
                .Select(t => new TaskCheckListItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    TaskCheckListId = t.TaskCheckListId,
                    Position = t.Position,
                    IsCompleted = t.IsCompleted,
                })
                .ToListAsync();
        }

        public async Task UpdateTaskCheckListItem(Guid taskCheckListItemId, UpdateTaskCheckListItemDto dto, Guid userId)
        {
            var taskCheckListItem = await GetTaskCheckListItemAsync(taskCheckListItemId, userId);
            taskCheckListItem.Title = dto.Title;
            await _context.SaveChangesAsync();
        }

        

        private async Task<Domain.Entities.TaskCheckList> GetTaskCheckListAsync(Guid taskCheckListId, Guid userId)
        {
            var taskCheckList = await _context.TaskCheckList
                .Include(t => t.TaskItem)
                .ThenInclude(t => t.Column)
                .ThenInclude(t => t.Board)
                .FirstOrDefaultAsync(t => t.Id == taskCheckListId && t.TaskItem.Column.Board.UserId == userId);

            if (taskCheckList == null)
            {
                throw new Exception("Access denied");
            }

            return taskCheckList;
        }

        private async Task<TaskCheckListItem> GetTaskCheckListItemAsync(Guid taskCheckListItemId, Guid userId)
        {
            var taskCheckListItem = await _context.TaskCheckListItem
                .Include(t => t.TaskCheckList)
                .ThenInclude(t => t.TaskItem)
                .ThenInclude(t => t.Column)
                .ThenInclude(t => t.Board)
                .FirstOrDefaultAsync(t => t.Id == taskCheckListItemId && t.TaskCheckList.TaskItem.Column.Board.UserId == userId);

            if (taskCheckListItem == null)
            {
                throw new Exception("Access denied");
            }

            return taskCheckListItem;
        }       
    }
}
