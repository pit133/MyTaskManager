using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.TaskLabel
{
    public class LabelDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Color { get; set; }
        public Guid BoardId { get; set; }
    }
}
