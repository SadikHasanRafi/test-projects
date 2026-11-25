# Middleware: a function that wraps every request. get_response is like next().
import time


def request_logger(get_response):
    # Code here runs once, when the server starts

    def middleware(request):
        start = time.perf_counter()
        response = get_response(request)  # run the view
        ms = round((time.perf_counter() - start) * 1000)
        print(f"{request.method} {request.get_full_path()} {response.status_code} {ms}ms")
        return response

    return middleware
