using Application.DTOs.BoardMember;

namespace Application.Services.BoardMember
{
    public interface IBoardMemberService
    {
        public Task<List<BoardMemberDto>> GetBoardMembersAsync(Guid BoardId);
        public Task<BoardMemberDto> CreateBoardMemberAsync(CreateBoardMemberDto dto, Guid userId);
        public Task UpdateBoardMemberAsync(Guid BoardMemberId, UpdateBoardMemberDto dto, Guid userId);
        public Task DeleteBoardMemberAsync(Guid MemberId, Guid currentUserId);
        public Task LeaveBoardAsync(Guid boardId, Guid currentUserId);
    }
}
