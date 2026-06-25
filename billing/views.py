import stripe
from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Subscription
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

stripe.api_key = settings.STRIPE_SECRET_KEY

@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, stripe.SignatureVerificationError):
            return HttpResponse(status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            customer_id = session.customer
            subscription_id = session.subscription
            print(f"DEBUG: customer_id={customer_id}, subscription_id={subscription_id}")
             
            try:
                sub = Subscription.objects.get(stripe_customer_id=customer_id)
                sub.plan = 'pro'
                sub.status = 'active'
                sub.stripe_subscription_id = subscription_id
                sub.save()
                print(f"DEBUG: Updated subscription for user {sub.user.username} to pro")
            except Subscription.DoesNotExist:
                print(f"DEBUG: No subscription found matching customer_id {customer_id}")

        elif event['type'] == 'customer.subscription.deleted':
            subscription_id = event['data']['object']['id']
            try:
                sub = Subscription.objects.get(stripe_subscription_id=subscription_id)
                sub.plan = 'free'
                sub.status = 'canceled'
                sub.save()
            except Subscription.DoesNotExist:
                pass

        return HttpResponse(status=200)


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        sub, _ = Subscription.objects.get_or_create(user=user)

        # Create Stripe customer if not already created
        if not sub.stripe_customer_id:
            customer = stripe.Customer.create(email=user.email, metadata={'user_id': user.id})
            sub.stripe_customer_id = customer.id
            sub.save()

        session = stripe.checkout.Session.create(
            customer=sub.stripe_customer_id,
            payment_method_types=['card'],
            line_items=[{
                'price': settings.STRIPE_PRICE_ID,
                'quantity': 1,
            }],
            mode='subscription',
            success_url='http://localhost:5173/billing/success',
            cancel_url='http://localhost:5173/',
        )

        return Response({'checkout_url': session.url}, status=200)


class SubscriptionStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sub, _ = Subscription.objects.get_or_create(user=request.user)
        return Response({'plan': sub.plan, 'status': sub.status}, status=200)