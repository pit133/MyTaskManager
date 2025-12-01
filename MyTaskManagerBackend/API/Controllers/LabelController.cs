using Application.DTOs.BoardMember;
using Application.DTOs.TaskLabel;
using Application.Services.TaskLabel;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class LabelController : ControllerBase
    {
        private readonly ILabelService _service;

        public LabelController(ILabelService service)
        {
            _service = service;
        }

        [HttpPost("board-label/{boardId}")]
        public async Task<IActionResult> Create(Guid boardId, CreateLabelDto dto)
        {
            var boardLabel = await _service.CreateBoardLabelAsync(boardId, dto);

            return Ok(boardLabel);
        }

        [HttpPost("task-label/{taskId}/{labelId}")]
        public async Task<IActionResult> AddLabelToTask(Guid taskId, Guid labelId)
        {
            await _service.AddLabelToTaskAsync(taskId, labelId);
            return NoContent();
        }

        [HttpDelete("delete-label-from-task/{taskId}/{labelId}")]
        public async Task<IActionResult> Delete(Guid taskId, Guid labelId)
        {
            await _service.RemoveLabelFromTaskAsync(taskId, labelId);
            return NoContent();
        }

        [HttpDelete("delete-board-label/{labelId}")]
        public async Task<IActionResult> Delete(Guid labelId)
        {
            await _service.DeleteBoardLabelAsync(labelId);
            return NoContent();
        }

        [HttpGet("board-labels/{boardId}")]
        public async Task<IActionResult> GetBoardLabels(Guid  boardId)
        {
            var boardLabels = await _service.GetBoardLabelsAsync(boardId);
            return Ok(boardLabels);
        }

        [HttpGet("task-labels/{taskId}")]
        public async Task<IActionResult> GetTaskLabels(Guid taskId)
        {
            var taskLabels = await _service.GetTaskLabelsAsync(taskId);
            return Ok(taskLabels);
        }

    }
}
