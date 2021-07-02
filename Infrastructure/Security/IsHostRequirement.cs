using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {

    }

    public class IsHostRequirementHandler :
         AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _accessor;

        public IsHostRequirementHandler(DataContext context,
                    IHttpContextAccessor accessor)
        {
            _context = context;
            _accessor = accessor;
        }


        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId==null)
            {
                return Task.CompletedTask;
            }

            var activityId = Guid
                    .Parse(_accessor.HttpContext?.Request.RouteValues
                    .SingleOrDefault(x => x.Key == "id").Value.ToString());

            var attendee = _context.ActivityAttendees
                    .AsNoTracking()
                    .SingleOrDefaultAsync(
                        x => x.AppUserId == userId &&
                        x.ActivityId==activityId
                        ).Result;  

            if (attendee==null)
            {
             return Task.CompletedTask;
            }  

            if (attendee.IsHost)
            {
                context.Succeed(requirement);
            } 

            return Task.CompletedTask;      
        }
    }
}