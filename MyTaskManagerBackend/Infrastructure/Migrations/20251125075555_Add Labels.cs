using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLabels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskLabels",
                table: "TaskLabels");

            migrationBuilder.DropIndex(
                name: "IX_TaskLabels_TaskItemId",
                table: "TaskLabels");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "TaskLabels");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "TaskLabels");

            migrationBuilder.RenameColumn(
                name: "Color",
                table: "TaskLabels",
                newName: "LabelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskLabels",
                table: "TaskLabels",
                columns: new[] { "TaskItemId", "LabelId" });

            migrationBuilder.CreateTable(
                name: "Labels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Color = table.Column<string>(type: "TEXT", nullable: false),
                    BoardId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Labels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Labels_Boards_BoardId",
                        column: x => x.BoardId,
                        principalTable: "Boards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TaskLabels_LabelId",
                table: "TaskLabels",
                column: "LabelId");

            migrationBuilder.CreateIndex(
                name: "IX_Labels_BoardId",
                table: "Labels",
                column: "BoardId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskLabels_Labels_LabelId",
                table: "TaskLabels",
                column: "LabelId",
                principalTable: "Labels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskLabels_Labels_LabelId",
                table: "TaskLabels");

            migrationBuilder.DropTable(
                name: "Labels");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskLabels",
                table: "TaskLabels");

            migrationBuilder.DropIndex(
                name: "IX_TaskLabels_LabelId",
                table: "TaskLabels");

            migrationBuilder.RenameColumn(
                name: "LabelId",
                table: "TaskLabels",
                newName: "Color");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "TaskLabels",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "TaskLabels",
                type: "TEXT",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskLabels",
                table: "TaskLabels",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_TaskLabels_TaskItemId",
                table: "TaskLabels",
                column: "TaskItemId");
        }
    }
}
