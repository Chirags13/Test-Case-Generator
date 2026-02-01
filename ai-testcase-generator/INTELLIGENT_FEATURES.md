# Intelligent Features - AI Test Case Generator

## 🧠 Smart Range Inference

The system now includes **intelligent range inference** that automatically determines reasonable boundary values based on context, even when not explicitly specified.

### How It Works

When you don't provide min/max values, the system analyzes:
1. **Input Name** - Recognizes common patterns (altitude, temperature, age, etc.)
2. **Data Type** - Applies type-appropriate defaults
3. **Units** - Uses unit information for context (feet, celsius, mph, etc.)
4. **Domain Knowledge** - Applies industry-standard ranges

### Supported Domain Patterns

#### Physical Measurements
- **altitude** → 0 to 100,000 (feet/meters)
- **temperature** → -273 to 5,000 (celsius) or -459 to 9,000 (fahrenheit)
- **speed** → 0 to 500 (mph/km/h)
- **pressure** → 0 to 10,000
- **distance** → 0 to 1,000,000
- **weight** → 0 to 100,000 (kg/lb)
- **height** → 0 to 300

#### Human Attributes
- **age** → 0 to 120 years
- **percentage** → 0 to 100%

#### Coordinates
- **latitude** → -90 to 90 degrees
- **longitude** → -180 to 180 degrees

#### Time
- **time** → 0 to 86,400 seconds (24 hours)
- **duration** → 0 to 3,600 seconds
- **hour** → 0 to 23
- **minute** / **second** → 0 to 59
- **year** → 1900 to 2100
- **month** → 1 to 12
- **day** → 1 to 31

#### Identifiers
- **id** → 1 to 1,000,000
- **count** / **index** → 0 to 10,000

#### String Lengths
- **name** → 100 characters
- **email** → 255 characters
- **password** → 128 characters
- **username** → 50 characters
- **address** → 500 characters
- **description** → 1,000 characters
- **message** → 5,000 characters
- **url** → 2,048 characters
- **phone** → 20 characters

### Unit-Based Inference

The system also recognizes units:

**Temperature Units**
- celsius / °C → -273 to 5,000
- fahrenheit / °F → -459 to 9,000

**Distance Units**
- feet / ft → 0 to 10,000 (0 to 100,000 for altitude)
- meters / m → 0 to 10,000

**Speed Units**
- mph → 0 to 500
- km/h → 0 to 500

**Weight Units**
- kg → 0 to 10,000
- lb → 0 to 10,000

**Percentage**
- % / percent → 0 to 100

### Examples

#### Example 1: Altitude Sensor (with inference)
```
Input: "altitude"
Type: int
Unit: "feet"
Min/Max: NOT PROVIDED

System infers: 0 to 100,000 feet
Generates: BVA tests at 0, 1, 50000, 99999, 100000, -1, 100001
```

#### Example 2: Temperature Sensor (with inference)
```
Input: "temperature"
Type: float
Unit: "celsius"
Min/Max: NOT PROVIDED

System infers: -273 to 5,000 celsius
Generates: BVA tests at -273, -272.9, 2363.5, 4999.9, 5000, -273.1, 5000.1
```

#### Example 3: Age Validation (with inference)
```
Input: "age"
Type: int
Unit: "years"
Min/Max: NOT PROVIDED

System infers: 0 to 120 years
Generates: BVA tests at 0, 1, 60, 119, 120, -1, 121
```

#### Example 4: Generic Integer (fallback)
```
Input: "value"
Type: int
Min/Max: NOT PROVIDED

System infers: 0 to 1,000 (generic fallback)
Generates: BVA tests at 0, 1, 500, 999, 1000, -1, 1001
```

## 🎯 Intelligent AI Interpretation

The AI has been enhanced to be more lenient and context-aware:

### What Changed

**Before**: Strict interpretation, blocks on any missing information
**After**: Intelligent inference, only blocks on critical ambiguities

### AI Behavior

1. **Infers Reasonable Defaults**: Uses domain knowledge to fill gaps
2. **Documents Assumptions**: All inferences are listed in assumptions
3. **Context-Aware**: Understands common software domains
4. **Lenient Blocking**: Only blocks when truly ambiguous or contradictory

### Example Scenarios

#### Scenario 1: Missing Explicit Range
**Requirement**: "The system shall validate user age."

**Old Behavior**: 
- ❌ BLOCKED - "Age range not specified"

**New Behavior**:
- ✅ OK - Infers age: 0-120 years
- Documents assumption: "Assumed standard human age range 0-120 years"
- Generates full test suite

#### Scenario 2: Unit Hints
**Requirement**: "The altitude sensor shall accept altitude values in feet."

**Old Behavior**:
- ❌ BLOCKED - "Min/max altitude not specified"

**New Behavior**:
- ✅ OK - Infers altitude: 0-100,000 feet
- Documents assumption: "Assumed typical aircraft altitude range"
- Generates full test suite

#### Scenario 3: Type-Based Inference
**Requirement**: "The system shall validate the temperature reading."

**Input**: temperature (float, celsius)

**New Behavior**:
- ✅ Infers: -273 to 5,000 celsius (absolute zero to extreme max)
- Documents assumption: "Used physical temperature limits"
- Generates comprehensive tests

## 🔄 Fallback Strategy

When no specific pattern is matched:

1. **Numeric Types**: 0 to 1,000
2. **Float Types**: 0.0 to 1,000.0
3. **String Types**: 0 to 255 characters
4. **Boolean**: true/false (no inference needed)

## 💡 Best Practices

### When to Provide Explicit Ranges

**DO provide explicit ranges when**:
- Requirements specify exact limits
- Domain has specific constraints
- Certification requires specific values
- Non-standard ranges needed

**CAN skip ranges when**:
- Using common domain patterns (altitude, age, temperature)
- Prototyping or early development
- Trusting intelligent inference
- Range is obvious from context

### Reviewing Inferred Values

Always review the interpretation step to see:
1. What ranges were inferred
2. What assumptions were made
3. If inferred values match your intent

### Overriding Inference

You can always override by providing explicit min/max values:
- Explicit values take precedence over inference
- Mix explicit and inferred as needed
- System documents which values were inferred

## 📊 Benefits

### Faster Development
- No need to specify every detail upfront
- Works with incomplete specifications
- Iterate faster on requirements

### Reduced Blocking
- Only blocks on critical issues
- More productive workflow
- Less back-and-forth

### Better Coverage
- Still generates comprehensive tests
- Uses sensible defaults
- Documents all assumptions

### Maintains Safety
- All assumptions documented
- User can review and override
- Traceability preserved
- Certification-ready outputs

## ⚠️ When System Still Blocks

The system will BLOCK only when:

1. **Contradictory Requirements**: "Value must be both positive and negative"
2. **Fundamentally Unclear**: "The system shall do something appropriate"
3. **Missing Critical Information**: No inputs defined at all
4. **Logical Impossibilities**: Unsolvable constraints

## 🎓 Summary

The intelligent system:
- ✅ Works with minimal information
- ✅ Infers sensible defaults
- ✅ Documents all assumptions
- ✅ Maintains full traceability
- ✅ Still certification-grade
- ✅ User can always override
- ✅ Only blocks on critical issues

This makes the tool more practical for real-world use while maintaining the safety and rigor required for certification!
