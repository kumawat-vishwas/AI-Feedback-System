from django.db import models
from django.utils import timezone

class Feedback(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    rating = models.IntegerField(choices=RATING_CHOICES)
    review = models.TextField()
    ai_response = models.TextField(blank=True)
    ai_summary = models.TextField(blank=True)
    ai_recommended_actions = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.rating} stars - {self.review[:50]}"