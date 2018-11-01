using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Net;

namespace WeddingInfo.Api.Security
{
	public class ClaimRequirementAttribute : TypeFilterAttribute
    {
        public ClaimRequirementAttribute(string claimType, string claimValue) : base(typeof(ClaimRequirementFilter))
        {
            Arguments = new object[] { new Claim(claimType, claimValue) };
        }
    }

    public class ClaimRequirementFilter : IAsyncActionFilter
    {
        readonly Claim _claim;

        public ClaimRequirementFilter(Claim claim)
        {
            _claim = claim;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            string value = _claim.Value;

            string authorization = context.HttpContext.Request.Headers["Authorization"];

            if(string.IsNullOrEmpty(authorization))
            {
                context.Result = new UnauthorizedResult();
            }

            string token = string.Empty;
            ClaimsIdentity identity = null;

            if(authorization.StartsWith("JWT ", System.StringComparison.OrdinalIgnoreCase))
            {
                token = authorization.Substring("JWT ".Length).Trim();

            }

            string unauthorizedMessage = Utilities.ValidateToken(token, out identity);
            if (string.IsNullOrEmpty(unauthorizedMessage))
            {

                if (_claim.Value.StartsWith("{") && _claim.Value.EndsWith("}"))
                {
                    string stripped = _claim.Value.TrimStart('{').TrimEnd('}');
                    switch (stripped)
                    {
                        case "UserId":
                            value = identity.Claims.First(c => c.Type == "UserId").Value;
                            break;
                        case "Role":
                            value = identity.Claims.First(c => c.Type == "Role").Value;
                            break;
                    }

                }

                bool hasClaim = identity.Claims.Any(c => c.Type == _claim.Type && c.Value == value);
                if (!hasClaim)
                {
                    unauthorizedMessage = "Access is denied.";
                }
                else
                {
                    await next();
                }
            }

            if (!string.IsNullOrEmpty(unauthorizedMessage)) {
                context.Result = (
                    context.Controller as ControllerBase).StatusCode((int)HttpStatusCode.Unauthorized, new {
                        Message = unauthorizedMessage,
                        Success = unauthorizedMessage == "Your session has expired."
                    }
                );
            }
        }
    }
}
