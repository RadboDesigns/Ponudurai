# goldLoan/tasks.py
import requests
from celery import shared_task
from django.utils import timezone
from .models import LivePrice
import logging


logger = logging.getLogger(__name__)
@shared_task
def update_live_prices():
    logger.info("Starting update_live_prices task")
    
    # API key configuration
    API_KEY = "goldapi-3sz5nsm7ysgt15-io"  # Replace with your actual API key
    CURRENCY = "INR"  # Indian Rupees
    
    # Initialize prices
    gold_price = None
    silver_price = None
    
    try:
        # Fetch gold price (XAU)
        logger.info("Fetching gold price...")
        gold_price = get_metal_price("XAU", CURRENCY, API_KEY)
        
        # Fetch silver price (XAG)
        logger.info("Fetching silver price...")
        silver_price = get_metal_price("XAG", CURRENCY, API_KEY)
        
        # Only save to database if at least one price was retrieved successfully
        if gold_price is not None or silver_price is not None:
            # Use 0.0 as default if one of the metals failed to fetch
            gold_price = gold_price if gold_price is not None else 0.0
            silver_price = silver_price if silver_price is not None else 0.0
            
            # Save the prices to the database
            live_price = LivePrice.objects.create(
                gold_price=gold_price,
                silver_price=silver_price,
                timestamp=timezone.now()
            )
            
            logger.info(f"Live prices updated successfully! Gold: {gold_price}, Silver: {silver_price}")
            return f"Success: Gold price: {gold_price}, Silver price: {silver_price}"
        else:
            error_msg = "Failed to fetch both gold and silver prices."
            logger.error(error_msg)
            return error_msg
            
    except Exception as e:
        error_msg = f"Unexpected error in update_live_prices task: {str(e)}"
        logger.error(error_msg)
        return error_msg


def get_metal_price(symbol, currency, api_key):
    """Helper function to fetch price for a specific metal"""
    url = f"https://www.goldapi.io/api/{symbol}/{currency}"
    
    headers = {
        "x-access-token": api_key,
        "Content-Type": "application/json"
    }
    
    try:
        logger.info(f"Requesting {symbol} data from: {url}")
        response = requests.get(url, headers=headers)
        logger.info(f"{symbol} API Response status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            price = data.get("price_gram_24k")  # 24K price per gram
            
            if price:
                return price
            else:
                logger.error(f"No price_gram_24k found in {symbol} response")
                return None
        else:
            logger.error(f"Failed to fetch {symbol} price: HTTP {response.status_code}")
            return None
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching {symbol} price: {e}")
        return None