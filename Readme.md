
# Shop Inventory

Full CRUD based Inventory and Bill management system.


.env file is added for connecting the atlas server

## 1. Clone the Repository
Clone the repository to your local machine:

```bash
git clone https://github.com/Anurag2509-fledor/shopInventoryCRUD
cd shopInventoryCRUD
```

## 2.  Install Dependencies
```bash
npm install
```

## 3.  Run the Application
```bash
npm run start
```

## 3.  Access Swagger API Documentation
```bash
http://localhost:5000/api-docs
```
## 3.  Access Swagger API Documentation
```bash
http://localhost:5000/api-docs
```
# API Endpoints Documentation

This documentation provides information about the available API endpoints for the Inventory and Bill Management application.

## 1. **GET /api/inventory**
Retrieve all inventory items.

### Response:
- **200 OK**: A list of all inventory items.
  - Example:
    ```json
    [
      {
        "id": "613b1f37c21a3a2f8d3f982b",
        "name": "Apple",
        "price": 1.2,
        "quantity": 100
      },
      {
        "id": "613b1f37c21a3a2f8d3f983c",
        "name": "Banana",
        "price": 0.8,
        "quantity": 200
      }
    ]
    ```

## 2. **POST /api/inventory**
Add a new inventory item.

### Request Body:
- **name** (string): Name of the item.
- **price** (number): Price of the item.
- **quantity** (integer): Quantity of the item in stock.

Example Request Body:
```json
{
  "name": "Apple",
  "price": 1.2,
  "quantity": 100
}
```

## 3. **PUT /api/inventory/{id}**
Update an existing inventory item.

### Parameters:
- **id** (string): The ID of the item to update.

### Request Body:
- **name** (string, optional): New name of the item.
- **price** (number, optional): New price of the item.
- **quantity** (integer, optional): New quantity of the item.

Example Request Body:
```json
{
  "name": "Green Apple",
  "price": 1.5,
  "quantity": 120
}
```
## 4. **DELETE /api/inventory/{id}**
Delete an inventory item by its ID.

### **Parameters:**
- **id** (string): The ID of the item to delete.

### **Response:**
- **200 OK**: Item deleted successfully.
  - Example:
    ```json
    {
      "message": "Item deleted"
    }
    ```

- **404 Not Found**: Item not found.
  - Example:
    ```json
    {
      "message": "Item not found"
    }
    ```

- **500 Internal Server Error**: If an unexpected error occurs.
  - Example:
    ```json
    {
      "message": "Internal server error"
    }
    ```

---

### **Example Usage:**
To delete an item with the ID `613b1f37c21a3a2f8d3f982b`, the request would be:

```bash
curl -X DELETE http://localhost:5000/api/inventory/613b1f37c21a3a2f8d3f982b
```
## Authors

- [@Anurag2509-fledor](https://www.github.com/Anurag2509-fledor)

