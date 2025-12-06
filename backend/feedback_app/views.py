from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Avg
from .models import Feedback
from .serializers import FeedbackAnalyticsSerializer, FeedbackSerializer, FeedbackCreateSerializer
from .ai_service import generate_ai_responses

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    
    def create(self, request, *args, **kwargs):
        """Handle feedback submission with AI generation"""
        serializer = FeedbackCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        rating = serializer.validated_data['rating']
        review = serializer.validated_data['review']
        
        # Generate AI responses
        user_response, summary, recommended_actions = generate_ai_responses(rating, review)
        
        # Save feedback with AI responses
        feedback = Feedback.objects.create(
            rating=rating,
            review=review,
            ai_response=user_response,
            ai_summary=summary,
            ai_recommended_actions=recommended_actions
        )
        
        return Response(
            FeedbackSerializer(feedback).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get analytics data for admin dashboard"""
        total_feedbacks = Feedback.objects.count()
        
        rating_distribution = {}
        for i in range(1, 6):
            rating_distribution[f'star_{i}'] = Feedback.objects.filter(rating=i).count()
        
        avg_rating = Feedback.objects.aggregate(Avg('rating'))['rating__avg'] or 0
        
        recent_feedbacks = Feedback.objects.all()[:10]
        
        return Response({
            'total_feedbacks': total_feedbacks,
            'rating_distribution': rating_distribution,
            'average_rating': round(avg_rating, 2),
            'recent_feedbacks': FeedbackAnalyticsSerializer(recent_feedbacks, many=True).data
        })
