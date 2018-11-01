using System;
using WeddingInfo.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace WeddingInfo.Domain.Context
{
	public class JasonSarahContext : DbContext, IJasonSarahContext
    {
		private readonly string _connectionStringName;

        #region Public Constructors

		public JasonSarahContext()
        {
			_connectionStringName = "JasonSarahContext";
        }

		public JasonSarahContext(DbContextOptions<DbContext> options, string connectionStringName = "JasonSarahContext") : base(options)
        {
			_connectionStringName = connectionStringName;
            
        }

        #endregion Public Constructors

        #region Public Properties

        /// <summary>
        /// The database name.  Used specifically for any Initializers
        /// </summary>
        public string DatabaseName { get; private set; }

        //TODO:  Add DBSets here

        /// <summary>
        /// Database Table for Application Users
        /// </summary>
		public DbSet<User> Users { get; set; }

		public DbSet<Event> Events { get; set; }

		public DbSet<Location> Locations { get; set; }

		public DbSet<Lodging> Lodgings { get; set; }

		public DbSet<Media> Medias { get; set; }

		public DbSet<Registry> Registries { get; set; }

		public DbSet<HomeComponent> HomeComponents { get; set; }

		public DbSet<Section> Sections { get; set; }

		public DbSet<Parallax> Parallaxes { get; set; }

        #endregion Public Properties

        #region Public Methods

        /// <summary>
        /// Forces a SaveChanges on the database context
        /// </summary>
        public void Commit()
        {
            base.SaveChanges();
        }

        #endregion Public Methods

        #region Protected Methods

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
			modelBuilder
				.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

			modelBuilder
				.Entity<HomeComponent>()
				.HasData(new HomeComponent { Id = 1, Title = "Default Title" });

            base.OnModelCreating(modelBuilder);
        }

        //protected override void OnModelCreating(DbModelBuilder modelBuilder) {
        //    modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

        //    Database.SetInitializer(new CreateDatabaseIfNotExists<MGDbContext>());

        //    base.OnModelCreating(modelBuilder);
        //}

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
			if (!optionsBuilder.IsConfigured) {
				var configuration = new ConfigurationBuilder()
					.SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
					.AddJsonFile("appsettings.json")
					.Build();
				optionsBuilder.UseMySql(configuration.GetConnectionString(_connectionStringName));
			}
		}

        #endregion Protected Methods
    }
}
