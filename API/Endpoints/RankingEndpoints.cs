using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class RankingEndpoints
{
    public static void MapRankingEndpoints(this WebApplication app)
    {
        
app.MapGet("/api/ranking/geral", ([FromServices] AppDataContext ctx) =>
{
    var top = ctx.Estudantes
        .OrderByDescending(e => e.XpTotal)
        .Take(10)
        .ToList()
        .Select(e => new
        {
            e.Nome,
            e.Curso,
            e.XpTotal,
            e.Nivel,
            Titulo = NivelHelper.ObterTitulo(e.Nivel)
        })
        .ToList();

    return Results.Ok(top);
});

app.MapGet("/api/ranking/semanal", ([FromServices] AppDataContext ctx) =>
{
    var inicio = DateTime.Today.AddDays(-7);
    var ranking = ctx.Conclusoes
        .Where(c => c.DataConclusao >= inicio)
        .GroupBy(c => new { c.EstudanteId, c.Estudante!.Nome })
        .Select(g => new { g.Key.Nome, XpSemana = g.Sum(c => c.XpGanho) })
        .OrderByDescending(x => x.XpSemana)
        .Take(10)
        .ToList();

    return Results.Ok(ranking);
});

app.MapGet("/api/ranking/curso/{curso}",
    ([FromRoute] string curso, [FromServices] AppDataContext ctx) =>
{
    var ranking = ctx.Estudantes
        .Where(e => e.Curso.ToLower() == curso.ToLower())
        .OrderByDescending(e => e.XpTotal)
        .Take(10)
        .Select(e => new { e.Nome, e.Curso, e.XpTotal, e.Nivel })
        .ToList();

    if (ranking.Count == 0)
        return Results.NotFound("Nenhum estudante encontrado nesse curso!");

    return Results.Ok(ranking);
});
  
    }
}