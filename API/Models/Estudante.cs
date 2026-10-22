public class Estudante
{
 public string Id { get; set; } = Guid.NewGuid().ToString();
 public string Nome { get; set; } = string.Empty;
 public string Curso { get; set; } = string.Empty;
 public string Email { get; set; } = string.Empty;
 public int XpTotal { get; set; } = 0;
 public int Nivel { get; set; } = 1;
 public int StreakAtual { get; set; } = 0;
 public DateTime? UltimaAtividade { get; set; }
 public DateTime CriadoEm { get; set; } = DateTime.Now;
}