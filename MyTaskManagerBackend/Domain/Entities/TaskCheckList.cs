using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class TaskCheckList
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid TaskItemId { get; set; }
        public TaskItem TaskItem { get; set; }
        public ICollection<TaskCheckListItem> TaskCheckListItems { get; set; }        
    }
}
