var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();
var app = builder.Build();

app.MapGet("/", () => "API LEVEL UP");

app.MapEstudanteEndpoints();
app.MapMissaoEndpoints();
app.MapConclusaoEndpoints();
app.MapConquistaEndpoints();
app.MapRankingEndpoints();
app.MapRelatorioEndpoints();

app.Run();