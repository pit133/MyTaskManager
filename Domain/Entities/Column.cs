﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Column
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid BoardId { get; set; }
        public Board Board { get; set; }
        public ICollection<TaskItem> TaskItems { get; set;}
        public int Position { get; set; }     
    }
}
