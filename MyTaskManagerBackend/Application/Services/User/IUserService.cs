using Application.DTOs.User;

namespace Application.Services.User
{
    public interface IUserService
    {
        Task<List<UserDto>> GetSearchedUsersByName(string searchTerm);
        Task<List<UserDto>> GetUninvitedUsersByName(Guid boardId, string searchTerm);
    }
}
