using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.TaskCheckList
{
    public class TaskCheckListDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public int Position { get; set; }
        public Guid TaskItemId { get; set; }

    }
}
