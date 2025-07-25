using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Column
{
    public class ColumnDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid BoardId {  get; set; } 
    }
}
