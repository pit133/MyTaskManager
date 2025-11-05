using Application.DTOs.Column;

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
        Task ArchiveColumnAsync(Guid columnId, Guid userId);
        Task UnarchiveColumnAsync(Guid columnId, Guid userId);
    }
}
