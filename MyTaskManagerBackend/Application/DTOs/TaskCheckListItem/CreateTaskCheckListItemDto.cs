using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.TaskCheckListItem
{
    public class CreateTaskCheckListItemDto
    {
        public Guid TaskCheckListId { get; set; }
        public string Title {  get; set; }        
    }
}
