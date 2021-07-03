using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.Photos
{
public class SetMainPhoto
    {
        public class Command: IRequest<Result<Unit>> 
        {
           public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, 
                IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                        .Include(p => p.Photos)
                        .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
            
                if (user == null)
                {
                    return null;
                }

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null)
                {
                    return null;
                }

                if (photo.IsMain)
                {
                    return Result<Unit>.Fail("Can not delete main photo");
                }

                var currentMain = user.Photos.FirstOrDefault(c => c.IsMain);

                if (currentMain != null)
                {
                    currentMain.IsMain = false;
                }

                photo.IsMain = true;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                {
                    return Result<Unit>.Success(Unit.Value);
                }

                return Result<Unit>.Fail("Problem occured, while setting the main photo record");

            }
        }
    }

}