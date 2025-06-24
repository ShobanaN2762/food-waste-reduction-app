# 🍱 Food Waste Reduction App

A full-stack web application that connects food donors (restaurants, grocery stores, individuals) with recipients (NGOs, food banks) to reduce food waste and distribute surplus food to those in need.

---

## 📌 Features

### 👨‍🍳 For Donors:
- Register and log in
- Post food donations with location and details
- View, edit, or delete past donations
- Track donation status (pending, accepted, delivered)

### 🏥 For Recipients:
- Register and log in
- View available donations in real-time
- Request or claim donations
- Maintain request and collection history

### 🤖 AI Integration (planned/future scope):
- Optimize food-recipient matching based on location and preferences
- Analyze donation patterns
- Smart notifications & reminders

---

## 🧰 Tech Stack

| Category        | Tech Used                      |
|----------------|--------------------------------|
| Frontend       | React.js, Vite, Tailwind CSS   |
| Backend        | Supabase (PostgreSQL + Auth)   |
| State/Data     | React Query, Context API       |
| Deployment     | Vercel                         |
| Styling        | Styled-components, CSS Modules |
| Maps           | Leaflet.js / Geolocation API   |

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/ShobanaN2762/food-waste-reduction-app.git
cd food-waste-reduction-app
```

### 2.Install Dependencies

```
npm install
```

### 3.Run the app

```
npm run dev
```

### 📂 Project Structure
```
├── public/
├── src/
│   ├── features/          # Main app logic (donation, requests, auth, dashboard)
│   ├── pages/             # Page-level routing components
│   ├── ui/                # Reusable UI components
│   ├── services/          # Supabase API functions
│   ├── data/              # Sample data + uploader
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Global styles
│   └── main.jsx           # App entry point
```

## 🌐 Live Demo

[🔗 View Deployed App](https://food-waste-reduction-app.vercel.app)


