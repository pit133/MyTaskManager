namespace Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string PasswordHash { get; set; }
        public ICollection<Board> OwnedBoards { get; set; }
        public ICollection<BoardMember> BoardMemberships { get; set; }
    }
}
