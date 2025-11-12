using Application.Services.Auth;
using Application.Services.Board;
using Application.Services.BoardMember;
using Application.Services.Column;
using Application.Services.TaskCheckList;
using Application.Services.TaskCheckListItemService;
using Application.Services.TaskItem;
using Application.Services.User;
using Domain.Entities;
using Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()   // Разрешить все источники
                          .AllowAnyMethod()   // Разрешить все HTTP-методы
                          .AllowAnyHeader();  // Разрешить все заголовки
                });
            });

            // Add services to the container.
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"),
                    x => x.MigrationsAssembly("Infrastructure"))
            );

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source = taskmanager.db"));

            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
            builder.Services.AddScoped<IBoardService, BoardService>();
            builder.Services.AddScoped<IColumnService, ColumnService>();
            builder.Services.AddScoped<ITaskItemService, TaskItemService>();
            builder.Services.AddScoped<ITaskCheckListService, TaskCheckListService>();
            builder.Services.AddScoped<ITaskCheckListItemService, TaskCheckListItemService>();
            builder.Services.AddScoped<IBoardMemberService, BoardMemberService>();
            builder.Services.AddScoped<IUserService, UserService>();

            builder.Services.AddAuthentication("Bearer").AddJwtBearer("Bearer", options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                        builder.Configuration["Jwt:Key"]
                    ))
                };
            });

            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new() { Title = "TaskManager API", Version = "v1" });

                //  Добавляем JWT схему авторизации
                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "Введите токен так: Bearer {токен}"
                });

                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });

            builder.Services.AddAuthorization();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowAll");
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
