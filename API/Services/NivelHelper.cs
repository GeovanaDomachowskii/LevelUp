public static class NivelHelper
{
    public static int CalcularNivel(int xp) => xp / 100 + 1;

    public static int XpParaProximoNivel(int xp) => 100 - (xp % 100);

    public static string ObterTitulo(int nivel) => nivel switch
    {
        <= 2 => "Calouro",
        <= 4 => "Estagiário",
        <= 7 => "Dev Jr",
        <= 10 => "Dev Pleno",
        _ => "Lenda"
    };
}