using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Security.Cryptography.X509Certificates;

namespace Infrastructure.Configurations
{
    public class BoardMemberConfiguration : IEntityTypeConfiguration<BoardMember>
    {
        public void Configure(EntityTypeBuilder<BoardMember> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                .IsRequired();

            builder.Property(x => x.Role)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(x => x.JoinedAt)
                 .IsRequired();

            builder.Property(x => x.CreatedAt)
                 .IsRequired();

            builder.HasOne(x => x.User)
                 .WithMany(u => u.BoardMemberships)
                 .HasForeignKey(x => x.UserId)
                 .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Board)
                 .WithMany(x => x.Members)
                 .HasForeignKey(x => x.BoardId)
                 .OnDelete(DeleteBehavior.Restrict);
            
            builder.Property(x => x.JoinedAt)
                   .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(x => x.CreatedAt)
                   .HasDefaultValueSql("GETUTCDATE()");

            builder.HasIndex(x => new { x.BoardId, x.UserId })
                .IsUnique();
        }
    }
}
