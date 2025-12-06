from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['id', 'rating', 'review_preview', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['review', 'ai_summary']
    readonly_fields = ['ai_response', 'ai_summary', 'ai_recommended_actions', 'created_at', 'updated_at']
    
    def review_preview(self, obj):
        return obj.review[:50] + '...' if len(obj.review) > 50 else obj.review
    review_preview.short_description = 'Review'