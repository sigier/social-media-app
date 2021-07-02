using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _accessor;

        public UserAccessor(IHttpContextAccessor accessor)
        {
            _accessor = accessor;
        }

        public string GetUsername()
        {
            return _accessor
                .HttpContext
                .User
                .FindFirstValue(ClaimTypes.Name);
        }
    }
}