using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Board
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public ICollection<BoardMember> Members { get; set; }
        public ICollection<Column> Columns { get; set; }
        public bool isArchived { get; set; }
    }
}
