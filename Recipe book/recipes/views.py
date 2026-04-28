from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .models import Category, Recipe
from .serializers import CategorySerializer, RecipeSerializer


class RecipeViewSet(viewsets.ModelViewSet):
    """
    Handles all CRUD operations for recipes.

    GET  /api/recipes/          — list (guests allowed)
    GET  /api/recipes/{id}/     — detail (guests allowed)
    POST /api/recipes/          — create (admin only)
    PUT  /api/recipes/{id}/     — update (admin only)
    DELETE /api/recipes/{id}/   — delete (admin only)
    PATCH /api/recipes/{id}/favorite/ — toggle favorite (admin only)
    """

    serializer_class = RecipeSerializer

    def get_permissions(self):
        """
        GET requests are open to everyone (guests included).
        All other requests require the user to be authenticated (admin).
        """
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """
        Returns a filtered queryset based on query parameters:
          - search        : filter by title (case-insensitive substring match)
          - category_ids  : comma-separated IDs, OR logic (e.g. "1,2,3")
          - favorites     : "true" or "false"
        """
        queryset = Recipe.objects.all()

        # --- Search by title ---
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(title__icontains=search)

        # --- Filter by categories (OR logic) ---
        category_ids_param = self.request.query_params.get("category_ids")
        if category_ids_param:
            # Parse comma-separated string into a list of integers
            id_list = [
                int(id_str)
                for id_str in category_ids_param.split(",")
                if id_str.strip().isdigit()
            ]
            if id_list:
                # distinct() prevents duplicate recipes when a recipe
                # matches more than one selected category
                queryset = queryset.filter(
                    categories__id__in=id_list
                ).distinct()

        # --- Filter by favorites ---
        favorites_param = self.request.query_params.get("favorites")
        if favorites_param is not None:
            is_favorite = favorites_param.lower() == "true"
            queryset = queryset.filter(is_favorite=is_favorite)

        return queryset

    @action(detail=True, methods=["patch"], url_path="favorite")
    def favorite(self, request, pk=None):
        """
        PATCH /api/recipes/{id}/favorite/
        Body: { "is_favorite": true | false }
        Toggles the favorite status of a recipe. Admin only.
        """
        recipe = self.get_object()
        is_favorite = request.data.get("is_favorite")

        if is_favorite is None:
            return Response(
                {"error": "'is_favorite' field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Must be a real JSON boolean (true/false), not a string or other type.
        # bool("false") == True in Python, so we explicitly reject non-booleans.
        if not isinstance(is_favorite, bool):
            return Response(
                {"error": "'is_favorite' must be a boolean (true or false)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        recipe.is_favorite = is_favorite
        recipe.save(update_fields=["is_favorite"])

        serializer = self.get_serializer(recipe)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to categories.

    GET /api/categories/    — list all categories
    GET /api/categories/{id}/ — category detail
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is not None and user.is_staff:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    else:
        return Response({'error': 'Invalid credentials or not authorized.'}, status=status.HTTP_401_UNAUTHORIZED)
