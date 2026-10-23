public class Missao
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public int Xp { get; set; }
    public string Dificuldade { get; set; } = "Facil";
    public bool MissaoDoDia { get; set; } = false;
}
