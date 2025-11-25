using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
    {
        public void Configure(EntityTypeBuilder<TaskItem> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title)
                   .IsRequired()
                   .HasMaxLength(150);

            builder.Property(x => x.Description)
                   .HasMaxLength(1000);

            builder.Property(x => x.Position)
                   .IsRequired();

            builder.Property(a => a.isArchived)
                   .HasDefaultValue(false);

            builder.HasMany(x => x.TaskLabels)
                .WithOne(x => x.TaskItem)
                .HasForeignKey(x => x.TaskItemId);
        }
    }
}
