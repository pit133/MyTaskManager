using Application.DTOs.TaskLabel;
using Application.Services.TaskLabel;
using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;



public class LabelService : ILabelService
{
    private readonly AppDbContext _context;

    public LabelService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<LabelDto> CreateBoardLabelAsync(Guid boardId, CreateLabelDto dto)
    {
        var label = new Label
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Color = dto.Color,
            BoardId = boardId
        };

        _context.Labels.Add(label);
        await _context.SaveChangesAsync();

        return new LabelDto { 
            Id = label.Id,
            Title = label.Title,
            Color = label.Color,
            BoardId = boardId
        };
    }

    public async Task AddLabelToTaskAsync(Guid taskId, Guid labelId)
    {
        var task = await _context.TaskItems
            .Include(t => t.Column.Board)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        var label = await _context.Labels
            .FirstOrDefaultAsync(l => l.Id == labelId);
        
        if (task?.Column?.BoardId != label?.BoardId)
        {
            throw new InvalidOperationException("Label does not belong to task's board");
        }

        var taskLabel = new TaskLabel
        {
            TaskItemId = taskId,
            LabelId = labelId
        };

        _context.TaskLabels.Add(taskLabel);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveLabelFromTaskAsync(Guid taskId, Guid labelId)
    {
        var taskLabel = await _context.TaskLabels
            .FirstOrDefaultAsync(tl => tl.TaskItemId == taskId && tl.LabelId == labelId);

        if (taskLabel != null)
        {
            _context.TaskLabels.Remove(taskLabel);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<LabelDto>> GetBoardLabelsAsync(Guid boardId)
    {
        return await _context.Labels
            .Where(l => l.BoardId == boardId)
            .Select(l => new LabelDto
            {
                Id = l.Id,
                Title = l.Title,
                Color = l.Color,
                BoardId = l.BoardId
            })
            .ToListAsync();                
    }

    public async Task<List<LabelDto>> GetTaskLabelsAsync(Guid taskId)
    {        
        return await _context.TaskLabels
            .Where(tl => tl.TaskItemId == taskId)
            .Select(tl => new LabelDto
            {
                Id = tl.Label.Id,
                Title = tl.Label.Title,
                Color = tl.Label.Color,
                BoardId = tl.Label.BoardId
            })
            .ToListAsync();
    }    
}