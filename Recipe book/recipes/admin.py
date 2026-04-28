from django.contrib import admin
from .models import Category, Recipe, RecipeCategory, Ingredient, Step


class IngredientInline(admin.TabularInline):
    model = Ingredient
    extra = 1


class StepInline(admin.TabularInline):
    model = Step
    extra = 1


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    inlines = [IngredientInline, StepInline]


admin.site.register(Category)
admin.site.register(RecipeCategory)
admin.site.register(Ingredient)
admin.site.register(Step)