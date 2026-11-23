var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();
 
// CORS: permite que o front-end React (porta 5173) converse com esta API
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFront", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});
 
var app = builder.Build();
 
app.UseCors("PermitirFront");
 
app.MapGet("/", () => "API LEVEL UP");
 
app.MapEstudanteEndpoints();
app.MapMissaoEndpoints();
app.MapConclusaoEndpoints();
app.MapConquistaEndpoints();
app.MapRankingEndpoints();
app.MapRelatorioEndpoints();
 
app.Run();
