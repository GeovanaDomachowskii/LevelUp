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
        app.MapGet("/api/conquista/buscar/{nome}",
         ([FromRoute] string nome, [FromServices] AppDataContext ctx) =>
     {
         var encontradas = ctx.Conquistas
             .Where(c => c.Nome.Contains(nome))
             .OrderBy(c => c.Nome)
             .ToList();

         if (encontradas.Count == 0)
             return Results.NotFound("Nenhuma conquista encontrada!");

         return Results.Ok(encontradas);
     });

        app.MapPut("/api/conquista/alterar/{id}",
            ([FromRoute] string id, [FromBody] Conquista dados, [FromServices] AppDataContext ctx) =>
        {
            var conquista = ctx.Conquistas.Find(id);
            if (conquista is null)
                return Results.NotFound("Conquista não encontrada!");

            if (string.IsNullOrWhiteSpace(dados.Nome))
                return Results.BadRequest("O nome não pode ser vazio!");

            string[] tiposValidos = { "xp", "streak", "missoes" };
            if (!tiposValidos.Contains(dados.Tipo))
                return Results.BadRequest("Tipo inválido! Use xp, streak ou missoes.");

            if (dados.ValorMinimo <= 0)
                return Results.BadRequest("O valor mínimo deve ser maior que zero!");

            if (ctx.Conquistas.Any(c => c.Nome == dados.Nome && c.Id != id))
                return Results.BadRequest("Já existe outra conquista com esse nome!");

            conquista.Nome = dados.Nome;
            conquista.Descricao = dados.Descricao;
            conquista.Tipo = dados.Tipo;
            conquista.ValorMinimo = dados.ValorMinimo;
            ctx.SaveChanges();
            return Results.Ok(conquista);
        });

        app.MapDelete("/api/conquista/remover/{id}",
            ([FromRoute] string id, [FromServices] AppDataContext ctx) =>
        {
            var conquista = ctx.Conquistas.Find(id);
            if (conquista is null)
                return Results.NotFound("Conquista não encontrada!");

            ctx.Conquistas.Remove(conquista);
            ctx.SaveChanges();
            return Results.Ok("Conquista removida com sucesso!");
        });
    }
}