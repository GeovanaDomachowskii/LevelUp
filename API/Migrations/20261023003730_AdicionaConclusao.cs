using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaConclusao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Conclusoes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    EstudanteId = table.Column<string>(type: "TEXT", nullable: false),
                    MissaoId = table.Column<string>(type: "TEXT", nullable: false),
                    XpGanho = table.Column<int>(type: "INTEGER", nullable: false),
                    DataConclusao = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conclusoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Conclusoes_Estudantes_EstudanteId",
                        column: x => x.EstudanteId,
                        principalTable: "Estudantes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Conclusoes_Missoes_MissaoId",
                        column: x => x.MissaoId,
                        principalTable: "Missoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Conclusoes_EstudanteId",
                table: "Conclusoes",
                column: "EstudanteId");

            migrationBuilder.CreateIndex(
                name: "IX_Conclusoes_MissaoId",
                table: "Conclusoes",
                column: "MissaoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Conclusoes");
        }
    }
}
