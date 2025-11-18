namespace Application.DTOs.BoardMember
{
    public class CreateBoardMemberDto
    {
        public string Name { get; set; }
        public Guid BoardId { get; set; }
        public Guid InvitedUserId { get; set; }        
        public string Role { get; set; }
    }
}
