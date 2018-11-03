using Microsoft.EntityFrameworkCore.Migrations;

namespace WeddingInfo.Domain.Migrations
{
    public partial class ordering : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Sections",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Registries",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Lodgings",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Locations",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Events",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "Sections");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Registries");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Lodgings");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Events");
        }
    }
}
