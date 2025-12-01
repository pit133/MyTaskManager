namespace Domain.Entities
{
    public class TaskItem
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public bool? IsCompleted { get; set; }
        public Guid ColumnId { get; set; }
        public Column Column { get; set; }
        public int Position { get; set; }
        public bool isArchived { get; set; }
        public ICollection<TaskLabel> TaskLabels { get; set; }             
    }
}
