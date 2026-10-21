using Microsoft.EntityFrameworkCore;

public class AppDataContext : DbContext
{
    public DbSet<Conquista> Conquistas { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=LevelUp.db");
    }
}