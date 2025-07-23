# Natours Tour Booking Platform

A full-featured, production-ready **Node.js-based tour booking platform** with user authentication, role-based authorization, tour management, Stripe payments, and more.

> Live demo: [https://natour-for-practise.onrender.com](https://natour-for-practise.onrender.com)

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Demo Accounts](#demo-accounts)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Introduction

**Natours** is a web application that allows users to browse, search, and book exciting travel tours. Built as a practice project, it aims to simulate real-world software development with a scalable backend, secure authentication, and responsive server-side rendering.

---

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based login/signup
  - Role-based access control (admin, guide, user)

- 🧭 **Tour Management**
  - Tour listing, filtering, sorting
  - Admin & guide CRUD operations

- 💳 **Booking System**
  - Stripe payment integration
  - Booking confirmation page

- 📧 **Email Functionality**
  - Welcome email, password reset email

- 📊 **Admin Dashboard**
  - View and manage users, tours, bookings

- ⚡ **Optimized Performance**
  - Server-side rendering with Pug
  - Fast builds with esbuild

---

## Demo Accounts

You can log in with the following sample accounts:

| Role       | Email                  | Password |
|------------|------------------------|----------|
| Admin      | admin@example.com      | test1234 |
| Lead Guide | leadguide@example.com  | test1234 |
| Guide      | guide@example.com      | test1234 |
| User       | user@example.com       | test1234 |

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas with Mongoose
- **Frontend (SSR):** Pug templating engine
- **Auth:** JSON Web Tokens (JWT)
- **Payments:** Stripe
- **Email Services:** Mailtrap / Mailgun
- **Deployment:** Render
- **Build Tools:** esbuild

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dktoan03/tourbooking.git
cd tourbooking
