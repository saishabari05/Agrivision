# Live Testing Guide

## 1. Start the backend

From the project root:

```powershell
cd backend
uvicorn main:app --reload
```

Open:

```text
http://127.0.0.1:8000/docs
```

Use Swagger UI to test the routes below.

## Model integration with model.pt

If your teammate has a PyTorch `model.pt`, use:

```env
MODEL_MODULE=model_integration
MODEL_FUNCTION=predict_disease
MODEL_PATH=model.pt
MODEL_CLASSES_PATH=classes.txt
MODEL_IMAGE_SIZE=224
```

Then:
- place `model.pt` inside the `backend` folder, or change `MODEL_PATH`
- place `classes.txt` inside the `backend` folder, or change `MODEL_CLASSES_PATH`
- install PyTorch dependencies:

```powershell
pip install torch torchvision
```

- open [model_integration.py](./model_integration.py)
- replace `CLASS_NAMES` with the real labels in training order
- if the saved file is only a `state_dict`, replace the `load_model()` logic with the model class + `load_state_dict(...)`
- if the model uses different image normalization or image size, update `_build_transform()`

## 2. Test Weather API live call

Weather is used when `/api/analyze` receives `lat` and `lon`, or when it can geocode the submitted `location` string into coordinates.

Before testing:
- make sure `WEATHER_API_KEY` in `.env` is valid
- keep the backend running

In Swagger:
- open `POST /api/analyze`
- upload an image
- set:
  - `location`: `Bengaluru`

Expected result:
- response status `200`
- `weather` should contain temperature, humidity, condition, and description
- alerts should not include `Weather data unavailable`

If you want to verify the direct coordinate path, also send:
- `lat`: `12.9716`
- `lon`: `77.5946`

If it fails:
- verify the API key
- verify your internet connection
- check backend terminal logs for the exact weather error

## 3. Test Groq recommendation/chat live call

Before testing:
- make sure `GROQ_API_KEY` is valid
- optionally update `GROQ_MODEL` if you want a currently supported model

### Recommendation test

Use `POST /api/analyze` with a valid image.

Expected result:
- `recommendation` should contain real AI-generated advice
- alerts should not include `Recommendation service unavailable`

### Chat test

After `/api/analyze`, copy the returned `session_id`.

Use `POST /api/chat`:

```json
{
  "session_id": "paste-session-id-here",
  "message": "What should I do next?"
}
```

Expected result:
- response status `200`
- `response` should be a real contextual answer
- response should not be the fallback unavailable message

If Groq fails:
- confirm the API key is active
- confirm the selected model is available in your Groq account
- check backend logs for model or network errors

## 4. Test Firebase token login live

This route expects a real Firebase ID token from your frontend login flow.

Route:
- `POST /auth/google`

Request body:

```json
{
  "id_token": "REAL_FIREBASE_ID_TOKEN"
}
```

How to get the real token:
- run your frontend
- sign in with Google using Firebase Authentication
- after login, get the current user's ID token from the frontend

Typical frontend code:

```js
const idToken = await user.getIdToken();
console.log(idToken);
```

Then call `/auth/google` with that token.

Expected result:
- response status `200`
- response includes:
  - `access_token`
  - `token_type`
  - `user`

Database check:
- because Postgres is now connected, the user should be saved into the `users` table

If Firebase login fails:
- verify `FIREBASE_CREDENTIALS_PATH` points to the correct service account JSON
- verify Firebase Authentication and Google sign-in are enabled in Firebase Console
- verify the token comes from the same Firebase project

## 5. Optional quick curl tests

### Health

```powershell
curl http://127.0.0.1:8000/health
```

### Chat

```powershell
curl -X POST http://127.0.0.1:8000/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"session_id\":\"YOUR_SESSION_ID\",\"message\":\"What should I do next?\"}"
```
