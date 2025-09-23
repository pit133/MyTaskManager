using System.Security.Claims;

namespace API.Controllers
{
    public static class ClaimsHelper
    {
        public static Guid GetUserId(ClaimsPrincipal user)
        {
            var id = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
        }
    }
}
