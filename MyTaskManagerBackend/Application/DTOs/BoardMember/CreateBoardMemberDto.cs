using Domain.Entities;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Application.DTOs.BoardMember
{
    public class CreateBoardMemberDto
    {
        public Guid BoardId { get; set; }
        public Guid InvitedUserId { get; set; }        
        public string Role { get; set; }
    }
}
