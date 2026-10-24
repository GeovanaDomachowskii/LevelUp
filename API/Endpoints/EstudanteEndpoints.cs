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
    }
}