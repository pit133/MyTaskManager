using Application.DTOs.Column;
using Application.Services.Column;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ColumnController : ControllerBase
    {
        private readonly IColumnService _service;

        public ColumnController(IColumnService service)
        {
            _service = service;
        }

        [HttpGet("by-board/{boardId}")]
        public async Task<IActionResult> GetColumns(Guid boardId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var columns = await _service.GetColumnsAsync(boardId, userId);
            return Ok(columns);
        }

        [HttpPost]
        public async Task<IActionResult> CreateColumn(CreateColumnDto dto)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var result = await _service.CreateColumnAsync(dto, userId);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColumn(Guid id)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.DeleteColumnAsync(id, userId);
            return NoContent();
        }

        [HttpPut("{columnId}/move{newBoardId}")]
        public async Task<IActionResult> MoveColumn(Guid columnId, Guid newBoardId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.MoveColumnAsync(columnId, newBoardId, userId);
            return NoContent();
        }

        [HttpPut("{columnId}")]
        public async Task<IActionResult> UpdateColumn(Guid columnId, UpdateColumnDto dto)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.UpdateColumnAsync(columnId, dto, userId);
            return NoContent();
        }

        [HttpPut("{columnId}/reorder{newPosition}")]
        public async Task<IActionResult> ReorderColumn(Guid columnId, int newPosition)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.ReorderColumnAsync(columnId, newPosition, userId);
            return NoContent();
        }

        [HttpPut("{columnId}/archive")]
        public async Task<IActionResult> ArchiveColumn(Guid columnId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.ArchiveColumnAsync(columnId, userId);
            return NoContent();
        }

        [HttpPut("{columnId}/unarchive")]
        public async Task<IActionResult> UnarchiveColumn(Guid columnId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.UnarchiveColumnAsync(columnId, userId);
            return NoContent();
        }
    }
}
