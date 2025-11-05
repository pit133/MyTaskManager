using Application.DTOs.Board;

namespace Application.Services.Board
{
    public interface IBoardService
    {        
        Task<List<BoardDto>> GetOwnedBoardsAsync(Guid userId);
        Task<List<BoardDto>> GetMemberedBoardsAsync(Guid userId);
        Task<BoardDto> CreateBoardAsync(Guid userId, CreateBoardDto dto);
        Task DeleteBoardAsync(Guid boardId, Guid userId);
        Task ArchiveBoardAsync(Guid boardId, Guid userId);
        Task UnarchiveBoardAsync(Guid boardId, Guid userId);
    }
}
