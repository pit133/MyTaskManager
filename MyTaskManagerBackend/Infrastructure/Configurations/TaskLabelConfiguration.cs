using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class TaskLabelConfiguration : IEntityTypeConfiguration<TaskLabel>
    {
        public void Configure(EntityTypeBuilder<TaskLabel> builder)
        {            
            builder.HasKey(tl => new { tl.TaskItemId, tl.LabelId });

            builder.HasOne(tl => tl.TaskItem)
                .WithMany(t => t.TaskLabels)
                .HasForeignKey(tl => tl.TaskItemId);

            builder.HasOne(tl => tl.Label)
                .WithMany(l => l.TaskLabels)
                .HasForeignKey(tl => tl.LabelId);
        }
    }
}
