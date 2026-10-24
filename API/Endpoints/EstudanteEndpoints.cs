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
        ctx.SaveChanges(); // sem esta linha nada é gravado no banco
        return Results.Created("", estudante);
    });
    }
}