from rest_framework import serializers

from .models import Category, Ingredient, Recipe, RecipeCategory, Step


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["id", "name", "unit", "quantity"]


class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ["id", "step_number", "text"]


class RecipeSerializer(serializers.ModelSerializer):
    # Read: return full category objects
    categories = CategorySerializer(many=True, read_only=True)

    # Write: accept a list of category IDs
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        many=True,
        write_only=True,
        required=False,
    )

    # Nested read + write for ingredients and steps
    ingredients = IngredientSerializer(many=True)
    steps = StepSerializer(many=True)

    class Meta:
        model = Recipe
        fields = [
            "id",
            "title",
            "description",
            "cooking_time",
            "difficulty",
            "image_url",
            "servings",
            "is_favorite",
            "categories",       # read-only nested output
            "category_ids",     # write-only input
            "ingredients",
            "steps",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def create(self, validated_data):
        # Extract nested and M2M data before creating the recipe
        ingredients_data = validated_data.pop("ingredients", [])
        steps_data = validated_data.pop("steps", [])
        category_objects = validated_data.pop("category_ids", [])

        # Create the recipe
        recipe = Recipe.objects.create(**validated_data)

        # Create ingredients linked to this recipe
        for ingredient_data in ingredients_data:
            Ingredient.objects.create(recipe=recipe, **ingredient_data)

        # Create steps linked to this recipe
        for step_data in steps_data:
            Step.objects.create(recipe=recipe, **step_data)

        # Create recipe-category relationships (M2M through explicit table)
        for category in category_objects:
            RecipeCategory.objects.create(recipe=recipe, category=category)

        return recipe

    def update(self, instance, validated_data):
        # Extract nested and M2M data before updating the recipe
        ingredients_data = validated_data.pop("ingredients", None)
        steps_data = validated_data.pop("steps", None)
        category_objects = validated_data.pop("category_ids", None)

        # Update simple recipe fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Replace ingredients if provided
        if ingredients_data is not None:
            instance.ingredients.all().delete()
            for ingredient_data in ingredients_data:
                Ingredient.objects.create(recipe=instance, **ingredient_data)

        # Replace steps if provided
        if steps_data is not None:
            instance.steps.all().delete()
            for step_data in steps_data:
                Step.objects.create(recipe=instance, **step_data)

        # Replace categories if provided
        if category_objects is not None:
            RecipeCategory.objects.filter(recipe=instance).delete()
            for category in category_objects:
                RecipeCategory.objects.create(recipe=instance, category=category)

        return instance
