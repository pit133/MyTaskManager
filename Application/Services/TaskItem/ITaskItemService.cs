using Application.DTOs.TaskItem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.TaskItem
{
    public interface ITaskItemService
    {
        Task<List<TaskItemDto>> GetTaskItemsAsync(Guid columnId, Guid userId);
        Task<TaskItemDto> CreateTaskItemAsync(CreateTaskItemDto dto, Guid userId);
        Task UpdateTaskItemAsync(Guid taskId, UpdateTaskItemDto dto, Guid userId);
        Task MoveTaskItemAsync(Guid taskId, Guid newColumnId, Guid userId);
        Task DeleteTaskItemAsync(Guid taskId, Guid userId);
        Task ReorderTaskItemAsync(Guid taskItemId, int newPosition, Guid userId);       
    }
}
