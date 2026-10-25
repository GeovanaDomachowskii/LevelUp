using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class RelatorioEndpoints
{
    public static void MapRelatorioEndpoints(this WebApplication app)
    {
        app.MapGet("/api/relatorio/resumo", ([FromServices] AppDataContext ctx) =>
        {
            var inicio = DateTime.Today.AddDays(-7);
        
            var top = ctx.Conclusoes
                .GroupBy(c => c.MissaoId)
                .Select(g => new { MissaoId = g.Key, Total = g.Count() })
                .OrderByDescending(x => x.Total)
                .FirstOrDefault();
        
            string? maisConcluida = null;
            if (top is not null)
                maisConcluida = ctx.Missoes.Find(top.MissaoId)?.Titulo;
        
            return Results.Ok(new
            {
                TotalEstudantes = ctx.Estudantes.Count(),
                TotalMissoes = ctx.Missoes.Count(),
                TotalConclusoes = ctx.Conclusoes.Count(),
                XpDistribuido = ctx.Conclusoes.Sum(c => (int?)c.XpGanho) ?? 0,
                ConclusoesNaSemana = ctx.Conclusoes.Count(c => c.DataConclusao >= inicio),
                MissaoMaisConcluida = maisConcluida
            });
        });
    }
}