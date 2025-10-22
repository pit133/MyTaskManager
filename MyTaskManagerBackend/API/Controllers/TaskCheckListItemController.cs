using Application.DTOs.TaskCheckListItem;
using Application.Services.TaskCheckListItemService;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskCheckListItemController : ControllerBase
    {
        private readonly ITaskCheckListItemService _service;

        public TaskCheckListItemController(ITaskCheckListItemService service)
        {
            _service = service;
        }

        [HttpGet("by-TaskCheckList/{taskCheckListId}")]
        public async Task<IActionResult> Get(Guid taskCheckListId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var taskCheckListItems = await _service.GetTaskCheckListItemsAsync(taskCheckListId, userId);
            return Ok(taskCheckListItems);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTaskCheckListItemDto dto)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var result = await _service.CreateTaskCheckListItem(dto, userId);
            return Ok(result);
        }

        [HttpPut("Update/{taskCheckListItemId}")]
        public async Task<IActionResult> Update(Guid taskCheckListItemId, UpdateTaskCheckListItemDto dto)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.UpdateTaskCheckListItem(taskCheckListItemId,dto, userId);
            return NoContent();
        }

        [HttpDelete("{taskCheckListItemId}")]
        public async Task<IActionResult> Delete(Guid taskCheckListItemId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.DeleteTaskCheckListItem(taskCheckListItemId, userId);
            return NoContent();
        }

        [HttpPut("Completed/{taskCheckListItemId}")]
        public async Task<IActionResult> ChangeIsCompleted(Guid taskCheckListItemId, UpdateTaskCheckListItemDto dto)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.ChangeIsCompleted(taskCheckListItemId, userId);
            return NoContent();
        }
    }
}
