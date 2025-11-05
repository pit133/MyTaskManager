using Application.DTOs.Board;
using Application.Services.Board;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BoardController : ControllerBase
    {
        private readonly IBoardService _service;

        public BoardController(IBoardService service)
        {
            _service = service;
        }


        [HttpGet("ownedBoards")]
        public async Task<IActionResult> GetOwnedBoards()
        {
            var userId = ClaimsHelper.GetUserId(User);
            var boards = await _service.GetOwnedBoardsAsync(userId);
            return Ok(boards);
        }

        [HttpGet("memberships")]
        public async Task<IActionResult> GetMemberedBoards()
        {
            var userId = ClaimsHelper.GetUserId(User);
            var boards = await _service.GetMemberedBoardsAsync(userId);
            return Ok(boards);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBoard(CreateBoardDto dto)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var board = await _service.CreateBoardAsync(userId, dto);

            return Ok(board);
        }

        [HttpPut("{boardId}/archive")]
        public async Task<IActionResult> ArchiveBoard(Guid boardId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.ArchiveBoardAsync(boardId, userId);
            return NoContent();
        }

        [HttpPut("{boardId}/unarchive")]
        public async Task<IActionResult> UnarchiveBoard(Guid boardId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.UnarchiveBoardAsync(boardId, userId);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBoard(Guid boardId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.DeleteBoardAsync(boardId, userId);
            return NoContent();
        }
    }
}
