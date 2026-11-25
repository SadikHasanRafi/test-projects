using System.Diagnostics;

namespace BooksApi.Middleware;

// Logs: GET /books 200 3ms
// `next` is the rest of the pipeline, like next() in Express.
public class RequestLoggerMiddleware(RequestDelegate next, ILogger<RequestLoggerMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var start = Stopwatch.GetTimestamp();

        await next(context); // run everything after this middleware

        var ms = Math.Round(Stopwatch.GetElapsedTime(start).TotalMilliseconds);
        var request = context.Request;
        logger.LogInformation("{Method} {Path} {Status} {Ms}ms",
            request.Method, request.Path + request.QueryString, context.Response.StatusCode, ms);
    }
}
