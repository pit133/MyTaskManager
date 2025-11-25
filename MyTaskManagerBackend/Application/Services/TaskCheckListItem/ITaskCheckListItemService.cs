using Application.DTOs.TaskCheckList;
using Application.DTOs.TaskCheckListItem;

namespace Application.Services.TaskCheckListItemService
{
    public interface ITaskCheckListItemService
    {
        Task<List<TaskCheckListItemDto>> GetTaskCheckListItemsAsync(Guid taskCheckListId, Guid userId);
        Task<TaskCheckListItemDto> CreateTaskCheckListItem(CreateTaskCheckListItemDto dto, Guid userId);
        Task UpdateTaskCheckListItem(Guid taskCheckListItemId, UpdateTaskCheckListItemDto dto, Guid userId);
        Task DeleteTaskCheckListItem(Guid taskCheckListItemId, Guid userId);
        Task ChangeIsCompleted(Guid taskCheckListItemId, Guid userId);
    }
}
