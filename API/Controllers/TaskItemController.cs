using Application.DTOs.TaskItem;
using Application.Services.TaskItem;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskItemController : ControllerBase
    {
        private readonly ITaskItemService _service;

        public TaskItemController(ITaskItemService service)
        {
            _service = service;
        }

        [HttpGet("by-column/{columnId}")]
        public async Task<IActionResult> GetTaskItems(Guid columnId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var taskItems = await _service.GetTaskItemsAsync(columnId, userId);
            return Ok(taskItems);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTaskItem(CreateTaskItemDto dto)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var result = await _service.CreateTaskItemAsync(dto, userId);
            return Ok(result);
        }

        [HttpPut("{taskItemId}")]
        public async Task<IActionResult> Update(Guid taskItemId, UpdateTaskItemDto dto)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.UpdateTaskItemAsync(taskItemId, dto, userId);
            return NoContent();
        }

        [HttpPut("{taskItemId}/move/{newColumnId}")]
        public async Task<IActionResult> Move(Guid taskItemId, Guid newColumnId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.MoveTaskItemAsync(taskItemId, newColumnId, userId);
            return NoContent();
        }

        [HttpPut("{taskItemId}/reorder/{newPosition}")]
        public async Task<IActionResult> Reorder(Guid taskItemId, int newPosition)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.ReorderTaskItemAsync(taskItemId, newPosition, userId);                 
            return NoContent();
        }

        [HttpDelete("{taskItemId}")]
        public async Task<IActionResult> Delete(Guid taskItemId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.DeleteTaskItemAsync(taskItemId, userId);
            return NoContent();
        }
    }
}
