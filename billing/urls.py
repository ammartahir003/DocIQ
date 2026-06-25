from .views import CreateCheckoutSessionView, SubscriptionStatusView, StripeWebhookView
from django.urls import path

urlpatterns = [
    path('checkout/', CreateCheckoutSessionView.as_view(), name='checkout'),
    path('status/', SubscriptionStatusView.as_view(), name='subscription-status'),
    path('webhook/', StripeWebhookView.as_view(), name='webhook'),
]