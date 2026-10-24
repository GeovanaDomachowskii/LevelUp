using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class ConclusaoEndpoints
{
    public static void MapConclusaoEndpoints(this WebApplication app)
    {
        app.MapPost("/api/conclusao/registrar",
    ([FromBody] Conclusao c, [FromServices] AppDataContext ctx) =>
{
    var estudante = ctx.Estudantes.Find(c.EstudanteId);
    if (estudante is null)
        return Results.NotFound("Estudante não encontrado!");

    var missao = ctx.Missoes.Find(c.MissaoId);
    if (missao is null)
        return Results.NotFound("Missão não encontrada!");

    var hoje = DateTime.Today;
    if (ctx.Conclusoes.Any(x => x.EstudanteId == c.EstudanteId
        && x.MissaoId == c.MissaoId && x.DataConclusao >= hoje))
        return Results.BadRequest("Missão já concluída hoje!");

    c.XpGanho = missao.Xp;
    c.DataConclusao = DateTime.Now;
    estudante.XpTotal += c.XpGanho;

    ctx.Conclusoes.Add(c);
    ctx.SaveChanges();
    return Results.Created("", c);
});
    }
}