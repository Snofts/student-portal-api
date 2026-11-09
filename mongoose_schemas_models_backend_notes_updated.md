# Mongoose, Schemas, Models, and Backend Integration

## Learning Objectives

By the end of this lesson, you should be able to:

- Explain what a database is and why applications need persistent storage.
- Explain MongoDB's databases, collections, and documents.
- Describe what Mongoose does and how it differs from MongoDB.
- Create Mongoose schemas, models, and documents.
- Connect an Express application to MongoDB.
- Implement CRUD operations using Mongoose.
- Explain asynchronous database operations using `async`, `await`, and `try...catch`.
- Understand basic document relationships and `populate()`.
- Build and test a basic Student API.

---

# Part 1: Understanding the Big Picture

## 1. What Problem Does a Database Solve?

Imagine you are building a school management application. It should allow a school to:

- Register students.
- View all registered students.
- Update students' details.
- Delete student records.
- Search for students by email or ID.
- Assign students to courses.
- Store examination results.

You could temporarily store student information in a JavaScript array:

```javascript
const students = [
  {
    name: "Ada",
    email: "ada@example.com",
    department: "Computer Science",
    level: 100
  },
  {
    name: "Tunde",
    email: "tunde@example.com",
    department: "Mathematics",
    level: 200
  }
];
```

You can retrieve a student:

```javascript
console.log(students[0]);
```

You can add another student:

```javascript
students.push({
  name: "Mary",
  email: "mary@example.com",
  department: "Physics",
  level: 100
});
```

This works, but the data exists only in your application's memory. If the server restarts, the array returns to its original state when the application starts again.

A database provides persistent storage, so information remains available after the server restarts.

### What Is a Database?

A database is an organised system for storing and retrieving data.

A school database might store:

- Student names.
- Email addresses.
- Departments.
- Academic levels.
- Course registrations.
- Examination results.

**Teaching question:** If I register 100 students in an application and then restart the server, should I have to register those students again?

**Answer:** No. Their information should be stored in a database.

---

# Part 2: Understanding MongoDB

## 2. What Is MongoDB?

MongoDB is a document-oriented NoSQL database. It stores information in documents rather than organising all data into relational tables.

### Relational Database Structure

A SQL database might store students in a table:

| id | name | email | level |
|---|---|---|---:|
| 1 | Ada | ada@example.com | 100 |
| 2 | Tunde | tunde@example.com | 200 |
| 3 | Mary | mary@example.com | 100 |

Each row represents one student, and each column represents an attribute.

### MongoDB Structure

MongoDB stores each student as a document:

```javascript
{
  _id: ObjectId("64a1b2c3d4e5f67890123456"),
  name: "Ada",
  email: "ada@example.com",
  department: "Computer Science",
  level: 100
}
```

MongoDB stores documents in BSON, a binary representation of JSON-like data that supports additional data types.

### Important Terminology

| MongoDB concept | Meaning | School application example |
|---|---|---|
| Database | Contains collections | `schoolDB` |
| Collection | Contains related documents | `students` |
| Document | Represents an individual record | Ada's student record |

The hierarchy looks like this:

```text
MongoDB Server
└── schoolDB
    ├── students
    │   ├── Ada's document
    │   ├── Tunde's document
    │   └── Mary's document
    ├── courses
    │   ├── JavaScript course
    │   └── Database course
    └── lecturers
        ├── Lecturer A's document
        └── Lecturer B's document
```

## 3. What Is `_id`?

Every standard MongoDB document has a unique `_id` field. If you do not provide one, MongoDB normally generates an `ObjectId`.

```javascript
{
  _id: ObjectId("64a1b2c3d4e5f67890123456"),
  name: "Ada",
  level: 100
}
```

The `_id` identifies the document. Your backend can use it to retrieve, update, or delete the student.

```javascript
Student.findById("64a1b2c3d4e5f67890123456");
```

The example ID is illustrative. An actual query must use a valid ID.

---

# Part 3: What Is Mongoose?

## 4. Understanding Mongoose

Mongoose is an Object Data Modeling (ODM) library for Node.js. It provides a structured way to work with MongoDB.

You can use MongoDB's official Node.js driver directly, but Mongoose provides useful features such as:

- Schema definitions.
- Type casting.
- Validation.
- Models and document methods.
- Middleware.
- Convenient query methods.
- Support for document references and population.

### A Simple Analogy

Imagine MongoDB is a warehouse where you store products. Mongoose is a system that helps define how those products should be described, checks whether information follows your rules, and provides convenient methods for managing the records.

### Installing Mongoose

```bash
npm install mongoose
```

For an Express application, you will commonly also install:

```bash
npm install express dotenv
```

Import Mongoose using ES module syntax:

```javascript
import mongoose from "mongoose";
```

If your project uses ES modules, include `"type": "module"` in `package.json`:

```json
{
  "type": "module"
}
```

If `package.json` already contains other properties, keep them and add `"type": "module"`.

### What Does Mongoose Help Us Do?

1. **Define document structures:** Describe the fields a student document should contain.
2. **Validate data:** Require a name, restrict academic levels, and validate email formatting.
3. **Cast data types:** Convert certain values to the types specified in the schema.
4. **Perform database operations:** Create, find, update, and delete records.
5. **Work asynchronously:** Use `async/await` to wait for database operations.
6. **Define relationships:** Reference other documents, such as connecting students to courses.

---

# Part 4: What Is a Mongoose Schema?

## 5. Understanding Schemas

A Mongoose schema defines the structure, types, and rules for documents associated with a model.

Suppose every student must have a name, email, department, and academic level.

```javascript
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  level: {
    type: Number,
    required: true
  }
});
```

### Understanding the Code

```javascript
import mongoose from "mongoose";
```

This imports Mongoose so you can create schemas, models, and database connections.

```javascript
const studentSchema = new mongoose.Schema({
```

- `mongoose.Schema` is the schema constructor.
- `new` creates a schema instance.
- The object passed into the constructor defines fields and their rules.
- `studentSchema` is simply the variable name; you can choose another meaningful name.

### The `name` Field

```javascript
name: {
  type: String,
  required: true
}
```

- `type: String` specifies that the name should be a string.
- `required: true` makes the field required during normal Mongoose document validation.

### The `email` Field

```javascript
email: {
  type: String,
  required: true
}
```

This requires a string, but it does not automatically check whether the string is a valid email address.

A basic format check can be added:

```javascript
email: {
  type: String,
  required: true,
  match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}
```

This is only a basic format check. It does not prove that the address exists or can receive messages.

### The `level` Field

```javascript
level: {
  type: Number,
  required: true
}
```

This specifies a number. Mongoose can cast some values to numbers; for example, `"200"` can generally be cast to `200`. A value such as `"hello"` cannot be cast to a number and will produce a casting error when processed.

---

## 6. Common Mongoose Schema Types

| Schema type | Purpose | Example |
|---|---|---|
| `String` | Text | `"Ada"` |
| `Number` | Numeric values | `100` |
| `Boolean` | True or false | `true` |
| `Date` | Dates and times | `new Date()` |
| `Array` | Lists of values | `["JavaScript", "Node.js"]` |
| `ObjectId` | MongoDB document identifiers | `mongoose.Schema.Types.ObjectId` |
| `Mixed` | Flexible values of different types | `mongoose.Schema.Types.Mixed` |
| `Map` | Key-value collections | `new Map()` |

### String

```javascript
name: {
  type: String,
  required: true
}
```

Example value: `"Mary"`.

### Number

```javascript
age: {
  type: Number,
  min: 16,
  max: 100
}
```

This sets a numeric range from 16 to 100, inclusive.

### Boolean

```javascript
isActive: {
  type: Boolean,
  default: true
}
```

If the value is not supplied, Mongoose can use `true` as the default.

### Date

```javascript
registrationDate: {
  type: Date,
  default: Date.now
}
```

Using `Date.now` lets Mongoose evaluate the function when applying the default. Do not write `Date.now()` if you want a fresh date for each new document.

### Array

```javascript
courses: {
  type: [String],
  default: []
}
```

Example:

```javascript
courses: ["JavaScript", "Node.js", "MongoDB"]
```

### ObjectId

```javascript
department: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Department"
}
```

This allows the field to store the identifier of a department document. Mongoose can later use `populate()` to retrieve the referenced department.

---

# Part 5: Understanding Schema Options

## 7. `required: true`

```javascript
name: {
  type: String,
  required: true
}
```

The field is required during normal Mongoose document validation. A missing name will fail required validation.

However, `required` alone does not guarantee that the value is meaningful. Additional validators may be needed.

## 8. `trim: true`

```javascript
name: {
  type: String,
  required: true,
  trim: true
}
```

This removes whitespace from the beginning and end of a string.

Input:

```javascript
{
  name: "   Ada Lovelace   "
}
```

Stored value:

```javascript
{
  name: "Ada Lovelace"
}
```

It does not remove spaces between words.

## 9. `lowercase: true`

```javascript
email: {
  type: String,
  required: true,
  lowercase: true
}
```

Input:

```javascript
{
  email: "ADA@EXAMPLE.COM"
}
```

Normalised value:

```javascript
{
  email: "ada@example.com"
}
```

Lowercase conversion does not prove that the email address exists.

## 10. `unique: true`

```javascript
email: {
  type: String,
  required: true,
  unique: true
}
```

**Important:** `unique: true` is not an ordinary Mongoose validator. It tells Mongoose to define a unique database index for the field.

If the unique index exists, MongoDB rejects duplicate indexed values.

For example, if this document already exists:

```javascript
{
  name: "Ada",
  email: "ada@example.com"
}
```

Trying to create another student with the same email will typically produce a duplicate-key error.

```javascript
try {
  const student = await Student.create({
    name: "Mary",
    email: "ada@example.com",
    department: "Physics",
    level: 100
  });

  console.log(student);
} catch (error) {
  if (error.code === 11000) {
    console.log("A student with this email already exists.");
  } else {
    console.error(error);
  }
}
```

Remember:

- The unique index must exist for MongoDB to enforce uniqueness.
- Existing duplicates can prevent index creation.
- `unique: true` does not validate email format.
- Duplicate-key errors need their own error handling.

## 11. `min`, `max`, and `enum`

Numeric range validation:

```javascript
level: {
  type: Number,
  required: true,
  min: 100,
  max: 600
}
```

| Value | Result |
|---|---|
| `100` | Passes range validation |
| `200` | Passes range validation |
| `600` | Passes range validation |
| `50` | Fails minimum validation |
| `700` | Fails maximum validation |

This checks a range, not whether the level is one of the school's recognised academic levels.

To restrict values to specific levels:

```javascript
level: {
  type: Number,
  required: true,
  enum: [100, 200, 300, 400, 500]
}
```

Now `250` fails enum validation.

## 12. `default`

```javascript
isActive: {
  type: Boolean,
  default: true
}
```

Mongoose applies the default when the field is omitted or `undefined`.

Defaults are useful for account status, roles, and other fields that need a predictable initial value.

## 13. `timestamps: true`

```javascript
const studentSchema = new mongoose.Schema(
  {
    name: String,
    email: String
  },
  {
    timestamps: true
  }
);
```

Mongoose automatically maintains:

- `createdAt`: when the document was created.
- `updatedAt`: when the document was last updated through operations that maintain Mongoose timestamps.

Example document:

```javascript
{
  _id: ObjectId("..."),
  name: "Ada",
  email: "ada@example.com",
  createdAt: "2026-10-20T08:00:00.000Z",
  updatedAt: "2026-10-20T08:00:00.000Z"
}
```

The values are illustrative.

---

# Part 6: What Is a Mongoose Model?

## 14. Understanding Models

A Mongoose model is created by compiling a schema. It provides methods for interacting with the corresponding MongoDB collection.

A useful analogy:

- **Schema:** The architectural plan and rules.
- **Model:** The tool used to create and manage records according to those rules.
- **Document:** An individual record created using the model.

### Creating a Model

First, define the schema:

```javascript
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  level: {
    type: Number,
    required: true
  }
});
```

Then compile it into a model:

```javascript
const Student = mongoose.model("Student", studentSchema);
```

The first argument is the model name, `"Student"`. The second argument is the schema, `studentSchema`.

By default, Mongoose maps the model name `Student` to a collection named `students`.

You can explicitly specify a collection name:

```javascript
const Student = mongoose.model(
  "Student",
  studentSchema,
  "school_students"
);
```

In this case, Mongoose uses the `school_students` collection.

### Exporting the Model

In `models/Student.js`:

```javascript
export default Student;
```

You can import it in another file:

```javascript
import Student from "./models/Student.js";
```

### Complete Student Model

```javascript
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },

    department: {
      type: String,
      required: true,
      trim: true
    },

    level: {
      type: Number,
      required: true,
      enum: [100, 200, 300, 400, 500]
    }
  },
  {
    timestamps: true
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
```

---

# Part 7: What Is a Mongoose Document?

## 15. Understanding Documents

A document is an individual record associated with a model.

```javascript
const student = new Student({
  name: "Ada Lovelace",
  email: "ada@example.com",
  department: "Computer Science",
  level: 100
});
```

This creates a Mongoose document instance in application memory. It does not necessarily save the document to MongoDB.

To save it:

```javascript
await student.save();
```

### Another Way to Create a Document

```javascript
const student = await Student.create({
  name: "Ada Lovelace",
  email: "ada@example.com",
  department: "Computer Science",
  level: 100
});
```

`create()` constructs and saves the document.

### Schema vs. Model vs. Document

| Concept | Example | Purpose |
|---|---|---|
| Schema | `studentSchema` | Defines structure and rules |
| Model | `Student` | Provides database operation methods |
| Document | `student` | Represents an individual student record |

---

# Part 8: How Mongoose Works in a Backend Application

## 16. Understanding the Architecture

Imagine a student uses your frontend to register.

The frontend submits:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "department": "Computer Science",
  "level": 100
}
```

The architecture looks like this:

```text
FRONTEND
React application
     |
     | HTTP POST request
     v
EXPRESS BACKEND
     |
     | Route receives the request
     v
CONTROLLER / ROUTE HANDLER
     |
     | Uses the Student model
     v
MONGOOSE
     |
     | Applies schema behaviour and
     | performs database operations
     v
MONGODB
     |
     | Stores the student document
     v
MONGOOSE / EXPRESS
     |
     | Returns JSON response
     v
FRONTEND
```

### Step 1: The Frontend Sends a Request

The frontend sends an HTTP request to:

```text
POST /api/students
```

### Step 2: Express Receives the Request

```javascript
app.post("/api/students", async (req, res) => {
  // Handle student registration
});
```

`req` represents the incoming request, and `res` is used to send a response.

### Step 3: Express Parses the Request Body

Include this middleware before the routes that need it:

```javascript
app.use(express.json());
```

It parses incoming JSON request bodies and makes the parsed data available through `req.body` when the request has an appropriate content type.

The client should normally send:

```text
Content-Type: application/json
```

### Step 4: The Route Uses the Model

```javascript
const student = await Student.create(req.body);
```

Mongoose applies relevant schema behaviour, including type casting and validation, and saves the document if the operation succeeds.

### Step 5: MongoDB Stores the Document

The student is persisted in MongoDB.

### Step 6: Express Sends a Response

```javascript
res.status(201).json({
  message: "Student registered successfully",
  data: student
});
```

**Key concept:** Express handles HTTP requests and responses. Mongoose provides the application's interface to MongoDB. MongoDB stores the data.

The frontend should communicate with the backend rather than connecting directly to MongoDB using exposed database credentials.

---

# Part 9: Connecting Mongoose to MongoDB

## 17. Why Do We Need a Connection?

Defining a schema and model does not establish a database connection. Your application must connect to a MongoDB server before it can successfully perform database operations.

You can use:

1. A local MongoDB installation.
2. A cloud-hosted MongoDB database, such as MongoDB Atlas.

### Step 1: Create a `.env` File

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/schoolDB
```

This is a placeholder connection string. Replace the placeholders with the details for your MongoDB deployment.

Never publish your database password or commit `.env` to GitHub.

Add `.env` to `.gitignore`.

### Step 2: Install Dependencies

```bash
npm install express mongoose dotenv
```

### Step 3: Connect to MongoDB

Create `server.js`:

```javascript
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
```

### Understanding the Important Parts

- `dotenv.config()` loads environment variables from `.env` into `process.env`.
- `mongoose.connect()` establishes a connection to MongoDB.
- `await` waits for the connection attempt to settle.
- `app.listen()` starts the HTTP server.

Starting the server after the database connection succeeds helps prevent the application from accepting requests before its database is ready.

---

# Part 10: CRUD Operations with Mongoose

CRUD stands for:

- **C**reate
- **R**ead
- **U**pdate
- **D**elete

## 18. Create: Adding a Student

```javascript
const student = await Student.create({
  name: "Ada Lovelace",
  email: "ada@example.com",
  department: "Computer Science",
  level: 100
});
```

`create()` creates and saves a document. The returned value is a Mongoose document representing the newly created student.

### POST Endpoint

```javascript
app.post("/api/students", async (req, res) => {
  try {
    const { name, email, department, level } = req.body;

    const student = await Student.create({
      name,
      email,
      department,
      level
    });

    res.status(201).json({
      message: "Student registered successfully",
      data: student
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to register student",
      error: error.message
    });
  }
});
```

This route:

1. Receives a POST request.
2. Reads data from `req.body`.
3. Passes the accepted fields to the `Student` model.
4. Waits for MongoDB to save the document.
5. Returns the created document or an error.

`201 Created` indicates that the request successfully created a resource.

Do not blindly trust all fields submitted by the frontend. Select permitted fields, validate input, and enforce authentication and authorisation where needed.

## 19. Read: Retrieving Students

### Retrieve All Students

```javascript
const students = await Student.find();
```

With no filter, this normally returns all documents in the collection.

### Find by Department

```javascript
const students = await Student.find({
  department: "Computer Science"
});
```

### Find by Level

```javascript
const students = await Student.find({
  level: 100
});
```

### Find One Student

```javascript
const student = await Student.findOne({
  email: "ada@example.com"
});
```

`findOne()` returns the first matching document or `null` if none matches.

### Find by ID

```javascript
const student = await Student.findById(studentId);
```

If no matching document exists, the result is `null`. An invalid ID format can produce a casting error.

### GET Endpoint

```javascript
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve students",
      error: error.message
    });
  }
});
```

## 20. Update: Changing Student Information

```javascript
const updatedStudent = await Student.findByIdAndUpdate(
  studentId,
  {
    level: 200
  },
  {
    new: true,
    runValidators: true
  }
);
```

- `studentId` identifies the student.
- `{ level: 200 }` contains the change.
- `new: true` requests the updated document as the result.
- `runValidators: true` enables relevant update validators.

### PATCH Endpoint

```javascript
app.patch("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      data: student
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to update student",
      error: error.message
    });
  }
});
```

### What Does `req.params.id` Mean?

For this request:

```text
PATCH /api/students/64a1b2c3d4e5f67890123456
```

And this route:

```javascript
app.patch("/api/students/:id", ...);
```

Express makes the ID available through:

```javascript
req.params.id
```

PATCH is commonly used to modify selected fields of an existing resource.

For more controlled updates, you can retrieve the document, change its properties, and call `.save()`. This runs normal document validation and relevant document middleware.

## 21. Delete: Removing a Student

```javascript
const deletedStudent = await Student.findByIdAndDelete(studentId);
```

This deletes the matching document if it exists. If there is no match, the result is `null`.

### DELETE Endpoint

```javascript
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to delete student",
      error: error.message
    });
  }
});
```

### CRUD Summary

| Operation | HTTP method | Endpoint | Mongoose method |
|---|---|---|---|
| Create | POST | `/api/students` | `Student.create()` |
| Read all | GET | `/api/students` | `Student.find()` |
| Read one | GET | `/api/students/:id` | `Student.findById()` |
| Update | PATCH | `/api/students/:id` | `Student.findByIdAndUpdate()` |
| Delete | DELETE | `/api/students/:id` | `Student.findByIdAndDelete()` |

---

# Part 11: Understanding `async`, `await`, and Promises

## 22. Why Do We Need Asynchronous Code?

Database operations can take time because the application may need to send a network request, wait for MongoDB to execute a query, and receive the result.

Consider:

```javascript
const students = Student.find();

console.log(students);
```

`Student.find()` returns a Mongoose Query object that is thenable. When awaited or used with `.then()`, it executes and resolves with the query result.

Without awaiting it, `students` is not the array of retrieved student documents.

### Using `await`

```javascript
const students = await Student.find();

console.log(students);
```

`await` waits for the query result. It must be used inside an `async` function unless top-level `await` is supported in the current ES module context.

### Understanding `async`

```javascript
async function getStudents() {
  const students = await Student.find();

  return students;
}
```

Arrow-function version:

```javascript
const getStudents = async () => {
  const students = await Student.find();

  return students;
};
```

### Understanding `try...catch`

Database operations can fail because of validation errors, duplicate-key constraints, invalid identifiers, or connection problems.

```javascript
const getStudents = async () => {
  try {
    const students = await Student.find();

    console.log(students);
  } catch (error) {
    console.error("Error retrieving students:", error.message);
  }
};
```

The `try` block contains the operation. If an awaited operation throws an error or rejects, execution moves to `catch`.

### Using `.then()` and `.catch()`

```javascript
Student.find()
  .then((students) => {
    console.log(students);
  })
  .catch((error) => {
    console.error(error.message);
  });
```

### Using `async/await`

```javascript
const getStudents = async () => {
  try {
    const students = await Student.find();

    console.log(students);
  } catch (error) {
    console.error(error.message);
  }
};

getStudents();
```

Both approaches work. Many developers prefer `async/await` because it often makes asynchronous control flow easier to read.

**Important distinction:** ES6 modules and `async/await` are separate JavaScript features.

- `import` and `export` are module syntax.
- `async` and `await` are asynchronous programming syntax.

They are commonly used together, but one does not depend on the other.

---

# Part 12: Mongoose vs. MongoDB

## 23. Understanding the Difference

| MongoDB | Mongoose |
|---|---|
| A database management system | An ODM library for Node.js |
| Stores documents | Provides an interface for working with MongoDB documents |
| Manages collections and indexes | Defines schemas and models |
| Enforces database-level constraints such as unique indexes | Provides application-level validation and schema behaviour |
| Can be accessed through the official Node.js driver | Uses the MongoDB driver beneath its higher-level API |

### An Analogy

Imagine a library:

- MongoDB is the place where books are stored.
- A Mongoose schema describes the rules for cataloguing books.
- A Mongoose model provides methods to manage those records.
- A Mongoose document represents one particular book record.

### Can We Use MongoDB Without Mongoose?

Yes. You can use the official MongoDB Node.js driver directly. Mongoose is optional.

### Does Mongoose Replace MongoDB?

No. Mongoose provides a convenient layer for interacting with MongoDB from Node.js. It does not replace the database.

---

# Part 13: Understanding Validation Properly

## 24. What Happens When Invalid Data Is Submitted?

Suppose you have:

```javascript
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  level: {
    type: Number,
    required: true,
    min: 100,
    max: 500
  }
});
```

Now the client submits:

```json
{
  "name": "Ada",
  "level": 50
}
```

The level violates the minimum validation rule.

```javascript
try {
  const student = await Student.create({
    name: "Ada",
    level: 50
  });
} catch (error) {
  console.log(error.name);
  console.log(error.message);
}
```

For a normal document validation failure, `error.name` is typically `ValidationError`.

Mongoose checks whether the document satisfies the schema rules before completing a normal save operation.

### Does Mongoose Reject Every Invalid Input?

No. A schema only enforces the rules you define and the rules built into the relevant Mongoose operations.

For example:

```javascript
name: {
  type: String,
  required: true
}
```

does not guarantee that the name belongs to a real person or meets every requirement of your application.

### Adding Custom Validation

```javascript
name: {
  type: String,
  required: true,
  minlength: 2,
  maxlength: 100
}
```

A basic regular-expression example:

```javascript
name: {
  type: String,
  required: true,
  match: /^[A-Za-z ]+$/
}
```

This pattern permits only basic English letters and spaces, so it is not appropriate for every real-world name. Choose validation rules based on your application's needs.

---

# Part 14: Relationships Between Documents

## 25. What If a Student Takes Several Courses?

Suppose your application has two collections:

```text
students
courses
```

A student may register for several courses, and a course may have many students.

There are different ways to represent these relationships in MongoDB.

### Option A: Store Course Names in the Student Document

```javascript
{
  name: "Ada",
  email: "ada@example.com",
  courses: [
    "JavaScript",
    "Node.js",
    "MongoDB"
  ]
}
```

This is straightforward when you only need a simple list of course names.

However, if each course has a lecturer, fee, schedule, credit units, and description, duplicating course details in every student document can become difficult to maintain.

### Option B: Use References

Create a separate Course schema:

```javascript
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  code: {
    type: String,
    required: true,
    unique: true
  }
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
```

Now the student schema can reference course documents:

```javascript
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    }
  ]
});
```

The `courses` field is an array. Each element stores a course document's ObjectId.

The `ref: "Course"` setting tells Mongoose which model the reference is associated with.

A student document might contain:

```javascript
{
  name: "Ada",
  email: "ada@example.com",
  courses: [
    ObjectId("64a1b2c3d4e5f67890123456"),
    ObjectId("64a1b2c3d4e5f67890123457")
  ]
}
```

Those IDs refer to separate course documents.

### What Is `populate()`?

By default, the `courses` array contains identifiers rather than complete course documents.

Use `populate()` to retrieve the referenced documents:

```javascript
const student = await Student.findById(studentId)
  .populate("courses");
```

The result can include course information, such as titles and codes, instead of only IDs.

Conceptually, it might look like:

```javascript
{
  name: "Ada",
  email: "ada@example.com",
  courses: [
    {
      _id: "64a1b2c3d4e5f67890123456",
      title: "JavaScript",
      code: "JS101"
    },
    {
      _id: "64a1b2c3d4e5f67890123457",
      title: "Node.js",
      code: "ND101"
    }
  ]
}
```

The values are illustrative.

**Important:** `populate()` does not automatically enforce foreign-key constraints. If a course is deleted, a student may still contain its old ID unless your application handles that situation.

### What If Every Student Receives a Different Grade for Each Course?

The grade belongs to the relationship between a particular student and a particular course. A separate enrolment model can represent this relationship.

```javascript
const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    grade: {
      type: Number,
      min: 0,
      max: 100
    },

    status: {
      type: String,
      enum: ["registered", "completed", "withdrawn"],
      default: "registered"
    }
  },
  {
    timestamps: true
  }
);
```

You can add a compound unique index to prevent a student from being enrolled in the same course twice:

```javascript
enrollmentSchema.index(
  {
    student: 1,
    course: 1
  },
  {
    unique: true
  }
);
```

---

# Part 15: Understanding Mongoose Queries

## 26. Searching for Specific Records

Retrieve all students:

```javascript
const students = await Student.find();
```

Find Computer Science students in level 200:

```javascript
const students = await Student.find({
  department: "Computer Science",
  level: 200
});
```

Both conditions must match.

### Find Students at Level 200 or Above

```javascript
const students = await Student.find({
  level: {
    $gte: 200
  }
});
```

`$gte` means greater than or equal to.

Common MongoDB query operators:

| Operator | Meaning |
|---|---|
| `$gt` | Greater than |
| `$gte` | Greater than or equal to |
| `$lt` | Less than |
| `$lte` | Less than or equal to |
| `$ne` | Not equal to |
| `$in` | Matches any value in a supplied array |

Find students in levels 100 and 200:

```javascript
const students = await Student.find({
  level: {
    $in: [100, 200]
  }
});
```

### Selecting Specific Fields

```javascript
const students = await Student.find()
  .select("name email");
```

This returns the selected fields, along with `_id` by default.

### Limiting Results

```javascript
const students = await Student.find()
  .limit(10);
```

This returns at most 10 matching documents.

### Sorting Results

Ascending order:

```javascript
const students = await Student.find()
  .sort({ name: 1 });
```

Descending order:

```javascript
const students = await Student.find()
  .sort({ name: -1 });
```

These methods are useful for search pages, admin dashboards, and paginated lists.

---

# Part 16: Common Mistakes Beginners Make

## 27. Forgetting `express.json()`

If `req.body` is `undefined`, destructuring it will throw an error.

Make sure this middleware is registered before the routes that need it:

```javascript
app.use(express.json());
```

Also ensure the client sends valid JSON with an appropriate content type.

## 28. Forgetting `await`

Incorrect:

```javascript
const students = Student.find();

res.json(students);
```

Correct:

```javascript
const students = await Student.find();

res.json(students);
```

The query must be awaited before you send the retrieved result.

## 29. Defining a Schema but Not Creating a Model

A schema alone does not provide the normal model methods such as `create()` and `find()`.

Compile the schema:

```javascript
const Student = mongoose.model("Student", studentSchema);
```

## 30. Forgetting to Connect to MongoDB

Actual database operations require a working connection:

```javascript
await mongoose.connect(process.env.MONGODB_URI);
```

Connect before starting to serve requests that depend on the database.

## 31. Assuming `unique` Is a Validator

MongoDB enforces uniqueness through a unique index. Duplicate-key errors need their own handling.

## 32. Assuming Updates Always Run Every Validator

Use `runValidators: true` where appropriate:

```javascript
await Student.findByIdAndUpdate(id, req.body, {
  new: true,
  runValidators: true
});
```

For complex updates, consider loading the document, modifying it, and calling `.save()`.

## 33. Not Checking Whether a Document Exists

```javascript
const student = await Student.findByIdAndDelete(id);

if (!student) {
  return res.status(404).json({
    message: "Student not found"
  });
}
```

Check the result before reporting success.

## 34. Exposing Raw Database Errors

Log useful diagnostic information on the server, but avoid exposing connection strings, sensitive information, or internal database details in production responses.

## 35. Trusting Every Field Sent by the Frontend

Select accepted fields, validate input, and enforce authentication and authorisation where required.

Mongoose validation is one layer of protection, not a replacement for application security.

---

# Part 17: Complete Mini Project — Student API

## 36. Project Structure

```text
student-api/
├── models/
│   └── Student.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

This structure is intentionally small for teaching. As the project grows, routes and controllers can be separated into their own folders.

## 37. Initialise the Project

```bash
npm init -y
npm install express mongoose dotenv
```

Add `"type": "module"` to `package.json`.

Example:

```json
{
  "name": "student-api",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

The installed package versions will be recorded in your actual `package.json`.

## 38. Create the `.env` File

```env
PORT=5000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
```

Replace the placeholder with your actual connection string. Do not commit this file.

## 39. Create `.gitignore`

```gitignore
node_modules/
.env
```

## 40. Create the Student Model

Create `models/Student.js`:

```javascript
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address"
      ]
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true
    },

    level: {
      type: Number,
      required: [true, "Academic level is required"],
      enum: [100, 200, 300, 400, 500]
    }
  },
  {
    timestamps: true
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
```

This file contains:

1. A Mongoose import.
2. A schema definition.
3. Field types.
4. Required-field validation.
5. String transformations.
6. Email-format validation.
7. An enum for academic levels.
8. Timestamps.
9. Model compilation.
10. A default export.

## 41. Create the Express Server

Create `server.js`:

```javascript
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import Student from "./models/Student.js";

dotenv.config();

const app = express();

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Student API is running"
  });
});

// CREATE: Register a student
app.post("/api/students", async (req, res) => {
  try {
    const { name, email, department, level } = req.body;

    const student = await Student.create({
      name,
      email,
      department,
      level
    });

    res.status(201).json({
      message: "Student registered successfully",
      data: student
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A student with this email already exists"
      });
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        message: "Invalid student information",
        error: error.message
      });
    }

    res.status(500).json({
      message: "An error occurred while registering the student"
    });
  }
});

// READ: Get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve students"
    });
  }
});

// READ: Get one student
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      data: student
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    res.status(500).json({
      message: "Unable to retrieve student"
    });
  }
});

// UPDATE: Update a student
app.patch("/api/students/:id", async (req, res) => {
  try {
    const allowedFields = ["name", "email", "department", "level"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one valid field to update"
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      data: student
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A student with this email already exists"
      });
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        message: "Invalid update information",
        error: error.message
      });
    }

    res.status(500).json({
      message: "Unable to update student"
    });
  }
});

// DELETE: Delete a student
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    res.status(500).json({
      message: "Unable to delete student"
    });
  }
});

// Start the server after connecting to MongoDB
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
```

This is a teaching project, not a complete production-ready application. A production API should also implement stronger request validation, authentication and authorisation where required, rate limiting, centralised error handling, and appropriate logging.

## 42. Start the Application

```bash
npm run dev
```

If the database connection succeeds, you should see messages similar to:

```text
MongoDB connected successfully
Server running on port 5000
```

If the connection fails, check your connection string, database credentials, network access rules, and whether your MongoDB deployment is available.

---

# Part 18: Testing the API with Postman

## 43. Register a Student

Set the method to `POST` and use:

```text
http://localhost:5000/api/students
```

In Postman, select **Body → raw → JSON** and submit:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "department": "Computer Science",
  "level": 100
}
```

If successful, the API returns a `201 Created` response containing the new student.

## 44. Retrieve All Students

Set the method to `GET`:

```text
http://localhost:5000/api/students
```

You should receive a JSON response containing the student records.

## 45. Retrieve One Student

Copy the `_id` from the response and use:

```text
http://localhost:5000/api/students/YOUR_STUDENT_ID
```

Replace `YOUR_STUDENT_ID` with the actual ID returned by MongoDB.

## 46. Update a Student

Set the method to `PATCH` and use:

```text
http://localhost:5000/api/students/YOUR_STUDENT_ID
```

Submit:

```json
{
  "level": 200
}
```

The endpoint should return the updated student.

## 47. Delete a Student

Set the method to `DELETE` and use:

```text
http://localhost:5000/api/students/YOUR_STUDENT_ID
```

The student should be deleted if the ID exists. Send another GET request to confirm that the record is no longer returned.

---

# Part 19: How to Teach This Topic Effectively

## 48. Suggested Teaching Sequence

| Stage | Topic | What students should understand |
|---|---|---|
| 1 | Database fundamentals | Why applications need persistent storage |
| 2 | MongoDB | Databases, collections, documents, and `_id` |
| 3 | Mongoose | Why an ODM is useful |
| 4 | Schemas | Field types, required fields, defaults, and validation |
| 5 | Models | How schemas become usable database interfaces |
| 6 | Documents | How individual records are created and saved |
| 7 | Connections | How Node.js connects to MongoDB |
| 8 | Asynchronous code | Promises, `async`, `await`, and `try...catch` |
| 9 | CRUD | Creating, reading, updating, and deleting records |
| 10 | Relationships | References, `ObjectId`, and `populate()` |
| 11 | Error handling | Validation errors, duplicate keys, and missing records |
| 12 | Mini project | Build and test a Student API |

### The Three Most Important Concepts

**1. A schema defines the rules.**

Students should understand `type`, `required`, `enum`, `default`, and `timestamps`.

**2. A model provides the operations.**

Students should understand `create()`, `find()`, `findById()`, and `findByIdAndDelete()`.

**3. A document represents one record.**

Students should know that `new Student({...})` creates a Mongoose document instance, while `Student.create({...})` creates and saves a document.

---

# Part 20: Questions to Review Before Teaching

Try answering these questions without looking back at the notes.

## Understanding Databases

1. Why is a database preferable to a JavaScript array for storing student records?
2. What is the difference between a database, a collection, and a document?
3. What is the purpose of MongoDB's `_id` field?

## Understanding Mongoose

4. What is Mongoose?
5. What is the difference between MongoDB and Mongoose?
6. Can you use MongoDB without Mongoose?
7. What does a Mongoose schema define?
8. What is a Mongoose model?
9. What is a Mongoose document?
10. Why do we export a model from its file?

## Understanding Validation

11. What does `required: true` do?
12. What is the difference between `min` and `enum`?
13. What does `trim: true` do?
14. Why is `unique: true` not an ordinary Mongoose validator?
15. Why should we validate incoming data even when we have a schema?

## Understanding the Backend

16. Why do we need `mongoose.connect()`?
17. What does `express.json()` do?
18. Why do we use `await` with database operations?
19. What is the difference between `Student.find()` and `Student.findById()`?
20. Why should an update operation use `runValidators: true` when appropriate?
21. What should an API return when a student does not exist?
22. Why should database credentials never be exposed to the frontend?

## Practical Assessment

23. Create a `Course` schema with `title`, `code`, and `creditUnits`.
24. Create a `Course` model from that schema.
25. Write a POST endpoint that creates a course.
26. Write a GET endpoint that retrieves all courses.
27. Write a PATCH endpoint that updates a course by ID.
28. Write a DELETE endpoint that deletes a course by ID.
29. Add validation to prevent invalid credit units.
30. Explain how a POST request travels from the frontend through Express and Mongoose to MongoDB.

---

# Final Summary: The Mental Model to Remember

```text
1. DATABASE
   MongoDB stores the application's data.

          ↓

2. SCHEMA
   Defines the expected document structure and rules.

          ↓

3. MODEL
   Compiles the schema and provides database operations.

          ↓

4. DOCUMENT
   Represents an individual record.

          ↓

5. EXPRESS ROUTE / CONTROLLER
   Receives the request and uses the model.

          ↓

6. MONGOOSE QUERY
   Executes the requested database operation.

          ↓

7. MONGODB
   Stores, retrieves, updates, or deletes the data.

          ↓

8. HTTP RESPONSE
   Express returns the result to the client.
```

Remember:

- **Schema:** Describes the rules.
- **Model:** Provides the interface.
- **Document:** Represents the data.

If you can explain that distinction clearly, demonstrate CRUD operations, and trace a request from Express to MongoDB and back, you have a strong foundation for teaching Mongoose to beginner backend developers.


---

# Part 12: Additional Questions About Mongoose and Backend Development

This section answers five common questions that often come up when building an Express and Mongoose application.

## 44. Is There Documentation for Mongoose Schemas?

Yes. Mongoose has official documentation explaining schemas, schema types, validation, defaults, indexes, middleware, and other schema features.

- **Mongoose Schemas guide:** https://mongoosejs.com/docs/guide.html
- **SchemaTypes guide:** https://mongoosejs.com/docs/schematypes.html
- **Validation guide:** https://mongoosejs.com/docs/validation.html
- **Models guide:** https://mongoosejs.com/docs/models.html

Use the Schemas guide when learning how to define the structure and behaviour of documents. Use the SchemaTypes guide when you need to check which field types and options are available. Use the Validation guide when you need to understand required fields, minimums, maximums, custom validators, and validation errors.

### Example: Reading the Documentation and Applying It

```javascript
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  level: {
    type: Number,
    required: true,
    min: 100,
    max: 600
  }
});
```

In this example:

- `type: String` means Mongoose expects a string-like value for the field.
- `required: true` means the field must be supplied for the document to pass Mongoose validation.
- `trim: true` removes whitespace from the beginning and end of a string.
- `lowercase: true` converts a string to lowercase when Mongoose applies the relevant setter.
- `min` and `max` set numeric validation limits.
- `unique: true` requests a unique database index; it is **not** a normal Mongoose validator. Duplicate values can produce a MongoDB duplicate-key error.

**Teaching point:** The schema documentation is useful, but not every schema option behaves in the same way. In particular, distinguish validation rules from index options and data-transformation options.

---

## 45. How Does a MongoDB Collection Get Created?

A MongoDB collection is similar to a table in a relational database, although MongoDB stores documents in collections rather than rows in tables.

There are two common ways to create a collection.

### Method 1: Let MongoDB Create It When Data Is Inserted

In a typical Mongoose application, you define a schema and create a model:

```javascript
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const Student = mongoose.model("Student", studentSchema);
```

At this point, the model has been defined in your application, but **this code alone does not necessarily create a collection in the database**.

When you save the first valid document:

```javascript
const student = new Student({
  name: "Ada",
  email: "ada@example.com"
});

await student.save();
```

MongoDB normally creates the collection automatically if it does not already exist, then stores the document in it.

The collection is commonly named `students`, because Mongoose normally lowercases and pluralises the model name `Student`.

Other examples of the usual naming convention:

| Model name | Usual collection name |
|---|---|
| `Student` | `students` |
| `User` | `users` |
| `Product` | `products` |
| `Course` | `courses` |

The exact collection name can be specified explicitly if needed.

### Method 2: Create the Collection Explicitly

You can ask Mongoose to create a collection:

```javascript
await Student.createCollection();
```

This is useful when you need to configure collection options or want to create the collection before inserting documents. It is not required for every ordinary application.

You can also create collections directly in MongoDB tools, such as `mongosh` or MongoDB Compass.

### What Is the Difference Between a Schema, a Model, and a Collection?

- **Schema:** Defines the expected shape, rules, and behaviour of documents in your application.
- **Model:** A JavaScript object created from a schema. You use it to create, query, update, and delete documents.
- **Collection:** The place in MongoDB where documents are stored.
- **Document:** One individual record stored in a collection.

Think of it this way:

> Schema = blueprint; Model = tool you use to work with records; Collection = storage location; Document = one stored record.

### Important Note About Connection Timing

Make sure your application connects to MongoDB before running database operations:

```javascript
import mongoose from "mongoose";

await mongoose.connect(process.env.MONGODB_URI);

const student = await Student.create({
  name: "Ada",
  email: "ada@example.com"
});
```

In a real application, the connection is usually established once when the server starts, rather than inside every route handler.

---

## 46. Do I Need to Call `dotenv.config()` in Every File to Use `process.env`?

**Usually, no.** In a typical Node.js application using the `dotenv` package, call `dotenv.config()` once near the application's entry point, before the code that needs those environment variables runs.

### Step 1: Create a `.env` File

For example:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/schoolDB
```

The `.env` file stores configuration values outside your source code.

### Step 2: Load the Variables at the Application Entry Point

For an ES module project:

```javascript
// server.js
import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Environment loading should happen before code that reads those values. If your module structure makes import evaluation order important, load the environment before importing modules that immediately read environment variables. One straightforward pattern is to put `dotenv.config()` in a dedicated configuration module and import that module first, or to use Node.js's supported environment-file option.

### Step 3: Read the Variables in Other Files

For example:

```javascript
// database.js
import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
}
```

You do not normally need to call `dotenv.config()` again in `database.js`, because the environment variables have already been loaded into `process.env` by the entry point.

### A Safer Pattern for Projects With Several Files

Create a configuration file:

```javascript
// config/env.js
import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI;
```

Then import the exported configuration values where needed:

```javascript
// database.js
import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from the environment");
  }

  await mongoose.connect(MONGODB_URI);
}
```

This centralises configuration and makes it easier to check required environment variables.

### Key Points

- `process.env` is provided by Node.js.
- `dotenv.config()` loads values from a `.env` file into `process.env`.
- In a normal single-process application, loading the file once early is usually sufficient.
- Every separate process must have its own environment configured. For example, a worker process or a separately launched script may need its own environment setup.
- Variables supplied by your hosting provider or operating system may already exist in `process.env`; they do not need to come from a `.env` file.
- Do not commit secrets such as database passwords, API keys, or private tokens to a public repository. Add `.env` to `.gitignore`, and provide a safe `.env.example` containing placeholder values instead.

### Common Mistake

This code can fail if `MONGODB_URI` has not been loaded or supplied:

```javascript
await mongoose.connect(process.env.MONGODB_URI);
```

Check that the variable exists before connecting:

```javascript
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}
```

---

## 47. If the Front End Does Not Send Required Fields, Do I Need `if...else`, or Will Mongoose Handle It?

Mongoose can handle many missing-field cases through schema validation, so you do not need to write an `if...else` check for every required field just to ensure that it is present.

However, **Mongoose validation does not replace all request validation or error handling in your API**.

### Example Schema

```javascript
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Student name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
    trim: true,
    lowercase: true
  },
  department: {
    type: String,
    required: [true, "Department is required"]
  },
  level: {
    type: Number,
    required: [true, "Academic level is required"],
    min: [100, "Level must be at least 100"],
    max: [600, "Level cannot be greater than 600"]
  }
});

const Student = mongoose.model("Student", studentSchema);
```

### Example Express Route

```javascript
app.post("/students", async (req, res) => {
  try {
    const student = await Student.create({
      name: req.body.name,
      email: req.body.email,
      department: req.body.department,
      level: req.body.level
    });

    return res.status(201).json({
      message: "Student created successfully",
      data: student
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Please check the submitted student details",
        errors: Object.values(error.errors).map((item) => item.message)
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "A student with that unique value already exists"
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "An unexpected server error occurred"
    });
  }
});
```

If the request leaves out `name`, `email`, `department`, or `level`, Mongoose's document validation will normally reject the creation and throw a `ValidationError`. The `catch` block then sends a client-friendly `400 Bad Request` response.

The exact route may differ depending on your project, but the principle is the same: let the schema define data rules, and catch validation errors so the API responds properly.

### What If the Request Body Is Completely Missing?

If the request body is `undefined`, accessing or destructuring properties from it can fail before Mongoose is called.

For example, this can throw an error if `req.body` is undefined:

```javascript
const { name, email } = req.body;
```

In an Express application, register the JSON body parser before your routes:

```javascript
app.use(express.json());
```

Then send JSON from Postman or the front end with the correct `Content-Type: application/json` header.

You may also add a defensive check:

```javascript
if (!req.body || typeof req.body !== "object") {
  return res.status(400).json({
    message: "A valid JSON request body is required"
  });
}
```

### When Should You Write `if...else` Checks Yourself?

Use explicit checks when the API needs to enforce rules that are not just simple schema validation. Examples include:

- Checking that a user is authenticated.
- Checking that the user has permission to create a student.
- Checking that a related course exists.
- Checking that a field is allowed to be changed by the current user.
- Validating a request's shape before performing more complicated logic.
- Returning a specific message when a business rule is violated.

For basic required fields, the schema's `required` option is often sufficient. You still need to catch and handle the error.

### Important: Mongoose Validation Has Limits

- Mongoose document validation generally runs when a document is saved or created through the model.
- Update operations need care. For update validators to run with methods such as `findByIdAndUpdate()`, you generally need `{ runValidators: true }`.
- `unique: true` is an index declaration, not a normal validator. Duplicate values can produce a MongoDB duplicate-key error, which should be handled separately.
- The front end should provide a good user experience by checking form inputs, but the backend must enforce the rules because clients can bypass front-end validation.

### Example of Update Validation

```javascript
const updatedStudent = await Student.findByIdAndUpdate(
  req.params.id,
  {
    level: req.body.level
  },
  {
    new: true,
    runValidators: true
  }
);
```

Here, `runValidators: true` asks Mongoose to run applicable schema validators on the update.

**Teaching rule:** Validate on the front end for usability; validate on the backend for correctness and security. Mongoose helps enforce data rules, while Express handles the HTTP response.

---

## 48. What Are Regular Expressions?

A **regular expression**, often called a **regex** or **RegExp**, is a pattern used to search, match, or validate text.

Regular expressions can be used to:

- Check whether a string follows a particular pattern.
- Search text for a word or phrase.
- Replace parts of a string.
- Extract matching text.
- Filter database results by text patterns.

In JavaScript, a regular expression is commonly written between forward slashes:

```javascript
const pattern = /hello/;
```

The `test()` method checks whether a string contains a match:

```javascript
console.log(pattern.test("hello world")); // true
console.log(pattern.test("good morning")); // false
```

### Common Regex Symbols

| Pattern | Meaning | Example |
|---|---|---|
| `/cat/` | Matches the text `cat` somewhere in the string | `a cat is here` |
| `/^cat/` | Matches text beginning with `cat` | `cat food` |
| `/cat$/` | Matches text ending with `cat` | `my cat` |
| `/\d/` | Matches a digit from 0 to 9 | `room 4` |
| `/\d+/` | Matches one or more digits | `2026` |
| `/[A-Z]/` | Matches an uppercase English letter | `Mary` |
| `/[a-z]/` | Matches a lowercase English letter | `hello` |
| `/[A-Za-z]/` | Matches an English letter in either case | `Student` |
| `/\s/` | Matches whitespace, such as a space or tab | `first name` |
| `/./` | Matches most single characters other than line terminators | `a` |
| `/a+/` | Matches one or more consecutive `a` characters | `aaa` |
| `/colou?r/` | Matches `color` or `colour` | `colour` |
| `/^.{3,20}$/` | Matches a string containing 3 to 20 characters, excluding line terminators | `student123` |

### What Do `^` and `$` Mean?

- `^` means the start of the string when used in this kind of pattern.
- `$` means the end of the string.

For example:

```javascript
const usernamePattern = /^[A-Za-z]+$/;

console.log(usernamePattern.test("Mary")); // true
console.log(usernamePattern.test("Mary123")); // false
console.log(usernamePattern.test("Mary Jane")); // false
```

This pattern accepts only one or more English letters, with no spaces or numbers.

Without the `^` and `$` anchors, a pattern may match only part of a string. For validation, anchors are often useful when you intend to check the whole value.

### What Do `*`, `+`, and `?` Mean?

- `*` means zero or more occurrences.
- `+` means one or more occurrences.
- `?` means zero or one occurrence.

For example:

```javascript
const digits = /^\d+$/;

console.log(digits.test("123")); // true
console.log(digits.test(""));    // false
console.log(digits.test("12a")); // false
```

The `+` requires at least one digit. The `^` and `$` anchors mean the entire string must contain only digits.

### Using a Regex to Validate an Email-Like Pattern

A simple regex can check for a basic email shape:

```javascript
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

console.log(emailPattern.test("ada@example.com")); // true
console.log(emailPattern.test("not-an-email"));    // false
```

This is only a basic format check. Email address standards are complex, and a regex cannot prove that an address exists or that the user controls it. For important applications, use sensible format validation and confirm ownership through an email verification process.

### Using Regex in a Mongoose Schema

Mongoose supports the `match` validator for string fields:

```javascript
const studentSchema = new mongoose.Schema({
  studentCode: {
    type: String,
    required: true,
    match: [/^[A-Z]{3}\d{3}$/, "Student code must look like ABC123"]
  }
});
```

This pattern means:

- `^` — start of the string.
- `[A-Z]{3}` — exactly three uppercase English letters.
- `\d{3}` — exactly three digits.
- `$` — end of the string.

Examples:

- `ABC123` — valid.
- `ENG456` — valid.
- `AB123` — invalid because it has only two letters.
- `abc123` — invalid because the letters are lowercase.
- `ABC12` — invalid because it has only two digits.
- `ABC1234` — invalid because it has four digits.

### Using a Regex in a MongoDB Search

Regular expressions can also search text in a database:

```javascript
const students = await Student.find({
  name: { $regex: "^ada", $options: "i" }
});
```

This searches for names beginning with `ada`, without case sensitivity. For example, it can match `Ada` and `Adam`.

Use regex searches thoughtfully. A broad or complex pattern may be slower than a normal indexed lookup, and user-supplied patterns should be handled carefully to avoid expensive searches.

### Regex Is Not a Replacement for Every Validator

Use regex when the rule is genuinely about a text pattern, such as a student code or a simple username format. Use other validators for other kinds of rules:

- `required` — value must be provided.
- `min` and `max` — numeric bounds.
- `minlength` and `maxlength` — string length.
- `enum` — value must be one of a specified set.
- `match` — string must match a regular expression.
- Custom validators — more specialised rules.

---

# Part 13: Quick Review Questions

1. Where can you find the official Mongoose documentation for schemas?
2. Does defining a Mongoose model automatically guarantee that a collection already exists in MongoDB?
3. What normally happens when the first document is saved to a collection that does not yet exist?
4. What is the difference between a schema, a model, a collection, and a document?
5. In a typical Node.js application, why is `dotenv.config()` usually called near the entry point?
6. What should you check if `process.env.MONGODB_URI` is undefined?
7. If a required field is missing when calling `Student.create()`, what will Mongoose normally do?
8. Why should an Express route catch a Mongoose `ValidationError`?
9. Why can destructuring `req.body` fail before Mongoose validation runs?
10. Why should backend validation still exist when the front end already validates a form?
11. What do `^` and `$` mean in a regular expression?
12. What is the difference between `\d+` and `\d*`?
13. What does the `match` option do in a Mongoose string field?
14. Why is `unique: true` not the same as a normal Mongoose validator?
15. When updating a document, what does `{ runValidators: true }` do?

## Suggested Answers

1. In the official Mongoose Schemas guide and related documentation.
2. No. Defining a model in code does not necessarily create a database collection immediately.
3. MongoDB normally creates the collection automatically when the first document is inserted, if the collection does not already exist.
4. A schema defines structure and rules; a model provides methods for working with documents; a collection stores documents; a document is one record.
5. So values from the `.env` file are loaded before code that needs them runs.
6. Confirm that the variable is spelled correctly, exists in the environment or `.env` file, and is loaded before it is read.
7. Mongoose normally throws a `ValidationError` during document validation.
8. So the API can return a clear client error, commonly HTTP `400`, instead of an unhandled server error.
9. Because `req.body` may be undefined if body-parsing middleware is missing or the request is not sent in the expected format.
10. Because clients can bypass front-end validation; the backend must enforce the application's rules.
11. They mark the start and end of the string for whole-string pattern checks.
12. `\d+` requires one or more digits; `\d*` allows zero or more digits.
13. It validates that a string matches the specified regular expression.
14. It requests a unique database index; duplicate values can result in a MongoDB duplicate-key error.
15. It asks Mongoose to run applicable schema validators for the update.

---

# Teaching Summary

When teaching this topic, emphasise these principles:

1. **Use the documentation.** Mongoose's official guides are the source of truth for schema options and validation behaviour.
2. **Understand automatic collection creation.** A model is defined in application code; a collection is normally created by MongoDB when data is first inserted, unless it has been created explicitly already.
3. **Load environment configuration early.** In a normal single-process server, load `.env` once near startup, before dependent code reads `process.env`.
4. **Let the schema enforce data rules, but handle errors.** Mongoose can reject missing or invalid fields, but your Express route must catch errors and send useful HTTP responses.
5. **Do not confuse validation with uniqueness.** `required`, `match`, and numeric limits are validators; `unique` is an index option.
6. **Use regex for text patterns.** It is powerful for matching formats, but it is not a substitute for all validation and should be used carefully for database searches.
7. **Validate at more than one layer for different reasons.** Front-end validation improves usability; backend validation protects data integrity and business rules.
