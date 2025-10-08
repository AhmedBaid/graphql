# GraphQL Dashboard

This project is a **GraphQL-based web dashboard** built with vanilla **JavaScript, HTML, and CSS**.  
It allows users to authenticate, fetch data via GraphQL queries, and display profile information, XP, ranks, and more in a styled UI.

---

## 📂 Project Structure
```
GRAPHQL/
├── assets/               # Static frontend assets
│   ├── css/
│   │   ├── style.css     # Main styles
│   │   └── responsive.css# Media queries & responsive design
│   └── images/
│       ├── icon.png      # App favicon / icon
│       └── profile.jpg   # Default profile picture
│
├── config/
│   └── config.js         # API configuration (GraphQL endpoint, constants, tokens, etc.)
│
├── helpers/              # Utility functions
│   ├── debounce.js       # Debounce function for performance
│   ├── FetchApi.js       # Wrapper for GraphQL fetch calls
│   ├── FormatXp.js       # Converts raw XP values into readable format
│   ├── GetRank.js        # Gets user rank from data
│   └── showToast.js      # Toast notification system
│
├── pages/                # Page-specific logic
│   ├── login.js          # Handles user login/authentication
│   └── showProfile.js    # Displays user profile and related data
│
├── query/
│   └── query.js          # Contains GraphQL queries used in the app
│
├── index.html            # Main entry point (frontend UI)
├── main.js               # Application bootstrap (initialization, event listeners, etc.)
└── README.md             # Project documentation (this file)

```

---

## ⚙️ Features
- 🔑 **Authentication** using tokens (GraphQL `Bearer` authorization).
- 📊 **Profile Dashboard** with user details (XP, rank, transactions, skills, audits, etc.).
- 🖼️ **Dynamic UI Rendering** with DOM manipulation.
- 📡 **Reusable GraphQL Fetch API** helper for queries.
- 🎨 **Responsive Design** with `responsive.css`.
- 🔔 **Toast Notifications** for feedback (success/error).

---

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/AhmedBaid/graphql
   install live server extention and go live 
