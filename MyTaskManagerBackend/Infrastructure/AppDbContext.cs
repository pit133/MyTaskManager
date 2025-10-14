using Domain.Entities;
using Infrastructure.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> User { get; set; }
        public DbSet<Board> Board { get; set; }
        public DbSet<Column> Column { get; set; }
        public DbSet<TaskItem> TaskItem { get; set; }
        public DbSet<TaskCheckList> TaskCheckList { get; set; }
        public DbSet<TaskCheckListItem> TaskCheckListItem { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new BoardConfiguration());
            modelBuilder.ApplyConfiguration(new ColumnConfiguration());
            modelBuilder.ApplyConfiguration(new TaskItemConfiguration());
            modelBuilder.ApplyConfiguration(new TaskCheckListItemConfiguration());
        }
        
    }
}
