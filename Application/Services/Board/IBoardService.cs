using Application.DTOs.Board;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Board
{
    public interface IBoardService
    {
        Task<List<BoardDto>> GetBoardAsync(Guid userId);
        Task<BoardDto> CreateBoardAsync(Guid userId, CreateBoardDto dto);
        Task DeleteBoardAsync(Guid boardId, Guid userId);
    }
}
