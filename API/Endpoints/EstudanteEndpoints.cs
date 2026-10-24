using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class EstudanteEndpoints
{
    public static void MapEstudanteEndpoints(this WebApplication app)
    {
       app.MapPost("/api/estudante/cadastrar",
    ([FromBody] Estudante estudante, [FromServices] AppDataContext ctx) =>
    {
        if (string.IsNullOrWhiteSpace(estudante.Nome))
            return Results.BadRequest("O nome não pode ser vazio!");

        if (string.IsNullOrWhiteSpace(estudante.Email))
            return Results.BadRequest("O e-mail não pode ser vazio!");

        if (ctx.Estudantes.Any(e => e.Email == estudante.Email))
            return Results.BadRequest("Já existe um estudante com esse e-mail!");

        ctx.Estudantes.Add(estudante);
        ctx.SaveChanges(); 
        return Results.Created("", estudante);
    });

    app.MapGet("/api/estudante/listar", ([FromServices] AppDataContext ctx) =>
    {
        return Results.Ok(ctx.Estudantes.OrderBy(e => e.Nome).ToList());
    });

    app.MapGet("/api/estudante/buscar/{nome}",
        ([FromRoute] string nome, [FromServices] AppDataContext ctx) =>
    {
        var encontrados = ctx.Estudantes
            .Where(e => e.Nome.Contains(nome))
            .OrderBy(e => e.Nome)
            .ToList();

        if (encontrados.Count == 0)
            return Results.NotFound("Nenhum estudante encontrado!");

        return Results.Ok(encontrados);
    });

    app.MapPut("/api/estudante/alterar/{id}",
    ([FromRoute] string id, [FromBody] Estudante dados, [FromServices] AppDataContext ctx) =>
    {
        var estudante = ctx.Estudantes.Find(id);
        if (estudante is null)
            return Results.NotFound("Estudante não encontrado!");

        if (string.IsNullOrWhiteSpace(dados.Nome))
            return Results.BadRequest("O nome não pode ser vazio!");

        if (string.IsNullOrWhiteSpace(dados.Email))
            return Results.BadRequest("O e-mail não pode ser vazio!");

        if (ctx.Estudantes.Any(e => e.Email == dados.Email && e.Id != id))
            return Results.BadRequest("Já existe outro estudante com esse e-mail!");

        estudante.Nome = dados.Nome;
        estudante.Curso = dados.Curso;
        estudante.Email = dados.Email;
        ctx.SaveChanges();
        return Results.Ok(estudante);
    });  

    app.MapGet("/api/estudante/perfil/{id}",
    ([FromRoute] string id, [FromServices] AppDataContext ctx) =>
    {
    var estudante = ctx.Estudantes.Find(id);
    if (estudante is null)
        return Results.NotFound("Estudante não encontrado!");

    int nivel = NivelHelper.CalcularNivel(estudante.XpTotal);

    return Results.Ok(new
        {
            estudante.Nome,
            estudante.Curso,
            estudante.XpTotal,
            Nivel = nivel,
            Titulo = NivelHelper.ObterTitulo(nivel),
            XpParaProximoNivel = NivelHelper.XpParaProximoNivel(estudante.XpTotal),
            estudante.StreakAtual
        });
    }); 

    app.MapDelete("/api/estudante/remover/{id}",
    ([FromRoute] string id, [FromServices] AppDataContext ctx) =>
    {
        var estudante = ctx.Estudantes.Find(id);
        if (estudante is null)
            return Results.NotFound("Estudante não encontrado!");

        if (ctx.Conclusoes.Any(c => c.EstudanteId == id))
            return Results.BadRequest("Não é possível remover: o estudante possui conclusões registradas!");

        ctx.Estudantes.Remove(estudante);
        ctx.SaveChanges();
        return Results.Ok(estudante);
    });  
                                  
    }
}