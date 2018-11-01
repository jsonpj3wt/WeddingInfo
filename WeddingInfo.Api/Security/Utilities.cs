using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace WeddingInfo.Api.Security
{
    public static class Utilities
    {
        public static string ValidateToken(string token, out ClaimsIdentity identity)
        {
            string message = null;

            try
            {
                //TODO:  Should access app config or something else here...
				var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("jasonSarah_secretGener@te!"));

                TokenValidationParameters validationParameters = new TokenValidationParameters()
                {
                    RequireExpirationTime = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    IssuerSigningKey = signingKey
                };

                JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
                SecurityToken securityToken;
                ClaimsPrincipal principal = tokenHandler.ValidateToken(token, validationParameters, out securityToken);
                tokenHandler.ReadJwtToken(token);

                identity = principal.Identity as ClaimsIdentity;

                if (identity == null || !identity.IsAuthenticated) {
                    message = "Access is denied.";
                }
            }
            catch (Exception exp)
            {
                identity = null;
                message = "Your session has expired.";
            }

            return message;
        }
    }
}
