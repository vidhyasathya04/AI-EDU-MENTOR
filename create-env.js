const fs = require('fs');

const envContent = `# Database Configuration
DATABASE_URL=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/edu-mentor-ai?retryWrites=true&w=majority

# JWT Secret (replace with a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Groq API Key (replace with your actual Groq API key)
GROQ_API_KEY=your-groq-api-key-here

# Hugging Face API Token (replace with your actual token)
HUGGINGFACE_API_TOKEN=your-huggingface-token-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3001

# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api`;

fs.writeFileSync('.env.local', envContent);
console.log('.env.local file created successfully!');
console.log('⚠️  IMPORTANT: Replace the placeholder values with your actual credentials!'); 