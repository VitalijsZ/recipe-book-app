from django.contrib import admin
from .models import Category, Recipe, RecipeCategory, Ingredient, Step

# Register your models here.
admin.site.register(Category)
admin.site.register(Recipe)
admin.site.register(RecipeCategory)
admin.site.register(Ingredient)
admin.site.register(Step)
