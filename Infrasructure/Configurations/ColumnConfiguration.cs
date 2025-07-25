using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrasructure.Configurations
{
    public class ColumnConfiguration : IEntityTypeConfiguration<Column>
    {
        public void Configure(EntityTypeBuilder<Column> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Title)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasMany(b => b.TaskItems)
                .WithOne(c => c.Column)
                .HasForeignKey(c => c.ColumnId);

            builder.Property(c => c.Position)
                .IsRequired();
        }
    }
}
