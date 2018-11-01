using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using WeddingInfo.Api.Security;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.Models;

namespace WeddingInfo.Api
{
    public partial class Startup
    {
        private void ConfigureAuth(IApplicationBuilder app)
        {
            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("TokenAuthentication:SecretKey").Value));

            app.UseCors("CorsPolicy");

            var tokenProviderOptions = new TokenProviderOptions
            {
                Path = Configuration.GetSection("TokenAuthentication:TokenPath").Value,
                Audience = Configuration.GetSection("TokenAuthentication:Audience").Value,
                Issuer = Configuration.GetSection("TokenAuthentication:Issuer").Value,
                SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256),
                IdentityResolver = GetIdentity
            };

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

            //app.UseJwtBearerAuthentication(new JwtBearerOptions
            //{
            //    AutomaticAuthenticate = true,
            //    AutomaticChallenge = true,
            //    TokenValidationParameters = tokenValidationParameters
            //});

            app.UseMiddleware<TokenProviderMiddleware>(Options.Create(tokenProviderOptions));
        }
        
        private Task<ClaimsIdentity> GetIdentity(string email, string password)
        {
			string userConnectionString = Configuration.GetConnectionString("JasonSarahContext");

			using(JasonSarahContext context = new JasonSarahContext())
            {
                string hash = string.Empty;
                byte[] data = System.Text.Encoding.ASCII.GetBytes(password);
                using (var sha512 = System.Security.Cryptography.SHA512.Create())
                {
                    data = sha512.ComputeHash(data);
                    hash = Encoding.ASCII.GetString(data);
                }
                
                User user = context.Users.FirstOrDefault(u => u.Email == email && u.Password == hash);
                if(user != null)
                {
                    ClaimsIdentity identity = new ClaimsIdentity();
                    
                    Claim userSpecificActions = new Claim("UserId", user.Id.ToString());
					Claim userRole = new Claim("Role", user.IsAdmin.ToString());

                    return Task.FromResult(new ClaimsIdentity(identity, new Claim[] { userSpecificActions, userRole }));
                    
                }

            }

            // Account doesn't exists
            return Task.FromResult<ClaimsIdentity>(null);
        }
    }
}
