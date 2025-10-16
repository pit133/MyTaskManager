using Application.DTOs.TaskCheckList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.TaskCheckList
{
    public interface ITaskCheckListService
    {
        Task<List<TaskCheckListDto>> GetTaskCheckListsAsync(Guid taskItemId, Guid userId);
        Task<TaskCheckListDto> CreateTaskCheckList(CreateTaskCheckListDto dto, Guid userId);
        Task UpdateTaskCheckList(Guid taskCheckListId, UpdateTaskCheckListDto dto, Guid userId);
        Task DeleteTaskCheckList(Guid taskCheckListId, Guid userId);

    }
}
