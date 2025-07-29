using Application.DTOs.Column;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Column
{
    public interface IColumnService
    {
        Task <List<ColumnDto>> GetColumnsAsync (Guid boardId, Guid userId);
        Task<ColumnDto> CreateColumnAsync(CreateColumnDto dto, Guid userId);
        Task DeleteColumnAsync(Guid columnId, Guid userId);
        Task MoveColumnAsync(Guid columnId, Guid newBoardId, Guid userId);
        Task UpdateColumnAsync(Guid columnId, UpdateColumnDto dto, Guid userId);
        Task ReorderColumnAsync(Guid columnId, int newPosition, Guid userId);     
        
    }
}
