using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskCheckListAndTaskCheckListItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TaskCheckList",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TaskItemId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskCheckList", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskCheckList_TaskItem_TaskItemId",
                        column: x => x.TaskItemId,
                        principalTable: "TaskItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TaskCheckListItem",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    CheckListId = table.Column<Guid>(type: "TEXT", nullable: false),
                    TaskCheckListId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Position = table.Column<int>(type: "INTEGER", nullable: false),
                    IsComplited = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskCheckListItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskCheckListItem_TaskCheckList_TaskCheckListId",
                        column: x => x.TaskCheckListId,
                        principalTable: "TaskCheckList",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TaskCheckList_TaskItemId",
                table: "TaskCheckList",
                column: "TaskItemId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskCheckListItem_TaskCheckListId",
                table: "TaskCheckListItem",
                column: "TaskCheckListId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TaskCheckListItem");

            migrationBuilder.DropTable(
                name: "TaskCheckList");
        }
    }
}
