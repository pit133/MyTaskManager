using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Configurations
{
    public class TaskCheckListItemConfiguration : IEntityTypeConfiguration<TaskCheckListItem>
    {
        public void Configure(EntityTypeBuilder<TaskCheckListItem> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(x => x.Position)
                .IsRequired();

            builder.Property(x => x.IsComplited)
                .HasDefaultValue(false);
        }
    }
}
