# Frontend Changes Summary

## Overview
Updated the frontend to connect to the Symfony backend API instead of using local storage. All customer-related operations now use the backend API.

## Changes Made

### 1. CustomerContext.jsx

#### Updated to use API functions
- **Removed**: Local storage functions (`getCustomers`, `addOrUpdateCustomer`, `getOrders`, `addOrder`)
- **Added**: API imports (`registerCustomer`, `loginCustomer`, `logoutCustomer`, `fetchCustomerProfile`, `updateCustomerProfile`, `fetchCustomerOrders`)

#### Token Management
- **Added**: JWT token storage in localStorage (`TOKEN_KEY`)
- **Added**: Token state management
- **Added**: Automatic token persistence and retrieval

#### Updated Functions

**handleLogin**:
- Now calls `loginCustomer(email, password)` API
- Stores both customer data and JWT token
- Handles API errors properly

**handleRegister**:
- Now calls `registerCustomer(payload)` API
- Stores customer data and JWT token from response
- Returns customer object with token

**handleLogout**:
- Now calls `logoutCustomer(token)` API
- Clears both customer data and token from localStorage

**loadOrders**:
- Now calls `fetchCustomerOrders(token)` API
- Loads orders from backend instead of local storage

**New Functions**:
- `refreshProfile()`: Fetches latest customer profile from API
- Automatic profile loading on mount if token exists

### 2. CustomerAccount.jsx

#### Updated Profile Updates
- **Removed**: Local storage function `addOrUpdateCustomer`
- **Added**: API import `updateCustomerProfile`
- **Updated**: `handleSubmit` now calls API to update profile
- **Added**: Uses `refreshProfile()` to reload updated data
- **Added**: Token validation before updating

### 3. Checkout.jsx

#### Updated Order Submission
- **Removed**: Local storage functions (`addOrder`, `addOrUpdateCustomer`)
- **Added**: API import `submitOrder`
- **Updated**: `handleSubmit` now submits order to backend API
- **Added**: Error handling for API submission
- **Added**: Loading state during submission
- **Updated**: Order format to match backend expectations (snake_case customer fields)

## API Response Format Expectations

The frontend now expects these response formats from the backend:

### Login/Register Response:
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

### Profile Response:
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

### Orders Response:
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

## Environment Setup

Make sure you have a `.env` file in the root of your frontend project with:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Or whatever URL your Symfony backend is running on.

## Token Storage

- JWT tokens are stored in localStorage under key `twins_elegance_customer_token`
- Customer data is stored in localStorage under key `twins_elegance_customer`
- Both are cleared on logout

## Error Handling

- All API errors are caught and displayed to the user
- Invalid tokens (401 errors) trigger automatic logout
- Network errors show user-friendly messages

## Testing Checklist

1. ✅ Register new customer - should call API and store token
2. ✅ Login customer - should call API and store token
3. ✅ View customer profile - should load from API
4. ✅ Update customer profile - should call API and refresh
5. ✅ View customer orders - should load from API
6. ✅ Submit order - should call API
7. ✅ Logout - should clear token and customer data
8. ✅ Token persistence - should reload profile on page refresh if token exists

## Notes

- The frontend now fully depends on the backend API
- Local storage is only used for caching customer data and token (not as primary data source)
- All customer operations require a valid JWT token (except register/login)
- The frontend gracefully handles API errors and shows appropriate messages

