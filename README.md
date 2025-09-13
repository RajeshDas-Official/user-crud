# Steps to run the project
git clone https://github.com/RajeshDas-Official/user-crud.git

cd user-crud

Start Backend:
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
MONGODB_URI=mongodb://localhost:27017/crud
APP_PORT=7000
APP_HOST=localhost
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development


# Start backend server
npm start

Start Frontend:
# Navigate to frontend directory
cd frontend

# Create environment file
cp .env.example .env

# Install dependencies
npm install

# Start frontend server
npm run dev