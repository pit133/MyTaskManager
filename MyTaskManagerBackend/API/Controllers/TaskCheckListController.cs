using Application.DTOs.TaskCheckList;
using Application.Services.TaskCheckList;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskCheckListController : ControllerBase
    {
        private readonly ITaskCheckListService _service;

        public TaskCheckListController(ITaskCheckListService service)
        {
            _service = service;
        }

        [HttpGet("by-task/{taskItemId}")]
        public async Task<IActionResult> Get(Guid taskItemId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var result = await _service.GetTaskCheckListsAsync(taskItemId, userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTaskCheckListDto dto)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var taskItems = await _service.CreateTaskCheckList(dto, userId);
            return Ok(taskItems);
        }

        [HttpPut("{taskCheckListId}")]
        public async Task<IActionResult> Update(Guid taskCheckListId, UpdateTaskCheckListDto dto)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.UpdateTaskCheckList(taskCheckListId, dto, userId);
            return NoContent();
        }

        [HttpDelete("{taskCheckListId}")]
        public async Task<IActionResult> Delete(Guid taskCheckListId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.DeleteTaskCheckList(taskCheckListId, userId);
            return NoContent();
        }

    }
}
