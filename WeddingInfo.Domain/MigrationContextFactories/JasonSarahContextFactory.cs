using System;
using WeddingInfo.Domain.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace WeddingInfo.Domain.MigrationContextFactories
{
	public class JasonSarahContextFactory: IDesignTimeDbContextFactory<JasonSarahContext>
	{
		private readonly string _connStr;
		private const string CONNECTION_STRING_NAME = "JasonSarahContext";
		public JasonSarahContextFactory() {
                var configuration = new ConfigurationBuilder()
                    .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                    .AddJsonFile("appsettings.json")
                    .Build();
			_connStr = configuration.GetConnectionString(CONNECTION_STRING_NAME);
		}

		public JasonSarahContext Create()
		{         
			if (String.IsNullOrWhiteSpace(_connStr) == true)
			{
				throw new InvalidOperationException(
					"Could not find a connection string named 'CsmsConnectionString'.");
			}
			else
			{
				return Create(_connStr);
			}
		}

		public JasonSarahContext CreateDbContext(string[] args)
		{
			//TODO:  According to EF Core website, this is not used.         

			if (String.IsNullOrWhiteSpace(_connStr) == true)
			{
				throw new InvalidOperationException(
					"Could not find a connection string named 'CsmsConnectionString'.");
			}
			else
			{
				return Create(_connStr);
			}
		}

		private JasonSarahContext Create(string connectionString)
		{
			if (string.IsNullOrEmpty(connectionString))
				throw new ArgumentException(
					$"{nameof(connectionString)} is null or empty.",
					nameof(connectionString));

			var optionsBuilder =
				new DbContextOptionsBuilder<DbContext>();

			optionsBuilder.UseMySql(connectionString);

			return new JasonSarahContext(optionsBuilder.Options);
		}
	}
}
