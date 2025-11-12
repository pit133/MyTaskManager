using Application.DTOs.BoardMember;
using Application.Services.BoardMember;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class BoardMemberController : ControllerBase
    {
        private readonly IBoardMemberService _service;

        public BoardMemberController(IBoardMemberService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateBoardMemberDto dto)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var boardMember = await _service.CreateBoardMemberAsync(dto, userId);

            return Ok(boardMember);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(Guid memberId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            await _service.DeleteBoardMemberAsync(memberId, userId);
            return NoContent();
        }

        [HttpGet("{boardId}")]
        public async Task<IActionResult> Get(Guid boardId)
        {
            var boardMembers = await _service.GetBoardMembersAsync(boardId);
            return Ok(boardMembers);
        }

        [HttpPut]
        public async Task<IActionResult> Put(Guid boardMemberId,UpdateBoardMemberDto dto, Guid userId)
        {
            await _service.UpdateBoardMemberAsync(boardMemberId, dto, userId);
            return NoContent();
        }
    }
}
