




 Project Structure

sql-generator/
│
├── backend/
│   ├── main.py          FastAPI application
│   ├── llm.py           Ollama LLM integration
│   ├── models.py        Request models
│   ├── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx   Base layout
│   │   ├── page.tsx     UI page
│   │   ├── globals.css  Styling
│   ├── package.json
│
└── README.md




 Prerequisites

 Python 3.9+
 Node.js 18+
 Ollama installed
  [https://ollama.com/download](https://ollama.com/download)



 How to Run the Application

1️⃣ Start Ollama and pull model

bash
ollama pull mistral




2️⃣ Run Backend (FastAPI)

bash
cd sql-generator/backend
pip install -r requirements.txt
uvicorn main:app --reload


Backend runs at:


http://localhost:8000


API docs:


http://localhost:8000/docs




3️⃣ Run Frontend (Next.js)

Open a new terminal:

bash
cd sql-generator/frontend
npm install
npm run dev


Frontend runs at:


http://localhost:3000




 Example to Test the Application

English Query


Get top 5 users by total order amount


Database Schema


CREATE TABLE users (
  id INT,
  name VARCHAR
);

CREATE TABLE orders (
  id INT,
  user_id INT,
  amount FLOAT
);


SQL Dialect


PostgreSQL


Expected Output

 A valid SQL query with JOIN, GROUP BY, ORDER BY, and LIMIT
 Syntax-highlighted SQL
 Plain-English explanation
 Error message after 5 requests (rate limiting)



 Note:

 The application is fully open-source
 No paid or proprietary APIs are used
 Rate limit: 5 requests per day per IP
 SQL is generated but not executed against a database


