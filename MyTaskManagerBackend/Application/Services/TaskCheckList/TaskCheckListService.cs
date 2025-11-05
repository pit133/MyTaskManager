using Application.DTOs.TaskCheckList;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.TaskCheckList
{
    public class TaskCheckListService : ITaskCheckListService
    {
        private readonly AppDbContext _context;
        public TaskCheckListService(AppDbContext context) {
            _context = context;
        }
        public async Task<TaskCheckListDto> CreateTaskCheckList(CreateTaskCheckListDto dto, Guid userId)
        {
            var taskItem = await GetTaskItemAsync(dto.TaskItemId, userId);            

            var maxPosition = await _context.TaskCheckLists                
                .Where(t => t.TaskItemId == dto.TaskItemId)
                .MaxAsync(t => (int?)t.Position) ?? 0;

            var taskCheckList = new Domain.Entities.TaskCheckList
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                TaskItemId = dto.TaskItemId,
                Position = maxPosition + 1
            };

            _context.TaskCheckLists.Add(taskCheckList);
            await _context.SaveChangesAsync();

            return new TaskCheckListDto
            {
                Id = taskCheckList.Id,
                Title = taskCheckList.Title,
                TaskItemId = taskCheckList.TaskItemId,
                Position = taskCheckList.Position
            };
        }
        

        public async Task DeleteTaskCheckList(Guid taskCheckListId, Guid userId)
        {
            var taskCheckList = await _context.TaskCheckLists
                .Include(t => t.TaskItem)
                .ThenInclude(t => t.Column)
                .ThenInclude(t => t.Board)
                .FirstOrDefaultAsync(t => t.Id == taskCheckListId && t.TaskItem.Column.Board.UserId == userId);
            if (taskCheckList == null) { throw new Exception("Access denied"); }

            _context.TaskCheckLists.Remove(taskCheckList);
            await _context.SaveChangesAsync();

            var reorderedTaskCheckLists = await _context.TaskCheckLists
                .Where(t => t.TaskItemId == taskCheckList.TaskItemId)
                .OrderBy(t => t.Position)
                .ToListAsync();

            for (int i = 0; i < reorderedTaskCheckLists.Count(); i++)
            {
                reorderedTaskCheckLists[i].Position = i;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<TaskCheckListDto>> GetTaskCheckListsAsync(Guid taskItemId, Guid userId)
        {
            var taskItem = GetTaskItemAsync(taskItemId, userId);

            return await _context.TaskCheckLists
                .Where(t => t.TaskItemId == taskItemId)
                .OrderBy(t => t.Position)
                .Select(t => new TaskCheckListDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    TaskItemId = taskItemId,
                    Position = t.Position
                })
                .ToListAsync();            
        }

        public async Task UpdateTaskCheckList(Guid taskCheckListId, UpdateTaskCheckListDto dto, Guid userId)
        {
            var taskCheckList = await _context.TaskCheckLists
                .Include(t => t.TaskItem)
                .ThenInclude(t => t.Column)
                .ThenInclude(t => t.Board)
                .FirstOrDefaultAsync(t => t.Id == taskCheckListId && t.TaskItem.Column.Board.UserId == userId);
            if (taskCheckList == null) { throw new Exception("Access denied"); }

            taskCheckList.Title = dto.Title;
            await _context.SaveChangesAsync();
        }

        private async Task<Domain.Entities.TaskItem> GetTaskItemAsync(Guid taskItemId, Guid userId)
        {
            var task = await _context.TaskItems
                .Include(c => c.Column)
                .ThenInclude(c => c.Board)
                .FirstOrDefaultAsync(c => c.Id == taskItemId && c.Column.Board.UserId == userId);

            if (task == null) { throw new Exception("Access denied"); }

            return task;
        }
    }
}
