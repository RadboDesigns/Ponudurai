from django.http import HttpResponseForbidden

class RoleBasedAccessMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/admin/'):
            if not request.user.is_authenticated:
                return HttpResponseForbidden("Access Denied")
            if not (request.user.is_superuser or request.user.is_staff):  # Allow superusers and staff
                return HttpResponseForbidden("Access Denied")

        response = self.get_response(request)
        return response