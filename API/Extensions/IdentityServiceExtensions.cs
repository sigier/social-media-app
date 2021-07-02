using Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using Persistence;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection  IdentityServices(
            this IServiceCollection services, 
            IConfiguration configuration
        ) 
        {
            services.AddIdentityCore<AppUser>(options => {

                options.Password.RequireNonAlphanumeric = false;
            })
            .AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<AppUser>>();
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["appsecret"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters =
                        new TokenValidationParameters
                        {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = key,
                            ValidateIssuer = false,
                            ValidateAudience = false
                        };
                });

            
            services.AddAuthorization(options => {
                
                options.AddPolicy("IsActivityHost", policy =>{

                    policy.Requirements.Add( new IsHostRequirement());
                });
            });

            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            
            services.AddScoped<TokenService>();

            return services;
        }
    }
}