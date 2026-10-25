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

        app.MapGet("/api/missao/listar", ([FromServices] AppDataContext ctx) =>
        {
            return Results.Ok(ctx.Missoes.OrderBy(m => m.Titulo).ToList());
        });
        
        app.MapGet("/api/missao/listar/dificuldade/{d}",
            ([FromRoute] string d, [FromServices] AppDataContext ctx) =>
        {
            string[] validas = { "Facil", "Media", "Dificil" };
            if (!validas.Contains(d))
                return Results.BadRequest("Dificuldade inválida! Use Facil, Media ou Dificil.");
        
            var lista = ctx.Missoes
                .Where(m => m.Dificuldade == d)
                .OrderBy(m => m.Titulo)
                .ToList();
            return Results.Ok(lista);
        });

        app.MapGet("/api/missao/buscar/{titulo}",
            ([FromRoute] string titulo, [FromServices] AppDataContext ctx) =>
        {
            var encontradas = ctx.Missoes
                .Where(m => m.Titulo.Contains(titulo))
                .OrderBy(m => m.Titulo)
                .ToList();
        
            if (encontradas.Count == 0)
                return Results.NotFound("Nenhuma missão encontrada!");
        
            return Results.Ok(encontradas);
        });
        
        app.MapPut("/api/missao/alterar/{id}",
            ([FromRoute] string id, [FromBody] Missao dados, [FromServices] AppDataContext ctx) =>
        {
            var missao = ctx.Missoes.Find(id);
            if (missao is null)
                return Results.NotFound("Missão não encontrada!");
        
            if (string.IsNullOrWhiteSpace(dados.Titulo))
                return Results.BadRequest("O título não pode ser vazio!");
            if (dados.Xp <= 0)
                return Results.BadRequest("O XP deve ser maior que zero!");
        
            string[] validas = { "Facil", "Media", "Dificil" };
            if (!validas.Contains(dados.Dificuldade))
                return Results.BadRequest("Dificuldade inválida! Use Facil, Media ou Dificil.");
        
            if (ctx.Missoes.Any(m => m.Titulo == dados.Titulo && m.Id != id))
                return Results.BadRequest("Já existe outra missão com esse título!");
        
            missao.Titulo = dados.Titulo;
            missao.Descricao = dados.Descricao;
            missao.Xp = dados.Xp;
            missao.Dificuldade = dados.Dificuldade;
            // MissaoDoDia NÃO é alterada aqui: só o sorteio muda isso
            ctx.SaveChanges();
            return Results.Ok(missao);
        });

        app.MapPut("/api/missao/sortear-do-dia", ([FromServices] AppDataContext ctx) =>
        {
            var missoes = ctx.Missoes.ToList();
            if (missoes.Count == 0)
                return Results.BadRequest("Nenhuma missão cadastrada!");
        
            foreach (var m in missoes) m.MissaoDoDia = false; // limpa a anterior
        
            var sorteada = missoes[Random.Shared.Next(missoes.Count)];
            sorteada.MissaoDoDia = true;
            ctx.SaveChanges();
            return Results.Ok(sorteada);
        });
        
        app.MapGet("/api/missao/do-dia", ([FromServices] AppDataContext ctx) =>
        {
            var missao = ctx.Missoes.FirstOrDefault(m => m.MissaoDoDia);
            if (missao is null)
                return Results.NotFound("Nenhuma missão do dia sorteada!");
        
            return Results.Ok(missao);
        });

        app.MapDelete("/api/missao/remover/{id}",
            ([FromRoute] string id, [FromServices] AppDataContext ctx) =>
        {
            var missao = ctx.Missoes.Find(id);
            if (missao is null)
                return Results.NotFound("Missão não encontrada!");
        
            if (ctx.Conclusoes.Any(c => c.MissaoId == id))
                return Results.BadRequest("Não é possível remover: a missão já tem conclusões registradas!");
        
            ctx.Missoes.Remove(missao);
            ctx.SaveChanges();
            return Results.Ok("Missão removida com sucesso!");
        });
    }
}