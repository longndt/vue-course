# Lab 0: JavaScript ES6+ Mastery Project

## Overview

**Difficulty**: Beginner to Intermediate  
**Estimated Time**: 2-3 hours  
**Prerequisites**: Basic JavaScript knowledge

This lab will help you master essential JavaScript ES6+ features through building a practical student management system. You'll use modern JavaScript patterns that are fundamental to Vue development.

---

## 🎯 Learning Objectives

After completing this lab, you will be able to:

- ✅ Master arrow functions and `this` binding
- ✅ Use destructuring for object and array manipulation
- ✅ Apply template literals for dynamic string generation
- ✅ Implement array methods (map, filter, reduce, find) effectively
- ✅ Handle async operations with Promises and async/await
- ✅ Organize code with ES6 modules
- ✅ Apply modern JavaScript patterns in real-world scenarios

---

## 📋 Project Requirements

Build a **Student Management System** with the following features:

### Core Features
1. **Student Data Management**
   - Add new students
   - View all students
   - Search students by name or major
   - Filter students by grade level

2. **Statistics Dashboard**
   - Calculate average GPA
   - Find top performers
   - Group students by major
   - Generate performance reports

3. **Data Export**
   - Export student data as JSON
   - Generate formatted reports

---

## 🚀 Getting Started

### Step 1: Project Setup

Create a new project folder and files:

```bash
# Create project directory
mkdir student-management-lab
cd student-management-lab

# Create HTML file
touch index.html

# Create JavaScript modules
mkdir src
touch src/studentData.js
touch src/studentService.js
touch src/statistics.js
touch src/reportGenerator.js
touch src/main.js
```

### Step 2: HTML Structure

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management System - ES6+ Lab</title>
    <style>
        /* Add your CSS here */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .form-group {
            margin: 15px 0;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        button {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
            font-size: 16px;
        }
        button:hover {
            background: #c0392b;
        }
        .student-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            background: #f8f9fa;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .stat-card {
            background: #3498db;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎓 Student Management System</h1>
        <p>Master JavaScript ES6+ through building a real application</p>
        
        <!-- Student Form -->
        <div class="form-section">
            <h2>Add New Student</h2>
            <form id="studentForm">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="major">Major:</label>
                    <select id="major" required>
                        <option value="">Select Major</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="gpa">GPA:</label>
                    <input type="number" id="gpa" min="0" max="4" step="0.1" required>
                </div>
                <button type="submit">Add Student</button>
            </form>
        </div>

        <!-- Search and Filter -->
        <div class="search-section">
            <h2>Search & Filter</h2>
            <div class="form-group">
                <label for="searchInput">Search by name or major:</label>
                <input type="text" id="searchInput" placeholder="Enter name or major...">
            </div>
            <div class="form-group">
                <label for="gradeFilter">Filter by grade level:</label>
                <select id="gradeFilter">
                    <option value="">All Students</option>
                    <option value="A">A (3.7-4.0)</option>
                    <option value="B">B (3.0-3.6)</option>
                    <option value="C">C (2.0-2.9)</option>
                    <option value="F">F (0-1.9)</option>
                </select>
            </div>
        </div>

        <!-- Statistics Dashboard -->
        <div class="stats-section">
            <h2>Statistics Dashboard</h2>
            <div class="stats-grid" id="statsGrid">
                <!-- Statistics will be populated here -->
            </div>
        </div>

        <!-- Student List -->
        <div class="students-section">
            <h2>Students List</h2>
            <div id="studentsList">
                <!-- Students will be displayed here -->
            </div>
        </div>

        <!-- Actions -->
        <div class="actions-section">
            <button onclick="exportData()">Export Data as JSON</button>
            <button onclick="generateReport()">Generate Report</button>
            <button onclick="clearAllData()">Clear All Data</button>
        </div>
    </div>

    <script type="module" src="src/main.js"></script>
</body>
</html>
```

---

## 📝 Implementation Tasks

### Task 1: Student Data Module (`src/studentData.js`)

Create a module to manage student data using modern JavaScript features:

```javascript
// Sample implementation structure
export class StudentData {
    constructor() {
        this.students = [];
    }

    // Use arrow functions for methods
    addStudent = (student) => {
        // Implementation here
    };

    // Use destructuring in parameters
    searchStudents = ({ name, major }) => {
        // Implementation here
    };

    // Use array methods for filtering
    filterByGradeLevel = (level) => {
        // Implementation here
    };

    // Use template literals for formatting
    formatStudent = (student) => {
        // Implementation here
    };
}
```

**Requirements:**
- Use arrow functions for all methods
- Implement destructuring in function parameters
- Use template literals for string formatting
- Apply array methods (map, filter, find) for data manipulation

### Task 2: Statistics Service (`src/statistics.js`)

Create a statistics module using array methods and modern JavaScript:

```javascript
export class StatisticsService {
    // Use reduce() to calculate averages
    calculateAverageGPA = (students) => {
        // Implementation here
    };

    // Use reduce() to group data
    groupByMajor = (students) => {
        // Implementation here
    };

    // Use array methods for analysis
    findTopPerformers = (students, count = 5) => {
        // Implementation here
    };

    // Use destructuring and template literals
    generateStatsReport = (students) => {
        // Implementation here
    };
}
```

**Requirements:**
- Use `reduce()` for calculations and grouping
- Apply `map()`, `filter()`, and `sort()` for data analysis
- Use destructuring and template literals for report generation
- Implement error handling with try/catch

### Task 3: Async Data Service (`src/studentService.js`)

Create a service that simulates API calls using Promises and async/await:

```javascript
export class StudentService {
    // Simulate API delay
    delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Use async/await for data fetching
    fetchStudents = async () => {
        // Implementation here
    };

    // Use async/await with error handling
    saveStudent = async (student) => {
        // Implementation here
    };

    // Use Promise.all for parallel operations
    fetchStatistics = async () => {
        // Implementation here
    };
}
```

**Requirements:**
- Use `async/await` for all asynchronous operations
- Implement proper error handling with try/catch
- Use `Promise.all()` for parallel operations
- Simulate realistic API delays

### Task 4: Report Generator (`src/reportGenerator.js`)

Create a report generator using modern JavaScript features:

```javascript
export class ReportGenerator {
    // Use template literals for HTML generation
    generateStudentCard = (student) => {
        // Implementation here
    };

    // Use array methods and template literals
    generateStatisticsHTML = (stats) => {
        // Implementation here
    };

    // Use destructuring and spread operator
    exportToJSON = (data) => {
        // Implementation here
    };

    // Use template literals for formatted reports
    generateTextReport = (students, stats) => {
        // Implementation here
    };
}
```

**Requirements:**
- Use template literals for HTML generation
- Apply array methods for data transformation
- Use destructuring and spread operator for data manipulation
- Implement multiple export formats

### Task 5: Main Application (`src/main.js`)

Integrate all modules using ES6 imports and modern JavaScript patterns:

```javascript
// Use ES6 imports
import { StudentData } from './studentData.js';
import { StatisticsService } from './statistics.js';
import { StudentService } from './studentService.js';
import { ReportGenerator } from './reportGenerator.js';

// Use arrow functions for event handlers
const initializeApp = () => {
    // Implementation here
};

// Use async/await for initialization
const main = async () => {
    // Implementation here
};

// Start the application
main();
```

**Requirements:**
- Use ES6 module imports
- Implement arrow functions for event handlers
- Use async/await for initialization
- Apply modern JavaScript patterns throughout

---

## 🎯 Advanced Challenges

### Challenge 1: Advanced Array Manipulation
- Implement pagination using `slice()` and array methods
- Create a search function that searches across multiple fields
- Implement sorting by multiple criteria

### Challenge 2: Performance Optimization
- Use `useMemo`-like caching for expensive calculations
- Implement debouncing for search input
- Optimize large dataset rendering

### Challenge 3: Error Handling
- Implement comprehensive error handling
- Add user-friendly error messages
- Create fallback mechanisms for failed operations

---

## ✅ Success Criteria

Your implementation should demonstrate:

1. **Modern JavaScript Features**
   - ✅ Arrow functions used consistently
   - ✅ Destructuring in function parameters and assignments
   - ✅ Template literals for string formatting
   - ✅ Spread operator for object/array manipulation

2. **Array Methods Mastery**
   - ✅ `map()` for data transformation
   - ✅ `filter()` for data filtering
   - ✅ `reduce()` for calculations and grouping
   - ✅ `find()` for single item retrieval

3. **Async Programming**
   - ✅ Promises and async/await used correctly
   - ✅ Proper error handling with try/catch
   - ✅ Parallel operations with Promise.all()

4. **Code Organization**
   - ✅ ES6 modules used effectively
   - ✅ Clean separation of concerns
   - ✅ Reusable functions and classes

5. **User Experience**
   - ✅ Responsive and intuitive interface
   - ✅ Real-time search and filtering
   - ✅ Clear data visualization

---

## 🚀 Next Steps

After completing this lab:

1. **Review your code** - Look for opportunities to use more modern JavaScript features
2. **Test edge cases** - Handle empty data, invalid inputs, and error scenarios
3. **Optimize performance** - Look for ways to improve efficiency
4. **Prepare for Vue** - Notice how these patterns will be used in Vue components

**Ready for Vue?** → Proceed to [Lesson 1: Vue Fundamentals](../lesson1-fundamentals-setup/)

---

## 💡 Tips for Success

- **Start simple** - Get basic functionality working first
- **Use the browser console** - Debug and test your code interactively
- **Read error messages** - They often point to the exact issue
- **Experiment** - Try different approaches to solve problems
- **Use modern JavaScript** - Don't fall back to old patterns

**Remember**: This lab is about mastering JavaScript ES6+ features that are essential for Vue development. Focus on understanding the patterns, not just getting the code to work!
