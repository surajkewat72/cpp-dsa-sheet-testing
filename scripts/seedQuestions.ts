import { connect } from "../db/config";
import { Topic } from "../models/Question.model";

const sampleData = {
    "id": 1,
    "name": "Basics of Programming",
    "questions": [
        {
            "id": 1,
            "title": "Say \"Hello, World\" with c++",
            "difficulty": "easy",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "hackerrank": "https://www.hackerrank.com/challenges/cpp-hello-world/problem?"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/01%20Introduction%20to%20C%2B%2B/NamasteDuniya.cpp"
        },
        {
            "id": 2,
            "title": "Basic Data Types",
            "difficulty": "easy",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "hackerrank": "https://www.hackerrank.com/challenges/c-tutorial-basic-data-types/problem?"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/01%20Introduction%20to%20C%2B%2B/variablesAndDatatypes.cpp"
        },
        {
            "id": 3,
            "title": "Input and Output",
            "difficulty": "easy",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "hackerrank": "https://www.hackerrank.com/challenges/cpp-input-and-output/problem?"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/01%20Introduction%20to%20C%2B%2B/userinput.cpp"
        },
        {
            "id": 4,
            "title": "Conditional Statements (if-else)",
            "difficulty": "easy",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "hackerrank": "https://www.hackerrank.com/challenges/c-tutorial-conditional-if-else/problem?"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/01%20Introduction%20to%20C%2B%2B/ifelsestatements.cpp"
        },
        {
            "id": 5,
            "title": "Switch Case Statement",
            "difficulty": "easy",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "gfg": "https://www.geeksforgeeks.org/problems/c-switch-case-statement5900/0"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/01%20Introduction%20to%20C%2B%2B/SwitchStatements.cpp"
        },
        {
            "id": 6,
            "title": "Number System Conversion(decimal to binary)",
            "difficulty": "easy",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "gfg": "https://www.geeksforgeeks.org/problems/decimal-to-binary-1587115620/1"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/01%20Introduction%20to%20C%2B%2B/Number%20System%20Conversion/decToBinary.cpp",
            "companies": [
                "Adobe"
            ]
        },
        {
            "id": 7,
            "title": "Number System Conversion(binary to decimal)",
            "difficulty": "easy",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "gfg": "https://www.geeksforgeeks.org/problems/binary-number-to-decimal-number3525/1"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/01%20Introduction%20to%20C%2B%2B/Number%20System%20Conversion/binToDecimal.cpp",
            "companies": [
                "Adobe"
            ]
        },
        {
            "id": 8,
            "title": "Prime Number",
            "difficulty": "easy",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "gfg": "https://www.geeksforgeeks.org/problems/prime-number2314/1"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/02%20Basics%20Of%20Programming-Level-2/Bitwise%20Operators%20and%20Functions/primeNumber.cpp",
            "companies": [
                "Amazon",
                "SAP"
            ]
        },
        {
            "id": 9,
            "title": "Factorial",
            "difficulty": "easy",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "gfg": "https://www.geeksforgeeks.org/problems/factorial5739/1"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/02%20Basics%20Of%20Programming-Level-2/Week%202-%20assignments/functions/factorial.cpp",
            "companies": [
                "Morgan Stanley",
                "Samsung"
            ]
        },
        {
            "id": 10,
            "title": "⚡ Reverse Integer",
            "difficulty": "medium",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "leetcode": "https://leetcode.com/problems/reverse-integer/description/"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/02%20Basics%20Of%20Programming-Level-2/Week%202-%20assignments/leetcode%20questions/reverseInteger.cpp",
            "companies": [
                "Adobe",
                "Amazon",
                "Apple",
                "Google",
                "Meta",
                "Microsoft",
                "Nvidia",
                "Samsung",
                "Uber",
                "Oracle",
                "WITCH"
            ]
        },
        {
            "id": 11,
            "title": "Set Kth Bit",
            "difficulty": "easy",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "gfg": "https://www.geeksforgeeks.org/problems/set-kth-bit3724/1"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/02%20Basics%20Of%20Programming-Level-2/Week%202-%20assignments/leetcode%20questions/setKthBit.cpp",
            "companies": [
                "Cisco"
            ]
        },
        {
            "id": 12,
            "title": "Convert The Temperature",
            "difficulty": "easy",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "leetcode": "https://leetcode.com/problems/convert-the-temperature/description/"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/02%20Basics%20Of%20Programming-Level-2/Week%202-%20assignments/leetcode%20questions/convertTemperature.cpp"
        },
        {
            "id": 13,
            "title": "Count all Set Bits",
            "difficulty": "medium",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "gfg": "https://www.geeksforgeeks.org/problems/count-total-set-bits-1587115620/1"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/tree/main/02%20Basics%20Of%20Programming-Level-2/Week%202-%20assignments/functions/Count%20Set%20Bits"
        },
        {
            "id": 14,
            "title": "Create Number Using Digits",
            "difficulty": "easy",
            "isSolved": false,
            "isMarkedForRevision": false,
            "links": {
                "code": "https://codebaji.com/program-to-form-a-number-using-entered-digits/#google_vignette"
            },
            "solutionLink": "https://github.com/saumyayadav25/DSA-Supreme-3.0/blob/main/02%20Basics%20Of%20Programming-Level-2/Week%202-%20assignments/functions/numberUsingDigits.cpp"
        }
    ]
};

async function seedDatabase() {
    try {
        console.log("🌱 Starting database seeding...");

        // Connect to database
        await connect();
        console.log("✅ Connected to MongoDB");

        // Check if topic already exists
        const existingTopic = await Topic.findOne({ id: sampleData.id });

        if (existingTopic) {
            console.log(`📝 Topic "${sampleData.name}" already exists. Updating...`);
            const updatedTopic = await Topic.findOneAndUpdate(
                { id: sampleData.id },
                sampleData,
                { new: true, upsert: true }
            );
            console.log(`✅ Updated topic: ${updatedTopic.name} with ${updatedTopic.questions.length} questions`);
        } else {
            console.log(`🆕 Creating new topic: ${sampleData.name}`);
            const newTopic = new Topic(sampleData);
            const savedTopic = await newTopic.save();
            console.log(`✅ Created topic: ${savedTopic.name} with ${savedTopic.questions.length} questions`);
        }

        console.log("🎉 Database seeding completed successfully!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
}

// Run the seeding function
seedDatabase();