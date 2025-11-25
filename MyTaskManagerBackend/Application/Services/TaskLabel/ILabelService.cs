using Application.DTOs.TaskLabel;

namespace Application.Services.TaskLabel
{
    public interface ILabelService
    {        
        Task<LabelDto> CreateBoardLabelAsync(Guid boardId, CreateLabelDto dto);
        public Task AddLabelToTaskAsync(Guid taskId, Guid labelId);
        public Task RemoveLabelFromTaskAsync(Guid taskId, Guid labelId);
        public Task<List<LabelDto>> GetBoardLabelsAsync(Guid boardId);
        public Task<List<LabelDto>> GetTaskLabelsAsync(Guid taskId);
    }
}
