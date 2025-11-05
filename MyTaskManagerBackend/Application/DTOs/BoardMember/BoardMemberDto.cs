using Domain.Entities;

namespace Application.DTOs.BoardMember
{
    public class BoardMemberDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid BoardId { get; set; }
        public BoardMemberRole Role { get; set; }
        public DateTime JoinedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserName { get; set; }
    }
}
