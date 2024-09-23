using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var CORS = "CORS";

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(o => {
    o.SwaggerDoc("1", new OpenApiInfo {
        Version = "1",
        Title = "Chopo Database File System (CDBFS)",
        Description = "CDBFS Is meant to turn any hosted Postgres instance into a usable file system",
    });

});


builder.Services.AddCors(o => {
    o.AddPolicy(name: CORS,
    builder => {
        builder.AllowAnyHeader();
        builder.AllowAnyMethod();
        builder.AllowAnyOrigin();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI(options => options.SwaggerEndpoint($"/swagger/1/swagger.json", "Chopo Database File System (CDBFS)"));
    app.UseDeveloperExceptionPage();

}

app.UseCors(CORS);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle



