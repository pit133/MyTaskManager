using Application.DTOs.Board;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Board
{
    public class BoardService : IBoardService
    {
        private readonly AppDbContext _context;

        public BoardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<BoardDto> CreateBoardAsync(Guid userId, CreateBoardDto dto)
        {
            var board = new Domain.Entities.Board
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                UserId = userId,
            };
            _context.Boards.Add(board);

            var boardMember = new Domain.Entities.BoardMember
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                BoardId = board.Id,
                Role = Domain.Entities.BoardMemberRole.Owner,
                JoinedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };
            _context.BoardMembers.Add(boardMember);

            await _context.SaveChangesAsync();
            return new BoardDto { Id = board.Id, Name = board.Name, };
        }

        public async Task DeleteBoardAsync(Guid boardId, Guid userId)
        {
            var board = await _context.Boards.FirstOrDefaultAsync(x => x.Id == boardId && x.UserId == userId);
            if (board == null) { throw new Exception("Not found"); }
            _context.Boards.Remove(board);
            await _context.SaveChangesAsync();

        }

        public async Task ArchiveBoardAsync(Guid boardId, Guid userId)
        {
            var board = await _context.Boards.FirstOrDefaultAsync(x => x.Id == boardId && x.UserId == userId);
            if (board == null) { throw new Exception("Not found"); }
            board.isArchived = true;

            var columnsInBoardList = await _context.Columns
                .Where(c => c.BoardId == board.Id)
                .ToListAsync();

            foreach (var column in columnsInBoardList)
            {
                column.isArchived = true;

                var tasksItemsInColumnList = await _context.TaskItems
                    .Where(t => t.ColumnId == column.Id)
                    .ToListAsync();

                foreach (var taskItem in tasksItemsInColumnList)
                {
                    taskItem.isArchived = true;
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task UnarchiveBoardAsync(Guid boardId, Guid userId)
        {
            var board = await _context.Boards.FirstOrDefaultAsync(x => x.Id == boardId && x.UserId == userId);
            if (board == null) { throw new Exception("Not found"); }
            board.isArchived = false;

            var columnsInBoardList = await _context.Columns
                .Where(c => c.BoardId == board.Id)
                .ToListAsync();

            foreach (var column in columnsInBoardList)
            {
                column.isArchived = false;

                var tasksItemsInColumnList = await _context.TaskItems
                    .Where(t => t.ColumnId == column.Id)
                    .ToListAsync();

                foreach (var taskItem in tasksItemsInColumnList)
                {
                    taskItem.isArchived = false;
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<BoardDto>> GetOwnedBoardsAsync(Guid userId)
        {
            var ownedBoards = await _context.Boards
                .Where(b => b.UserId == userId && !b.isArchived)
                .Select(b => new BoardDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    OwnerName = b.User.Name,
                })
            .ToListAsync();

            return ownedBoards;
        }

        public async Task<List<BoardDto>> GetMemberedBoardsAsync(Guid userId)
        {
            return await _context.BoardMembers
                .Where(m => m.UserId == userId)
                .Where(m => m.Board.UserId != userId)
                .Where(m => !m.Board.isArchived)
                .Select(m => new BoardDto
                {
                    Id = m.BoardId,
                    Name = m.Board.Name,
                    OwnerName = m.Board.User.Name
                })
                .ToListAsync();
        }
    }
}
