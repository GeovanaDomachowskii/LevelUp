using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class MissaoEndpoints
{
    public static void MapMissaoEndpoints(this WebApplication app)
    {
        app.MapPost("/api/missao/cadastrar",
            ([FromBody] Missao missao, [FromServices] AppDataContext ctx) =>
        {
            if (string.IsNullOrWhiteSpace(missao.Titulo))
                return Results.BadRequest("O título não pode ser vazio!");
            if (missao.Xp <= 0)
                return Results.BadRequest("O XP deve ser maior que zero!");
        
            string[] validas = { "Facil", "Media", "Dificil" };
            if (!validas.Contains(missao.Dificuldade))
                return Results.BadRequest("Dificuldade inválida! Use Facil, Media ou Dificil.");
        
            if (ctx.Missoes.Any(m => m.Titulo == missao.Titulo))
                return Results.BadRequest("Já existe uma missão com esse título!");
        
            missao.MissaoDoDia = false; 
            ctx.Missoes.Add(missao);
            ctx.SaveChanges(); 
            return Results.Created("", missao);
        });
    }
}