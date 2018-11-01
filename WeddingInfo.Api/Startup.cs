using System;
using System.Text;
using AutoMapper;
using WeddingInfo.Domain;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.Queries.Events;
using WeddingInfo.Domain.Queries.Locations;
using WeddingInfo.Domain.Queries.Lodgings;
using WeddingInfo.Domain.Queries.Users;
using WeddingInfo.Api.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using WeddingInfo.Domain.Queries.Registries;
using WeddingInfo.Api.Settings;
using WeddingInfo.Domain.Queries.HomeComponents;
using Microsoft.Extensions.FileProviders;
using System.IO;

namespace WeddingInfo.Api
{
	public partial class Startup
    {
		public Startup(IHostingEnvironment env)
        {         
			var builder = new ConfigurationBuilder()
               .SetBasePath(env.ContentRootPath)
               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
               .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

			if (env.IsEnvironment("Development"))
            {
                // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            
			var config = new MapperConfiguration(
				cfg =>
				{
					cfg.AddProfile(new MappingProfile());
				}
			);

			var mapper = config.CreateMapper();

			// Add framework services.
            services.AddApplicationInsightsTelemetry(Configuration);

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    b => b.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

			var awsSettings = Configuration.GetSection("AWSCredentials");
			services.Configure<AwsSettings>(awsSettings);

			services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<IAuthorizationHandler, AccountHandler>();

			services.AddAuthorization(options =>
            {
                options.AddPolicy("Default",
                                  policy => policy.Requirements.Add(new AccountRequirement()));
            });

            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("TokenAuthentication:SecretKey").Value));

            var tokenValidationParameters = new TokenValidationParameters
            {
                // The signing key must match!
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey,
                // Validate the JWT Issuer (iss) claim
                ValidateIssuer = false,
                ValidIssuer = Configuration.GetSection("TokenAuthentication:Issuer").Value,
                // Validate the JWT Audience (aud) claim
                ValidateAudience = false,
                ValidAudience = Configuration.GetSection("TokenAuthentication:Audience").Value,
                // Validate the token expiry
                ValidateLifetime = true,
                // If you want to allow a certain amount of clock drift, set that here:
                ClockSkew = TimeSpan.Zero
            };

            services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = tokenValidationParameters;
            });

            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
            });

			services.AddDbContext<IJasonSarahContext, JasonSarahContext>(options =>
			{
				options.UseMySql(Configuration.GetConnectionString("JasonSarahContext"), mysqlOptions =>
				{
					mysqlOptions.EnableRetryOnFailure(10, TimeSpan.FromSeconds(30), null);
				});
			});

			services.AddSingleton(mapper);
			services.AddScoped<IEventQueries, EventQueries>();
			services.AddScoped<ILocationQueries, LocationQueries>();
			services.AddScoped<IUserQueries, UserQueries>();
			services.AddScoped<ILodgingQueries, LodgingQueries>();
			services.AddScoped<IRegistryQueries, RegistryQueries>();
			services.AddScoped<IHomeQueries, HomeQueries>();
			services.AddMediatR();
			services.AddAutoMapper();         
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
			ConfigureAuth(app);
			
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

				app.UseStaticFiles(); // For the wwwroot folder

                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(Directory.GetCurrentDirectory(), "Uploads")),
                    RequestPath = "/Uploads"
                });
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(Directory.GetCurrentDirectory(), "Home_Images")),
                    RequestPath = "/Home_Images"
                });
            }         

            app.UseCors("CorsPolicy");         

            app.UseMvc();
        }
    }
}
