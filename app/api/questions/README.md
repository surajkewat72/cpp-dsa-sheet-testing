POST /api/questions

This route accepts POST requests to add or update questions/topics in the MongoDB `questions` collection.

Authentication

- The route requires a logged-in user (session cookie named `session` containing a JWT). Any authenticated user can add or update topics/questions.

Supported payloads

1. Upsert an entire topic
   {
   "topic": {
   "id": 101,
   "name": "Arrays",
   "questions": [
   { "id": 1001, "title": "Two Sum", "difficulty": "easy", "links": { "leetcode": "..." }, "companies": ["Google"] }
   ]
   }
   }

2. Add a question to an existing topic
   {
   "topicId": 101,
   "question": { "id": 1002, "title": "Three Sum", "difficulty": "medium" }
   }

Validation

- question.id: number
- question.title: non-empty string
- question.difficulty: one of "easy", "medium", "hard"
- question.links: optional object
- question.companies: optional array of strings

Responses

- 200: success with updated topic (for topic upsert)
- 201: question added to topic
- 400: invalid payload
- 401: unauthenticated
- 403: forbidden (if user record cannot be found)
- 404: topic not found
- 409: duplicate question id
- 500: server error

Notes

Notes

- Currently only authentication is required. If you later want admin-only access, we can add a role flag (e.g. `isAdmin`) to the `User` schema and check it here.
- Ensure `JWT_SECRET` is set in environment when running locally or in production.

Try it (example)

Use your browser or an HTTP client that preserves cookies (the server expects a `session` cookie). If you already have a session cookie set in your browser you can run this from the same host.

Example curl (if you have the session cookie value):

curl -X POST \
 -H "Content-Type: application/json" \
 -b "session=<JWT_SESSION_TOKEN>" \
 -d '{"topicId":101,"question":{"id":1003,"title":"Sample","difficulty":"easy"}}' \
 http://localhost:3000/api/questions
