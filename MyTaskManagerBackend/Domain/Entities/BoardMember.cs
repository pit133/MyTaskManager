namespace Domain.Entities
{
    public class BoardMember
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid BoardId { get; set; }
        public BoardMemberRole Role { get; set; }
        public DateTime JoinedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        
        public virtual User User { get; set; }
        public virtual Board Board { get; set; }
    }

    public enum BoardMemberRole { Owner, Admin, Member}
}
