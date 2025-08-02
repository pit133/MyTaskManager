using Application.DTOs.Column;
using Domain.Entities;
using Infrasructure;
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
            var board = await _context.Board.FirstOrDefaultAsync(b => b.Id == dto.BoardId && b.UserId == userId);

            if (board == null)
            {
                throw new Exception("Access denied or board not found");
            }

            var maxPosition = await _context.Column
                .Where(t => t.BoardId == dto.BoardId)
                .MaxAsync(t => (int?)t.Position) ?? 0;

            var column = new Domain.Entities.Column()
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                BoardId = dto.BoardId,
                Position = maxPosition + 1
            };

            _context.Column.Add(column);
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

            _context.Column.Remove(column);
            await _context.SaveChangesAsync();

            var reorderedColumns = await _context.Column
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
            var board = _context.Board.FirstOrDefaultAsync(b => b.Id == boardId && b.UserId == userId);

            if (board == null) { throw new Exception("Access denied or board not found"); }

            return await _context.Column
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

            var board = await _context.Board
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
            var reorderedcolumnId = columnId;
            var oldPostion = reorderedColumn.Position;

            if (oldPostion == newPosition)
            {
                return;
            }

            var columnsInBoard = await _context.Column                
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

            var taskItemnsInColumnList = await _context.TaskItem
                .Include(c => c.Column)
                .Where(c => c.ColumnId == column.Id)
                .ToListAsync();

            foreach (var taskItem in taskItemnsInColumnList)
            {
                taskItem.isArchived = true;
            }

            await _context.SaveChangesAsync();            
        }

        public async Task UnarchiveColumnAsync(Guid columnId, Guid userId)
        {
            var column = await GetColumnFromDbAsync (columnId, userId);
            column.isArchived = false;

            var taskItemnsInColumnList = await _context.TaskItem
                .Include(c => c.Column)
                .Where(c => c.ColumnId == column.Id)
                .ToListAsync();

            foreach (var taskItem in taskItemnsInColumnList)
            {
                taskItem.isArchived = false;
            }

            await _context.SaveChangesAsync();
        }


        private async Task<Domain.Entities.Column> GetColumnFromDbAsync(Guid columnId, Guid userId)
        {
            var column = await _context.Column
                .Include(c => c.Board)
                .FirstOrDefaultAsync(c => c.Id == columnId && c.Board.UserId == userId);

            if (column == null) { throw new Exception("Access denied or column not found"); }

            return column;
        }
    }
}
