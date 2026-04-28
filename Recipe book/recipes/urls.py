from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, RecipeViewSet, login_view

router = DefaultRouter()
router.register(r"recipes", RecipeViewSet, basename="recipe")
router.register(r"categories", CategoryViewSet, basename="category")

urlpatterns = [
    path("auth/login/", login_view, name="login"),
    path("", include(router.urls)),
]
