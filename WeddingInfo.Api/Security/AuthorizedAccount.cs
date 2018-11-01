using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WeddingInfo.Api.Security
{
    public class AccountRequirement : IAuthorizationRequirement { }

    public class AccountHandler : AuthorizationHandler<AccountRequirement>
    {
        private readonly IHttpContextAccessor _accessor;

        public AccountHandler(IHttpContextAccessor accessor)
        {
            _accessor = accessor;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            AccountRequirement requirement)
        {
            string token = string.Empty;
            ClaimsIdentity identity = null;
            string authorization = ((AuthorizationFilterContext)context.Resource).HttpContext.Request.Headers["Authorization"];

            if (authorization.StartsWith("JWT ", StringComparison.OrdinalIgnoreCase))
            {
                token = authorization.Substring("JWT ".Length).Trim();
            }

            if (string.IsNullOrEmpty(Utilities.ValidateToken(token, out identity)))
            {
                context.Succeed(requirement);
                return;
            }
        }
    }
}