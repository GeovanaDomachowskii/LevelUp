using Microsoft.EntityFrameworkCore;

public class AppDataContext : DbContext
{
    public DbSet<Conquista> Conquistas { get; set; }
    public DbSet<Estudante> Estudantes { get; set; }
    public DbSet<Missao> Missoes { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=LevelUp.db");
    }
}