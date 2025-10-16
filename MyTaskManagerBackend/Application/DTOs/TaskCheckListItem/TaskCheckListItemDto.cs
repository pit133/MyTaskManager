using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.TaskCheckListItem
{
    public class TaskCheckListItemDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid TaskCheckListId { get; set; }
        public int Position { get; set; }
        public bool IsComplited { get; set; }
    }
}
