from django.db import models
from django.core.exceptions import ValidationError


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Recipe(models.Model):
    DIFFICULTY_CHOICES = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    cooking_time = models.PositiveIntegerField(help_text="Cooking time in minutes")
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    image_url = models.URLField(blank=True, default="")
    servings = models.PositiveIntegerField()
    is_favorite = models.BooleanField(default=False)
    categories = models.ManyToManyField(
        Category,
        through="RecipeCategory",
        related_name="recipes",
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class RecipeCategory(models.Model):
    """
    Explicit join table for the Recipe <-> Category many-to-many relationship.
    Matches the 'recipe_categories' table described in the PRD.
    """
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.recipe} — {self.category}"

    class Meta:
        unique_together = ("recipe", "category")
        verbose_name = "Recipe Category"
        verbose_name_plural = "Recipe Categories"


class Ingredient(models.Model):
    UNIT_CHOICES = [
        ("g", "Grams"),
        ("ml", "Milliliters"),
        ("pcs", "Pieces"),
        ("tbsp", "Tablespoon"),
        ("tsp", "Teaspoon"),
        ("to_taste", "To Taste"),
    ]

    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name="ingredients",
    )
    name = models.CharField(max_length=255)
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES)
    quantity = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Optional. Can be null when unit is 'to_taste'.",
    )

    def clean(self):
        # Quantity is required for all units except 'to_taste'
        if self.unit != "to_taste" and self.quantity is None:
            raise ValidationError(
                {"quantity": "Quantity is required when unit is not 'to_taste'."}
            )

    def __str__(self):
        if self.quantity is not None:
            return f"{self.name} — {self.quantity} {self.unit}"
        return f"{self.name} — {self.unit}"


class Step(models.Model):
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name="steps",
    )
    step_number = models.PositiveIntegerField()
    text = models.TextField()

    def __str__(self):
        return f"Step {self.step_number}: {self.text[:50]}"

    class Meta:
        ordering = ["step_number"]
        unique_together = ("recipe", "step_number")
