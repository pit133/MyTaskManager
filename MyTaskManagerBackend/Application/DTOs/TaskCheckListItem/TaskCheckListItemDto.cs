namespace Application.DTOs.TaskCheckListItem
{
    public class TaskCheckListItemDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid TaskCheckListId { get; set; }
        public int Position { get; set; }
        public bool IsCompleted { get; set; }
    }
}
