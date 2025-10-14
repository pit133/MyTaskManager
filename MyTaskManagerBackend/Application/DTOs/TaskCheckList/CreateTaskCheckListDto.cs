using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.TaskCheckList
{
    public class CreateTaskCheckListDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
    }
}
