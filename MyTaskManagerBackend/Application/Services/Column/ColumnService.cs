using Application.DTOs.Column;
using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace Application.Services.Column
{
    public class ColumnService : IColumnService
    {
        private readonly AppDbContext _context;

        public ColumnService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ColumnDto> CreateColumnAsync(CreateColumnDto dto, Guid userId)
        {
            var boardMember = await _context.BoardMembers
               .FirstOrDefaultAsync(bm => bm.BoardId == dto.BoardId && bm.UserId == userId);

            if (boardMember == null)
            {
                throw new Exception("Access denied or board not found");
            }

            var maxPosition = await _context.Columns
                .Where(t => t.BoardId == dto.BoardId)
                .MaxAsync(t => (int?)t.Position) ?? 0;

            var column = new Domain.Entities.Column()
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                BoardId = dto.BoardId,
                Position = maxPosition + 1
            };

            _context.Columns.Add(column);
            await _context.SaveChangesAsync();

            return new ColumnDto
            {
                Id = column.Id,
                Title = column.Title,
                BoardId = column.BoardId,
                Position = column.Position
            };
        }

        public async Task DeleteColumnAsync(Guid columnId, Guid userId)
        {
            var column = await GetColumnFromDbAsync(columnId, userId);

            if (column == null)
            {
                throw new Exception("Access denied or column not found");
            }

            _context.Columns.Remove(column);
            await _context.SaveChangesAsync();

            var reorderedColumns = await _context.Columns
                .Where(c => c.BoardId == column.BoardId)
                .OrderBy(c => c.Position)
                .ToListAsync();

            for (int i = 0; i < reorderedColumns.Count(); i++)
            {
                reorderedColumns[i].Position = i;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<ColumnDto>> GetColumnsAsync(Guid boardId, Guid userId)
        {
            var boardMember = await _context.BoardMembers
                 .FirstOrDefaultAsync(bm => bm.BoardId == boardId && bm.UserId == userId);

            if (boardMember == null)
            {
                throw new Exception("Access denied or board not found");
            }

            return await _context.Columns
                .Where(b => b.BoardId == boardId && !b.isArchived)
                .OrderBy(b => b.Position)
                .Select(b => new ColumnDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    BoardId = b.BoardId,
                    Position = b.Position
                })
                .ToListAsync();
        }

        public async Task MoveColumnAsync(Guid columnId, Guid newBoardId, Guid userId)
        {
            var column = await GetColumnFromDbAsync(columnId, userId);

            var board = await _context.Boards
                .FirstOrDefaultAsync(b => b.Id == newBoardId && b.UserId == userId);

            if (board == null || column == null) {

                throw new Exception("Access denied");
            }

            column.BoardId = newBoardId;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateColumnAsync(Guid columnId, UpdateColumnDto dto, Guid userId)
        {
            var column = await GetColumnFromDbAsync(columnId, userId);

            if (column == null) { throw new Exception("Access denied"); }

            column.Title = dto.Title;
            await _context.SaveChangesAsync();
        }
        
        public async Task ReorderColumnAsync(Guid columnId, int newPosition, Guid userId)
        {
            var reorderedColumn = await GetColumnFromDbAsync(columnId, userId);
            var reorderedColumnId = columnId;
            var oldPosition = reorderedColumn.Position;

            if (oldPosition == newPosition)
            {
                return;
            }

            var columnsInBoard = await _context.Columns                
                .Where(c => c.BoardId == reorderedColumn.BoardId)
                .OrderBy(c => c.Position)
                .ToListAsync();
            
            columnsInBoard.RemoveAll(c => c.Id == reorderedColumn.Id);
            newPosition = Math.Clamp(newPosition, 0, columnsInBoard.Count);
            columnsInBoard.Insert(newPosition, reorderedColumn);

            for (int i = 0; i < columnsInBoard.Count; i++)
            {
                columnsInBoard[i].Position = i;
            }
            
            await _context.SaveChangesAsync();
        }
        
        public async Task ArchiveColumnAsync(Guid columnId, Guid userId)
        {
            var column = await GetColumnFromDbAsync(columnId, userId);
            column.isArchived = true;

            var taskItemsInColumnList = await _context.TaskItems
                .Include(c => c.Column)
                .Where(c => c.ColumnId == column.Id)
                .ToListAsync();

            foreach (var taskItem in taskItemsInColumnList)
            {
                taskItem.isArchived = true;
            }

            await _context.SaveChangesAsync();            
        }

        public async Task UnarchiveColumnAsync(Guid columnId, Guid userId)
        {
            var column = await GetColumnFromDbAsync (columnId, userId);
            column.isArchived = false;

            var taskItemsInColumnList = await _context.TaskItems
                .Include(c => c.Column)
                .Where(c => c.ColumnId == column.Id)
                .ToListAsync();

            foreach (var taskItem in taskItemsInColumnList)
            {
                taskItem.isArchived = false;
            }

            await _context.SaveChangesAsync();
        }


        private async Task<Domain.Entities.Column> GetColumnFromDbAsync(Guid columnId, Guid userId)
        {
            var column = await _context.Columns
                .Include(c => c.Board)
                .ThenInclude(b => b.Members)
                .FirstOrDefaultAsync(c => c.Id == columnId);

            if (column == null)
            {
                throw new Exception("Column not found");
            }
            
            var isBoardMember = column.Board.Members.Any(m => m.UserId == userId);

            if (!isBoardMember)
            {
                throw new Exception("Access denied");
            }

            return column;
        }
    }
}
