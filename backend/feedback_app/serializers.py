from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['ai_response', 'ai_summary', 'ai_recommended_actions', 'created_at', 'updated_at']

class FeedbackAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['ai_summary', 'ai_recommended_actions', 'created_at', 'updated_at']

class FeedbackCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['rating', 'review']