using Application.DTOs.User;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.User
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        public UserService(AppDbContext context) {
            _context = context;
        }

        public async Task<List<UserDto>> GetSearchedUsersByName(string searchTerm)
        {
            return await _context.Users
                .Where(u => u.Name.Contains(searchTerm))
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                })
                .ToListAsync();
        }

        public async Task<List<UserDto>> GetUninvitedUsersByName(Guid boardId, string searchTerm)
        {            
            var invitedUserIds = await _context.BoardMembers
                .Where(bm => bm.BoardId == boardId)
                .Select(bm => bm.UserId)
                .ToListAsync();
         
            var uninvitedUsers = await _context.Users
                .Where(u => u.Name.Contains(searchTerm) &&
                           !invitedUserIds.Contains(u.Id))
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                })
                .ToListAsync();

            return uninvitedUsers;
        }
    }
}
