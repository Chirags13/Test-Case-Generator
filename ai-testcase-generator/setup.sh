#!/bin/bash

echo "=========================================="
echo "AI Test Case Generator - Setup Script"
echo "=========================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi
echo "✓ Python 3 found: $(python3 --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi
echo "✓ Node.js found: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi
echo "✓ npm found: $(npm --version)"

echo ""
echo "Installing Backend Dependencies..."
cd backend
pip3 install -r requirements.txt --break-system-packages
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✓ Backend dependencies installed"

echo ""
echo "Installing Frontend Dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✓ Frontend dependencies installed"

echo ""
echo "=========================================="
echo "✓ Setup Complete!"
echo "=========================================="
echo ""
echo "To run the application:"
echo ""
echo "1. Start Backend (Terminal 1):"
echo "   cd backend"
echo "   python3 main.py"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "Note: You'll need a Gemini API key from:"
echo "https://makersuite.google.com/app/apikey"
echo ""
echo "=========================================="
