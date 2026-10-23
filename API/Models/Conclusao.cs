public class Conclusao
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string EstudanteId { get; set; } = string.Empty; // FK
    public Estudante? Estudante { get; set; }
    public string MissaoId { get; set; } = string.Empty;    // FK
    public Missao? Missao { get; set; }
    public int XpGanho { get; set; }
    public DateTime DataConclusao { get; set; } = DateTime.Now;
}
