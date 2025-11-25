using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Label
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Color { get; set; }
        public Guid BoardId { get; set; }
        public Board Board { get; set; }
        
        public ICollection<TaskLabel> TaskLabels { get; set; }
    }
}
