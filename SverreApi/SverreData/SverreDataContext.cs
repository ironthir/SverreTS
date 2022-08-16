using Microsoft.EntityFrameworkCore;


namespace SverreData
{
    public class SverreDataContext : DbContext
    {

       
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(@"Host=localhost;Username=postgres;Password=password;Database=postgres");
        }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseSerialColumns();
        }

        public DbSet<Sverre_Table_Experience> Experience { get; set; }
    }
}
