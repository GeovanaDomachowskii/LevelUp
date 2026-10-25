
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class ConclusaoEndpoints
{
    public static void MapConclusaoEndpoints(this WebApplication app)
    {
        // Registrar conclusão (Ju3, Ju4, Ju5 e Ju6)
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
                && x.MissaoId == c.MissaoId
                && x.DataConclusao >= hoje))
                return Results.BadRequest("Missão já concluída hoje!");

            // Streak (Ju4)
            if (estudante.UltimaAtividade is null)
            {
                estudante.StreakAtual = 1;
            }
            else
            {
                int dias = (hoje - estudante.UltimaAtividade.Value.Date).Days;

                if (dias == 1)
                    estudante.StreakAtual++;
                else if (dias > 1)
                    estudante.StreakAtual = 1;
            }

            estudante.UltimaAtividade = DateTime.Now;

            // XP com bônus (Ju5)
            double bonus = estudante.StreakAtual >= 7 ? 1.25
                : estudante.StreakAtual >= 3 ? 1.10 : 1.0;

            int dobro = missao.MissaoDoDia ? 2 : 1;

            c.XpGanho = (int)Math.Round(missao.Xp * bonus * dobro);
            c.DataConclusao = DateTime.Now;

            // Nível (Ju6)
            estudante.XpTotal += c.XpGanho;
            estudante.Nivel = NivelHelper.CalcularNivel(estudante.XpTotal);

            ctx.Conclusoes.Add(c);
            ctx.SaveChanges();

            return Results.Created("", new
            {
                Conclusao = c,
                estudante.XpTotal,
                estudante.Nivel,
                Titulo = NivelHelper.ObterTitulo(estudante.Nivel),
                estudante.StreakAtual
            });
        });

        // Histórico geral de conclusões (Ju7)
        app.MapGet("/api/conclusao/listar",
            ([FromServices] AppDataContext ctx) =>
        {
            var historico = ctx.Conclusoes
                .Include(c => c.Estudante)
                .Include(c => c.Missao)
                .OrderByDescending(c => c.DataConclusao)
                .ToList();

            return Results.Ok(historico);
        });

        // Histórico de conclusões de um estudante (Ju7)
        app.MapGet("/api/conclusao/estudante/{id}",
            ([FromRoute] string id, [FromServices] AppDataContext ctx) =>
        {
            var estudante = ctx.Estudantes.Find(id);
            if (estudante is null)
                return Results.NotFound("Estudante não encontrado!");

            var historico = ctx.Conclusoes
                .Where(c => c.EstudanteId == id)
                .Include(c => c.Estudante)
                .Include(c => c.Missao)
                .OrderByDescending(c => c.DataConclusao)
                .ToList();

            return Results.Ok(historico);
        });
    }
}
