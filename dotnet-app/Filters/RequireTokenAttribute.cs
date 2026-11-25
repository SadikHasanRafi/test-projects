using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BooksApi.Filters;

// Put [RequireToken] on an action to protect it.
// Needs the header "Authorization: Bearer <ApiToken>".
// (A simple shared token. Real apps use [Authorize] with JWT.)
public class RequireTokenAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var config = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        var expected = $"Bearer {config["ApiToken"]}";

        if (context.HttpContext.Request.Headers.Authorization.ToString() != expected)
        {
            // Setting a result stops the request here
            context.Result = new UnauthorizedObjectResult(new { error = "Unauthorized" });
        }
    }
}
