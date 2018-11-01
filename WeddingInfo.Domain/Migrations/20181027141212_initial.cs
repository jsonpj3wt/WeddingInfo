using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WeddingInfo.Domain.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Occurance = table.Column<DateTime>(nullable: false),
                    Address = table.Column<string>(nullable: true),
                    EventType = table.Column<int>(nullable: false),
                    EventDifficulty = table.Column<int>(nullable: false),
                    IsWeddingEvent = table.Column<bool>(nullable: false),
                    IsWeddingPartyEvent = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HomeComponents",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeComponents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    Website = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lodgings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    Website = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lodgings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Parallaxes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ImgUrl = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parallaxes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Registries",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ImageSrc = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Website = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Registries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IsAdmin = table.Column<bool>(nullable: false),
                    Password = table.Column<string>(maxLength: 516, nullable: true),
                    FirstName = table.Column<string>(maxLength: 36, nullable: true),
                    LastName = table.Column<string>(maxLength: 36, nullable: true),
                    MiddleName = table.Column<string>(maxLength: 36, nullable: true),
                    Address = table.Column<string>(maxLength: 100, nullable: true),
                    PhoneNumber = table.Column<string>(maxLength: 36, nullable: true),
                    Email = table.Column<string>(maxLength: 100, nullable: true),
                    IsAttending = table.Column<bool>(nullable: false),
                    IsGuest = table.Column<bool>(nullable: false),
                    Guests = table.Column<int>(nullable: false),
                    Icon = table.Column<string>(maxLength: 300, nullable: true),
                    Category = table.Column<string>(maxLength: 36, nullable: true),
                    Household = table.Column<string>(maxLength: 36, nullable: true),
                    SentSaveTheDate = table.Column<bool>(nullable: false),
                    Rehearsal = table.Column<bool>(nullable: false),
                    Dietary = table.Column<string>(maxLength: 200, nullable: true),
                    Gift = table.Column<string>(maxLength: 200, nullable: true),
                    SentThankYou = table.Column<bool>(nullable: false),
                    Title = table.Column<string>(maxLength: 100, nullable: true),
                    EventId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Medias",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Path = table.Column<string>(nullable: true),
                    MediaType = table.Column<int>(nullable: false),
                    EventId = table.Column<int>(nullable: true),
                    EventId1 = table.Column<int>(nullable: true),
                    LocationId = table.Column<int>(nullable: true),
                    LocationId1 = table.Column<int>(nullable: true),
                    LodgingId = table.Column<int>(nullable: true),
                    LodgingId1 = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Medias_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Medias_Events_EventId1",
                        column: x => x.EventId1,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Medias_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Medias_Locations_LocationId1",
                        column: x => x.LocationId1,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Medias_Lodgings_LodgingId",
                        column: x => x.LodgingId,
                        principalTable: "Lodgings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Medias_Lodgings_LodgingId1",
                        column: x => x.LodgingId1,
                        principalTable: "Lodgings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Sections",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Header = table.Column<string>(nullable: true),
                    Text = table.Column<string>(nullable: true),
                    TopParallaxId = table.Column<int>(nullable: true),
                    BottomParallaxId = table.Column<int>(nullable: true),
                    HomeComponentId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sections_Parallaxes_BottomParallaxId",
                        column: x => x.BottomParallaxId,
                        principalTable: "Parallaxes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Sections_HomeComponents_HomeComponentId",
                        column: x => x.HomeComponentId,
                        principalTable: "HomeComponents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Sections_Parallaxes_TopParallaxId",
                        column: x => x.TopParallaxId,
                        principalTable: "Parallaxes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "HomeComponents",
                columns: new[] { "Id", "Title" },
                values: new object[] { 1, "Default Title" });

            migrationBuilder.CreateIndex(
                name: "IX_Medias_EventId",
                table: "Medias",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Medias_EventId1",
                table: "Medias",
                column: "EventId1");

            migrationBuilder.CreateIndex(
                name: "IX_Medias_LocationId",
                table: "Medias",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Medias_LocationId1",
                table: "Medias",
                column: "LocationId1");

            migrationBuilder.CreateIndex(
                name: "IX_Medias_LodgingId",
                table: "Medias",
                column: "LodgingId");

            migrationBuilder.CreateIndex(
                name: "IX_Medias_LodgingId1",
                table: "Medias",
                column: "LodgingId1");

            migrationBuilder.CreateIndex(
                name: "IX_Sections_BottomParallaxId",
                table: "Sections",
                column: "BottomParallaxId");

            migrationBuilder.CreateIndex(
                name: "IX_Sections_HomeComponentId",
                table: "Sections",
                column: "HomeComponentId");

            migrationBuilder.CreateIndex(
                name: "IX_Sections_TopParallaxId",
                table: "Sections",
                column: "TopParallaxId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_EventId",
                table: "Users",
                column: "EventId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Medias");

            migrationBuilder.DropTable(
                name: "Registries");

            migrationBuilder.DropTable(
                name: "Sections");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropTable(
                name: "Lodgings");

            migrationBuilder.DropTable(
                name: "Parallaxes");

            migrationBuilder.DropTable(
                name: "HomeComponents");

            migrationBuilder.DropTable(
                name: "Events");
        }
    }
}
