# 🚀 Social Media Strategy System

An **AI-powered Social Media Management & Strategy Platform** designed to help brands **plan, schedule, automate, analyze, and optimize** their social media presence — all in one place.

Built with a **modern MERN Stack architecture**, this platform provides businesses and marketers with powerful tools for **content planning**, **post scheduling**, **backlink management**, **analytics insights**, and **report generation**.

---

## ✨ Features

### 📌 Brand Management

* Create and manage multiple brands
* Store brand-specific information
* Connect social accounts and integrations

### 🗓️ Content Planning Calendar

* Plan content visually using an interactive calendar
* Add and edit content plans
* Organize campaigns efficiently

### 📲 Social Media Post Scheduling

* Schedule posts for future publishing
* Upload media (images/videos/carousels)
* Supports multiple post types:

  * 🖼️ Static Posts
  * 🎠 Carousel Posts
  * 🎬 Reels
  * 🎥 Videos

### ⚙️ Automated Posting System

* Background workers for scheduled posting
* Queue-based job processing with BullMQ
* Retry & recovery mechanism

### 🔗 Backlink Management

* Track backlinks across platforms like:

  * Reddit
  * Quora
  * Medium
  * Stack Exchange

### 📊 Advanced Analytics Dashboard

* View business insights with beautiful charts:

  * Content Type Distribution
  * Platform Distribution
  * Post Status Overview
  * Posting Frequency
  * Backlink Growth

### 📄 Export Reports

* Generate professional **PDF reports** for clients

### 🔐 Authentication & Security

* JWT Authentication
* Protected routes
* Secure backend APIs

### 🎨 Premium UI/UX

* Modern Glassmorphism Design
* Responsive Dashboard Layout
* Elegant Animations & Interactive Components

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React.js
* 🎨 Tailwind CSS
* 📊 Recharts
* 🔥 React Hot Toast
* 🌐 React Router DOM
* 🧩 Material UI

### Backend

* 🟢 Node.js
* 🚂 Express.js
* 🍃 MongoDB
* 🔐 JWT Authentication

### Cloud & Integrations

* ☁️ Cloudinary
* ⚡ Redis
* 🧵 BullMQ

---

## 📂 Project Structure

```bash
social-media-strategy-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── jobs/
│   │   ├── workers/
│   │   └── utils/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── routes/
│   │   └── layout/
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SathyaVasagan/social-media-strategy-system.git
cd social-media-strategy-system
```

### 2️⃣ Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

## 🔑 Environment Variables

Create `.env` files using the provided `.env.example`

### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

REDIS_URL=your_redis_url
```

---

## ▶️ Run the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## 📸 Screenshots

*Add project screenshots here*

*Home*
<img width="1240" height="815" alt="image" src="https://github.com/user-attachments/assets/10613dff-91e6-4fa3-b0cb-5c0b4ca97fbf" />

*Brand*
<img width="1240" height="588" alt="image" src="https://github.com/user-attachments/assets/88a8cece-eca5-442c-ae9e-500df884372e" />

*Brand Workspace*
<img width="1240" height="588" alt="image" src="https://github.com/user-attachments/assets/fa84bdee-39b3-431c-9f9c-f39cd3b9453c" />

*Content Calendar*
<img width="1240" height="588" alt="image" src="https://github.com/user-attachments/assets/d247dbdb-169b-4b77-ba1a-8e3dd1b7ddee" />

*Posts*
<img width="1240" height="1059" alt="image" src="https://github.com/user-attachments/assets/cc5a5080-fb7f-4210-8aac-aa4f503ae651" />

*Backlinks*
<img width="1240" height="588" alt="image" src="https://github.com/user-attachments/assets/5e6e0588-dc4c-44df-892b-47104e152e8c" />

*Analytics*
<img width="1240" height="1533" alt="image" src="https://github.com/user-attachments/assets/ab2b1bec-0312-4438-a0ab-57c10fb09737" />



---

## 🌟 Future Enhancements

* 🤖 AI Caption Generator
* 📩 Email Reports to Clients
* 📱 Push Notifications
* 📈 AI-based Recommendations
* 👥 Multi-user Team Collaboration

---

## 👨‍💻 Author

**Sathya Vasagan E**

* 🌐 GitHub: https://github.com/SathyaVasagan
* 💼 LinkedIn: https://www.linkedin.com/in/sathya-vasagan/
* 💻 Portfolio: https://sathya-vasagan.netlify.app/

---

## ⭐ Support

If you like this project:

🌟 Star this repository
🍴 Fork this repository
📢 Share it with others

---

### 💙 Thank you for visiting Social Media Strategy System repository!
