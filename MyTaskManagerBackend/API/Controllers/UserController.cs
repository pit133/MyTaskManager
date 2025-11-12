using Application.Services.User;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        [HttpGet("getByName/{searchTerm}")]
        public async Task<IActionResult> Get(string searchTerm)
        {
            //var userId = ClaimsHelper.GetUserId(User);
            var boards = await _service.GetSearchedUsersByName(searchTerm);
            return Ok(boards);
        }

        [HttpGet("getUninvitedUsersByName/{boardId}/{searchTerm}")]
        public async Task<IActionResult> GetUninvited(Guid boardId, string searchTerm)
        {
            //var userId = ClaimsHelper.GetUserId(User);
            var boards = await _service.GetUninvitedUsersByName(boardId, searchTerm);
            return Ok(boards);
        }
    }
}
