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
    public class TaskCheckListConfiguration : IEntityTypeConfiguration<TaskCheckList>
    {
        public void Configure(EntityTypeBuilder<TaskCheckList> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(x => x.Position)
                .IsRequired();

            builder.HasMany(x => x.TaskCheckListItems)
                .WithOne(x => x.TaskCheckList)
                .HasForeignKey(x => x.TaskCheckListId);            
        }
    }
}
