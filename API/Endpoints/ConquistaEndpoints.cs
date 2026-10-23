using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class ConquistaEndpoints
{
    public static void MapConquistaEndpoints(this WebApplication app)
    {
        app.MapGet("/api/conquista/listar", ([FromServices] AppDataContext ctx) =>
{
    return Results.Ok(ctx.Conquistas.OrderBy(c => c.Nome).ToList());
});

app.MapPost("/api/conquista/cadastrar",
    ([FromBody] Conquista conquista, [FromServices] AppDataContext ctx) =>
{
    if (string.IsNullOrWhiteSpace(conquista.Nome))
        return Results.BadRequest("O nome não pode ser vazio!");

    string[] tiposValidos = { "xp", "streak", "missoes" };
    if (!tiposValidos.Contains(conquista.Tipo))
        return Results.BadRequest("Tipo inválido! Use xp, streak ou missoes.");

    if (conquista.ValorMinimo <= 0)
        return Results.BadRequest("O valor mínimo deve ser maior que zero!");

    if (ctx.Conquistas.Any(c => c.Nome == conquista.Nome))
        return Results.BadRequest("Já existe uma conquista com esse nome!");

    ctx.Conquistas.Add(conquista);
    ctx.SaveChanges();
    return Results.Created("", conquista);
});
    }
}