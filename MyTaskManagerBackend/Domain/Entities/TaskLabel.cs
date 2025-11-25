namespace Domain.Entities
{
    public class TaskLabel
    {
        public Guid TaskItemId { get; set; }
        public TaskItem TaskItem { get; set; }

        public Guid LabelId { get; set; }
        public Label Label { get; set; }
    }
}
