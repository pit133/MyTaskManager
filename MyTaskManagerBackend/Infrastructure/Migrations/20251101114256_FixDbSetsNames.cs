using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixDbSetsNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Board_User_UserId",
                table: "Board");

            migrationBuilder.DropForeignKey(
                name: "FK_BoardMember_Board_BoardId",
                table: "BoardMember");

            migrationBuilder.DropForeignKey(
                name: "FK_BoardMember_User_UserId",
                table: "BoardMember");

            migrationBuilder.DropForeignKey(
                name: "FK_Column_Board_BoardId",
                table: "Column");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskCheckList_TaskItem_TaskItemId",
                table: "TaskCheckList");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskCheckListItem_TaskCheckList_TaskCheckListId",
                table: "TaskCheckListItem");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskItem_Column_ColumnId",
                table: "TaskItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User",
                table: "User");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskItem",
                table: "TaskItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskCheckListItem",
                table: "TaskCheckListItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskCheckList",
                table: "TaskCheckList");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Column",
                table: "Column");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BoardMember",
                table: "BoardMember");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Board",
                table: "Board");

            migrationBuilder.RenameTable(
                name: "User",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "TaskItem",
                newName: "TaskItems");

            migrationBuilder.RenameTable(
                name: "TaskCheckListItem",
                newName: "TaskCheckListItems");

            migrationBuilder.RenameTable(
                name: "TaskCheckList",
                newName: "TaskCheckLists");

            migrationBuilder.RenameTable(
                name: "Column",
                newName: "Columns");

            migrationBuilder.RenameTable(
                name: "BoardMember",
                newName: "BoardMembers");

            migrationBuilder.RenameTable(
                name: "Board",
                newName: "Boards");

            migrationBuilder.RenameIndex(
                name: "IX_TaskItem_ColumnId",
                table: "TaskItems",
                newName: "IX_TaskItems_ColumnId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskCheckListItem_TaskCheckListId",
                table: "TaskCheckListItems",
                newName: "IX_TaskCheckListItems_TaskCheckListId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskCheckList_TaskItemId",
                table: "TaskCheckLists",
                newName: "IX_TaskCheckLists_TaskItemId");

            migrationBuilder.RenameIndex(
                name: "IX_Column_BoardId",
                table: "Columns",
                newName: "IX_Columns_BoardId");

            migrationBuilder.RenameIndex(
                name: "IX_BoardMember_UserId",
                table: "BoardMembers",
                newName: "IX_BoardMembers_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_BoardMember_BoardId_UserId",
                table: "BoardMembers",
                newName: "IX_BoardMembers_BoardId_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Board_UserId",
                table: "Boards",
                newName: "IX_Boards_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskItems",
                table: "TaskItems",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskCheckListItems",
                table: "TaskCheckListItems",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskCheckLists",
                table: "TaskCheckLists",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Columns",
                table: "Columns",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BoardMembers",
                table: "BoardMembers",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Boards",
                table: "Boards",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BoardMembers_Boards_BoardId",
                table: "BoardMembers",
                column: "BoardId",
                principalTable: "Boards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_BoardMembers_Users_UserId",
                table: "BoardMembers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Boards_Users_UserId",
                table: "Boards",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Columns_Boards_BoardId",
                table: "Columns",
                column: "BoardId",
                principalTable: "Boards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskCheckListItems_TaskCheckLists_TaskCheckListId",
                table: "TaskCheckListItems",
                column: "TaskCheckListId",
                principalTable: "TaskCheckLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskCheckLists_TaskItems_TaskItemId",
                table: "TaskCheckLists",
                column: "TaskItemId",
                principalTable: "TaskItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItems_Columns_ColumnId",
                table: "TaskItems",
                column: "ColumnId",
                principalTable: "Columns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BoardMembers_Boards_BoardId",
                table: "BoardMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_BoardMembers_Users_UserId",
                table: "BoardMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_Boards_Users_UserId",
                table: "Boards");

            migrationBuilder.DropForeignKey(
                name: "FK_Columns_Boards_BoardId",
                table: "Columns");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskCheckListItems_TaskCheckLists_TaskCheckListId",
                table: "TaskCheckListItems");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskCheckLists_TaskItems_TaskItemId",
                table: "TaskCheckLists");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskItems_Columns_ColumnId",
                table: "TaskItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskItems",
                table: "TaskItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskCheckLists",
                table: "TaskCheckLists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskCheckListItems",
                table: "TaskCheckListItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Columns",
                table: "Columns");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Boards",
                table: "Boards");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BoardMembers",
                table: "BoardMembers");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "User");

            migrationBuilder.RenameTable(
                name: "TaskItems",
                newName: "TaskItem");

            migrationBuilder.RenameTable(
                name: "TaskCheckLists",
                newName: "TaskCheckList");

            migrationBuilder.RenameTable(
                name: "TaskCheckListItems",
                newName: "TaskCheckListItem");

            migrationBuilder.RenameTable(
                name: "Columns",
                newName: "Column");

            migrationBuilder.RenameTable(
                name: "Boards",
                newName: "Board");

            migrationBuilder.RenameTable(
                name: "BoardMembers",
                newName: "BoardMember");

            migrationBuilder.RenameIndex(
                name: "IX_TaskItems_ColumnId",
                table: "TaskItem",
                newName: "IX_TaskItem_ColumnId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskCheckLists_TaskItemId",
                table: "TaskCheckList",
                newName: "IX_TaskCheckList_TaskItemId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskCheckListItems_TaskCheckListId",
                table: "TaskCheckListItem",
                newName: "IX_TaskCheckListItem_TaskCheckListId");

            migrationBuilder.RenameIndex(
                name: "IX_Columns_BoardId",
                table: "Column",
                newName: "IX_Column_BoardId");

            migrationBuilder.RenameIndex(
                name: "IX_Boards_UserId",
                table: "Board",
                newName: "IX_Board_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_BoardMembers_UserId",
                table: "BoardMember",
                newName: "IX_BoardMember_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_BoardMembers_BoardId_UserId",
                table: "BoardMember",
                newName: "IX_BoardMember_BoardId_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User",
                table: "User",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskItem",
                table: "TaskItem",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskCheckList",
                table: "TaskCheckList",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskCheckListItem",
                table: "TaskCheckListItem",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Column",
                table: "Column",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Board",
                table: "Board",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BoardMember",
                table: "BoardMember",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Board_User_UserId",
                table: "Board",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_BoardMember_Board_BoardId",
                table: "BoardMember",
                column: "BoardId",
                principalTable: "Board",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_BoardMember_User_UserId",
                table: "BoardMember",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Column_Board_BoardId",
                table: "Column",
                column: "BoardId",
                principalTable: "Board",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskCheckList_TaskItem_TaskItemId",
                table: "TaskCheckList",
                column: "TaskItemId",
                principalTable: "TaskItem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskCheckListItem_TaskCheckList_TaskCheckListId",
                table: "TaskCheckListItem",
                column: "TaskCheckListId",
                principalTable: "TaskCheckList",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItem_Column_ColumnId",
                table: "TaskItem",
                column: "ColumnId",
                principalTable: "Column",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
