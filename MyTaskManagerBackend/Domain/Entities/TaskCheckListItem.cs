using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class TaskCheckListItem
    {
        public Guid Id { get; set; }
        public string Title { get; set; }       
        public Guid TaskCheckListId { get; set; }
        public TaskCheckList TaskCheckList { get; set; }
        public int Position { get; set; }
        public bool IsComplited { get; set; }
    }
}
