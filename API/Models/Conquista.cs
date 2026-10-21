public class Conquista
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Nome { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty; // "xp", "streak", "missoes"
    public int ValorMinimo { get; set; }
}