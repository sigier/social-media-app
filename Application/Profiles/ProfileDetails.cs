using Domain;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Profiles
{
    public class ProfileDetails
    {        public class Query: IRequest<Result<Profile>> 
        {
           public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly DataContext _context;

            private readonly IMapper _mapper;


            public Handler(DataContext context,IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<Profile>> Handle(Query query, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                        .ProjectTo<Profile>(_mapper.ConfigurationProvider)
                        .SingleOrDefaultAsync(x => x.Username == query.Username);

                return Result<Profile>.Success(user);
            }
        }
    }
}