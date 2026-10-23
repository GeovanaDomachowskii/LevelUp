using Microsoft.EntityFrameworkCore;
 
public class AppDataContext : DbContext
{
    public DbSet<Conquista> Conquistas { get; set; }
    public DbSet<Estudante> Estudantes { get; set; }
    public DbSet<Missao> Missoes { get; set; }
    public DbSet<Conclusao> Conclusoes { get; set; }
 
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=LevelUp.db");
    }
 
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Conclusao>()
            .HasOne(c => c.Estudante).WithMany()
            .HasForeignKey(c => c.EstudanteId)
            .OnDelete(DeleteBehavior.Restrict);
 
        modelBuilder.Entity<Conclusao>()
            .HasOne(c => c.Missao).WithMany()
            .HasForeignKey(c => c.MissaoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}