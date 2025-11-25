using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class LabelConfiguration : IEntityTypeConfiguration<Label>
    {        
        public void Configure(EntityTypeBuilder<Label> builder)
        {
            builder.HasKey(k => k.Id);

            builder.Property(k => k.Title)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(k => k.Color)
            .IsRequired();
        }
    }
}
