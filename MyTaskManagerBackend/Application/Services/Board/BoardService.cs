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

        public BoardService(AppDbContext context) {
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

            _context.Board.Add(board);
            await _context.SaveChangesAsync();

            return new BoardDto { Id = board.Id, Name = board.Name, };
        }

        public async Task DeleteBoardAsync(Guid boardId, Guid userId)
        {
            var board = await _context.Board.FirstOrDefaultAsync(x => x.Id == boardId && x.UserId == userId);
            if(board == null) { throw new Exception("Not found"); }
            _context.Board.Remove(board);  
            await _context.SaveChangesAsync();

        }

        public async Task ArchiveBoardAsync(Guid boardId, Guid userId)
        {
            var board = await _context.Board.FirstOrDefaultAsync(x => x.Id == boardId && x.UserId == userId);
            if (board == null) { throw new Exception("Not found"); }
            board.isArchived = true;

            var columnsInBoardList = await _context.Column
                .Where(c => c.BoardId == board.Id)
                .ToListAsync();

            foreach (var column in columnsInBoardList)
            {
                column.isArchived = true;                

                var tasksItemsInColumnList = await _context.TaskItem
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
            var board = await _context.Board.FirstOrDefaultAsync(x => x.Id == boardId && x.UserId == userId);
            if (board == null) { throw new Exception("Not found"); }
            board.isArchived = false;

            var columnsInBoardList = await _context.Column
                .Where(c => c.BoardId == board.Id)
                .ToListAsync();

            foreach (var column in columnsInBoardList)
            {
                column.isArchived = false;

                var tasksItemsInColumnList = await _context.TaskItem
                    .Where(t => t.ColumnId == column.Id)
                    .ToListAsync();

                foreach (var taskItem in tasksItemsInColumnList)
                {
                    taskItem.isArchived = false;
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<BoardDto>> GetBoardAsync(Guid userId)
        {
            return await _context.Board
                .Where(b => b.UserId == userId && !b.isArchived)
                .Select(b => new BoardDto { Id = b.Id, Name = b.Name })
                .ToListAsync();
        }        
    }
}
