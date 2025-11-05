using Application.DTOs.Auth;
using Domain.Entities;
using Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Application.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<User> _hasher;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IPasswordHasher<User> hasher, IConfiguration config)
        {
            _context = context;
            _hasher = hasher;
            _config = config;
        }

        public async Task<string> LoginAsync(LoginDto dto)
        {
            Console.WriteLine($"Login attempt: {dto.Name}");
            var user = _context.Users.FirstOrDefault(x => x.Name == dto.Name);

            if (user == null) { throw new Exception("User not found"); }

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                throw new Exception("Invalid password");
            }

            return GenerateJwt(user);
        }

        public async Task<string> RegisterAsync(RegisterDto dto)
        {
            if (_context.Users.Any(x => x.Name == dto.Name))
            {
                throw new Exception("User already exist");
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = dto.Name
            };

            user.PasswordHash = _hasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return GenerateJwt(user);
        }

        private string GenerateJwt(User user)
        {

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
