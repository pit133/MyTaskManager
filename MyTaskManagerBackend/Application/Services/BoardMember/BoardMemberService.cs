using Application.DTOs.BoardMember;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Application.Services.BoardMember
{
    public class BoardMemberService : IBoardMemberService
    {
        private readonly AppDbContext _context;
        public BoardMemberService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<BoardMemberDto> CreateBoardMemberAsync(CreateBoardMemberDto dto, Guid userId)
        {
            var boardExists = await _context.Boards.AnyAsync(b => b.Id == dto.BoardId);

            if (!boardExists)
            {
                throw new Exception("Board not found");
            }

            BoardMemberRole role;

            if (dto.Role == "Owner")
            {
                throw new Exception("Cannot assign Owner role to members");
            }
            else if (dto.Role == "Admin")
            {
                role = BoardMemberRole.Admin;
            }
            else if (dto.Role == "Member")
            {
                role = BoardMemberRole.Member;
            }
            else
            {
                throw new Exception($"Invalid role: {dto.Role}. Must be Admin or Member");
            }

            var boardMember = await _context.BoardMembers.FirstOrDefaultAsync
                (bm => bm.BoardId == dto.BoardId
                && bm.UserId == userId);

            var userToAdd = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.InvitedUserId);
            if (userToAdd == null)
            {
                throw new Exception("User not found");
            }

            if (boardMember == null
                || (boardMember.Role != BoardMemberRole.Owner
                && boardMember.Role != BoardMemberRole.Admin))
            {
                throw new Exception("Access denied");
            }

            var existingMember = await _context.BoardMembers.FirstOrDefaultAsync
                (bm => bm.BoardId == dto.BoardId
                && bm.UserId == dto.InvitedUserId);

            if (existingMember != null)
            {
                throw new Exception("User is already a member of this board");
            }

            var member = new Domain.Entities.BoardMember()
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                UserId = dto.InvitedUserId,
                BoardId = dto.BoardId,
                Role = role,
                JoinedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.BoardMembers.Add(member);
            await _context.SaveChangesAsync();

            return new BoardMemberDto
            {
                Id = member.Id,
                Name = member.Name,
                UserId = member.UserId,
                BoardId = member.BoardId,
                Role = member.Role,
                JoinedAt = member.JoinedAt,
                CreatedAt = member.CreatedAt,                
            };

        }

        public async Task DeleteBoardMemberAsync(Guid memberId, Guid currentUserId)
        {
            var memberToDelete = await _context.BoardMembers
                .Include(m => m.Board)
                .FirstOrDefaultAsync(m => m.Id == memberId);

            if (memberToDelete == null)
            {
                throw new Exception("Member not found");
            }

            var currentUserMember = await _context.BoardMembers
                .FirstOrDefaultAsync(m => m.BoardId == memberToDelete.BoardId && m.UserId == currentUserId);

            if (currentUserMember == null ||
                (currentUserMember.Role != BoardMemberRole.Owner && currentUserMember.Role != BoardMemberRole.Admin))
            {
                throw new Exception("Access denied");
            }

            if (memberToDelete.Role == BoardMemberRole.Owner)
            {
                throw new Exception("Cannot remove board owner");
            }

            if (memberToDelete.UserId == currentUserId && currentUserMember.Role == BoardMemberRole.Admin)
            {
                throw new Exception("Admins cannot remove themselves");
            }

            _context.BoardMembers.Remove(memberToDelete);
            await _context.SaveChangesAsync();
        }

        public async Task<List<BoardMemberDto>> GetBoardMembersAsync(Guid boardId)
        {
            return await _context.BoardMembers
                .Where(m => m.BoardId == boardId)
                .Include(m => m.User) 
                .Select(m => new BoardMemberDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    UserId = m.UserId,
                    BoardId = boardId,                    
                    Role = m.Role,
                    JoinedAt = m.JoinedAt,
                    CreatedAt = m.CreatedAt,
                    UserName = m.User.Name
                })
                .ToListAsync();
        }

        public async Task UpdateBoardMemberAsync(Guid boardMemberId, UpdateBoardMemberDto dto, Guid currentUserId)
        {
            var memberToUpdate = await _context.BoardMembers
            .Include(m => m.Board)
            .FirstOrDefaultAsync(m => m.Id == boardMemberId);

            if (memberToUpdate == null)
            {
                throw new Exception("Member not found");
            }

            var currentUserMember = await _context.BoardMembers
                .FirstOrDefaultAsync(m => m.BoardId == memberToUpdate.BoardId && m.UserId == currentUserId);

            if (currentUserMember == null || currentUserMember.Role == BoardMemberRole.Member)
            {
                throw new Exception("Access denied");
            }

            BoardMemberRole newRole = dto.Role switch
            {
                "Admin" => BoardMemberRole.Admin,
                "Member" => BoardMemberRole.Member,
                "Owner" => throw new Exception("Cannot assign Owner role to members"),
                _ => throw new Exception($"Invalid role: {dto.Role}. Must be Admin or Member")
            };

            
            if (memberToUpdate.Role == BoardMemberRole.Owner)
            {
                throw new Exception("Cannot change owner's role");
            }

            if (memberToUpdate.Role == BoardMemberRole.Admin && currentUserMember.Role != BoardMemberRole.Owner)
            {
                throw new Exception("Only owner can change admin role");
            }

            if (memberToUpdate.UserId == currentUserId)
            {
                throw new Exception("Cannot change your own role");
            }

            memberToUpdate.Role = newRole;
            await _context.SaveChangesAsync();
        }
    }
}
