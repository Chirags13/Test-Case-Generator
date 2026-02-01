# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies (2 minutes)

```bash
# Run the setup script
chmod +x setup.sh
./setup.sh
```

Or manually:

```bash
# Backend
cd backend
pip3 install -r requirements.txt --break-system-packages

# Frontend
cd ../frontend
npm install
```

### 2. Get API Key (1 minute)

Visit: https://makersuite.google.com/app/apikey

Click "Create API Key" and copy it.

### 3. Start Services (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
python3 main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Open Browser

Navigate to: http://localhost:5173

### 5. Try Example (1 minute)

**Requirement ID:** `REQ-001`

**Requirement Text:**
```
The altitude sensor shall accept altitude values between 0 and 50000 feet.
The system shall reject any value outside this range.
When altitude exceeds 45000 feet, a warning shall be issued.
```

**Input:**
- Name: `altitude`
- Type: `int`
- Unit: `feet`
- Min: `0`
- Max: `50000`

**Output:**
- Name: `status`
- Type: `string`
- Possible Values: `ACCEPTED, REJECTED, WARNING`

**API Key:** Paste your Gemini API key

**Click through steps** → Get test cases!

## 🎯 What to Expect

- **~20 test cases** generated
- **BVA, EP, Negative tests**
- **100% rule coverage**
- **Excel export** ready

## 📊 Next Steps

1. Review the [User Guide](USER_GUIDE.md) for detailed instructions
2. Read [README](README.md) for full documentation
3. Try your own requirements
4. Export test cases to Excel

## ⚡ Tips

- Use clear, formal requirement language
- Define all input ranges explicitly
- Review AI interpretation before generating
- Check coverage metrics

## 🐛 Issues?

**Backend won't start:**
- Check Python version (3.9+)
- Verify all dependencies installed

**Frontend won't start:**
- Check Node version (18+)
- Run `npm install` again

**API errors:**
- Verify Gemini API key
- Check internet connection

**No test cases:**
- Ensure requirement is clear
- Check that inputs/outputs are defined
- Review interpretation status

## 💡 Example Requirements

### Simple Numeric Range
```
The temperature sensor shall accept values between -40 and 125 degrees Celsius.
```

### With States
```
The system shall operate in three modes: IDLE, ACTIVE, and ERROR.
Transitions from IDLE to ACTIVE require valid initialization.
```

### With Multiple Conditions
```
The login system shall accept passwords between 8 and 20 characters.
Passwords must contain at least one uppercase letter and one digit.
Three consecutive failed attempts shall lock the account.
```

Happy Testing! 🎉
