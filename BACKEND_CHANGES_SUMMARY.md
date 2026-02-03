# Backend Changes Summary

## Overview
Updated the Symfony backend to match the frontend API expectations. The frontend was updated to use API calls, and the backend needed to be adjusted to return the correct response formats.

## Changes Made

### 1. CustomerAuthController.php

#### Register Endpoint (`POST /api/customer/register`)
- **Changed**: Now returns JWT token along with customer data
- **Response Format**: 
  ```json
  {
    "customer": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "0123456789",
      "address": "123 Main St",
      "city": "Paris",
      "zip_code": "75001"
    },
    "token": "jwt_token_here"
  }
  ```
- **Key Changes**:
  - Added JWT token generation using `JWTTokenManagerInterface`
  - Changed field names from camelCase to snake_case (firstName → first_name, etc.)
  - Removed `success` and `message` fields (frontend expects direct customer object)

#### Login Endpoint (`POST /api/customer/login`)
- **Changed**: Now handles authentication manually instead of using security.yaml json_login
- **Response Format**:
  ```json
  {
    "customer": { ... },
    "token": "jwt_token_here"
  }
  ```
- **Key Changes**:
  - Moved from security.yaml json_login to manual handling in controller
  - Returns customer data along with JWT token
  - Uses snake_case field names

#### Profile Endpoint (`GET /api/customer/profile`)
- **Changed**: Response format updated to match frontend expectations
- **Response Format**:
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "0123456789",
    "address": "123 Main St",
    "city": "Paris",
    "zip_code": "75001"
  }
  ```
- **Key Changes**:
  - Removed `success` wrapper
  - Changed to snake_case field names
  - Returns customer object directly

#### Update Profile Endpoint (`PUT /api/customer/profile`)
- **Changed**: Response format updated
- **Response Format**: Same as profile endpoint (customer object with snake_case)
- **Key Changes**:
  - Removed `success` and `message` fields
  - Returns updated customer object directly

#### Orders Endpoint (`GET /api/customer/orders`)
- **Changed**: Response format completely restructured
- **Response Format**:
  ```json
  [
    {
      "id": 1,
      "total": 299.99,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z",
      "items": [
        {
          "id": 1,
          "name": "Bague en or",
          "quantity": 1,
          "price": 299.99
        }
      ]
    }
  ]
  ```
- **Key Changes**:
  - Returns array directly (not wrapped in `{success: true, orders: [...]}`)
  - Changed `productName` to `name` in items
  - Removed `productId` from items
  - Changed numeric strings to floats for `total` and `price`
  - Simplified order structure (removed `subtotal`, `deliveryFee`, `orderNumber`)

### 2. ChatController.php (NEW)
- **Created**: New controller for AI chat functionality
- **Endpoint**: `POST /api/chat`
- **Request Format**:
  ```json
  {
    "question": "Quels sont vos délais de livraison ?"
  }
  ```
- **Response Format**:
  ```json
  {
    "answer": "Nos délais de livraison sont de 3 à 5 jours ouvrés..."
  }
  ```
- **Features**:
  - Rule-based responses for common questions
  - Can be easily extended to use AI service (OpenAI, etc.)
  - Handles questions about delivery, sizing, gift wrapping, warranty, payment, products, and contact

### 3. security.yaml
- **Changed**: Updated firewall configuration
- **Key Changes**:
  - Removed `customer_login` firewall with json_login (now handled manually in controller)
  - Added `/api/chat` to public routes in access_control

## Dependencies
- `lexik/jwt-authentication-bundle` - Already installed and configured
- `JWTTokenManagerInterface` - Injected into CustomerAuthController for token generation

## Testing Checklist

1. ✅ Register new customer - should return customer object + token
2. ✅ Login customer - should return customer object + token  
3. ✅ Get customer profile - should return customer object with snake_case fields
4. ✅ Update customer profile - should return updated customer object
5. ✅ Get customer orders - should return array of orders with correct item structure
6. ✅ Chat endpoint - should return answer to questions
7. ✅ Error handling - all endpoints return proper error messages

## Notes

- All customer field names use **snake_case** (first_name, last_name, zip_code) to match frontend expectations
- JWT tokens are generated using the Lexik JWT bundle
- The chat endpoint uses simple rule-based responses but can be upgraded to use an AI service later
- Error responses use `message` field which the frontend's `handleResponse` function expects

## Next Steps (Optional)

1. Integrate real AI service (OpenAI, etc.) for chat endpoint
2. Add rate limiting for chat endpoint
3. Add logging for customer authentication events
4. Consider adding refresh token functionality

