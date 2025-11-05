namespace Application.DTOs.BoardMember
{
    public class UpdateBoardMemberDto
    {
        public Guid UserId { get; set; }
        public string Role { get; set; }
    }
}
