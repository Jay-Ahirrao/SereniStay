# SereniStay

SereniStay is a web application for managing and browsing accommodation listings. Users can create, view, edit, and delete property listings.

## Features

- Create new property listings with details like title, description, price, location, and country
- View all listings in a clean, organized interface
- Edit existing listing details
- Delete listings
- Input validation for listing data
- Error handling with custom error pages

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  
- **Frontend:**
  - EJS (Embedded JavaScript templates)
  - EJS-Mate for layouts
  
- **Other Tools:**
  - Method-Override for HTTP method handling
  - Express Error handling middleware
  - Custom async wrapper utility

## Installation

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Make sure MongoDB is installed and running on your system

4. Start the server
   ```bash
   node app.js
   ```

The application will be available at `http://localhost:8080`

## API Endpoints

- `GET /pathlistings` - View all listings
- `GET /pathlistings/new` - Form to create new listing
- `POST /pathlistings` - Create new listing
- `GET /pathlistings/:id` - View specific listing
- `GET /pathlistings/:id/edit` - Edit form for specific listing
- `PUT /pathlistings/:id` - Update specific listing
- `DELETE /pathlistings/:id` - Delete specific listing

## Environment Setup

Make sure MongoDB is running locally at:
mongodb://127.0.0.1:27017/SereniStay

-Review Sectoion is created and now it also has a UI, adding a landing page .