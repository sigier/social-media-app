using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Application.Activities;
using API.Extensions;
using FluentValidation.AspNetCore;
using API.Middleware;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using API.SignalR;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;

        public Startup(IConfiguration config)
        {
            _config = config;
        }

         

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers(options =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                
                options.Filters.Add(new AuthorizeFilter(policy));
            }
            ).AddFluentValidation(config => {

              config.RegisterValidatorsFromAssemblyContaining<Create>();
            });
            
            services.AddAppServices(_config);

            services.IdentityServices(_config);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseXContentTypeOptions();

            app.UseReferrerPolicy(options => options.NoReferrer());

            app.UseXXssProtection(options => options.EnabledWithBlockMode());

            app.UseXfo(options => options.Deny());

            app.UseCsp(options =>
                options.BlockAllMixedContent()
                       .StyleSources(s => s.Self()
                            .CustomSources("https://fonts​.googleapis.com"))
                       .FontSources(f => f.Self()
                            .CustomSources("https://fonts.gstatic.com","data:"))
                       .FormActions(a => a.Self())
                       .FrameAncestors(fa => fa.Self())
                       .ImageSources(i => i.Self()
                            .CustomSources("https://res.cloudinary.com"))
                       .ScriptSources(ss => ss.Self()
                            .CustomSources("sha256-wr+am31qjKs1OBAgMMHE4L0PlnAs5I/exw/ZQKECfFs="))
            );


            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            
            } else {

                app.Use(async (context, next) => {
                    context.Response.Headers
                    .Add("Strict-Transport-Security", "max-age=31536000");

                    await next.Invoke();
                });
            }

            
            app.UseRouting();

            app.UseDefaultFiles();

            app.UseStaticFiles();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();

                endpoints.MapHub<ChatHub>("/chat");

                endpoints.MapFallbackToController("Index","Fallback");
                
            });
        }
    }
}
