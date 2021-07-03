using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(
                x => x.HasKey(
                a => new {a.AppUserId, a.ActivityId}
                )
            ); 

            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.Activities)
                .HasForeignKey(f => f.AppUserId);

            builder.Entity<ActivityAttendee>()
                .HasOne(a => a.Activity)
                .WithMany(at => at.Attendees)
                .HasForeignKey(f => f.ActivityId);
        }

        public DbSet<Activity> Activities { get; set; }

        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
    
        public DbSet<Photo> Photos { get; set; }
    }
}