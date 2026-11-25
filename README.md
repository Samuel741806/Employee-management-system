# Employee Management System — Java Full Stack

Intermediate CRUD application built with Java 25, Spring Boot, MongoDB, HTML, CSS and JavaScript.

## Requirements
- Windows 10/11
- JDK 25 (latest LTS)
- Maven 3.8+ (or use the Maven wrapper if you add one)
- MongoDB Community Server running locally on port 27017
- VS Code or IntelliJ IDEA
- A modern browser

## 1. Install and start MongoDB
1. Install MongoDB Community Server for Windows from https://www.mongodb.com/try/download/community.
2. During installation, select **Install MongoD as a Service**.
3. Install MongoDB Compass if you want a graphical database viewer.
4. Open Services (`Win + R` → `services.msc`) and confirm the MongoDB service is running.
5. The app uses `mongodb://localhost:27017/employee_management`. MongoDB creates the database and `employees` collection when the first employee is saved.

You can verify the server in PowerShell:
```powershell
mongosh
```
Then:
```javascript
show dbs
use employee_management
show collections
db.employees.find()
```

## 2. Run the backend
Open PowerShell in the `backend` folder:
```powershell
java -version
mvn -version
mvn spring-boot:run
```
Expected server address: `http://localhost:8080`.

If PowerShell says `mvn` is not recognized, install Apache Maven and add its `bin` folder to PATH, then reopen PowerShell. Ensure `JAVA_HOME` points to your JDK 25 folder.

## 3. Run the frontend
After the backend is running, open the `frontend` folder in VS Code and use the **Live Server** extension on `index.html`. Alternatively, use Python:
```powershell
cd frontend
py -m http.server 5500
```
Open `http://localhost:5500`.

Do not open the HTML file directly with `file://`; serve it through Live Server or the local HTTP server.

## 4. API endpoints
Base URL: `http://localhost:8080/api/employees`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/employees` | List employees |
| GET | `/api/employees?search=alex` | Search by name/email |
| GET | `/api/employees/{id}` | Get one employee |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |
| GET | `/api/employees/stats` | Total employee count |

Example POST body:
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "department": "Engineering",
  "designation": "Software Engineer",
  "salary": 55000,
  "phone": "9876543210",
  "status": "Active"
}
```

## 5. Test with Postman
1. Start MongoDB.
2. Start Spring Boot.
3. Send `POST http://localhost:8080/api/employees` with Body → raw → JSON and the example body above.
4. Send `GET http://localhost:8080/api/employees` and verify the record.
5. Send `PUT http://localhost:8080/api/employees/{id}` to update.
6. Send `DELETE http://localhost:8080/api/employees/{id}` to remove.

## Troubleshooting
- **MongoDB connection refused**: ensure the MongoDB Windows service is running and port 27017 is listening.
- **Port 8080 already in use**: stop the other process or change `server.port` in `application.properties`.
- **Frontend cannot fetch API**: check backend console, use `http://localhost:5500` (not `file://`), and verify API URL in `script.js`.
- **Validation error**: name, email, department and designation are required; email must be valid and salary cannot be negative.

## Important notes
- This is an educational intermediate CRUD project. It does not include authentication, authorization, audit logs, or production deployment.
- Do not expose the database publicly. Add authentication and role-based access before using real employee data.
