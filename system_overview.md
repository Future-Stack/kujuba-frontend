# Connect-to-Inspect — Complete System Overview

> **This is the single document to read first.**
> It covers the entire system — the mobile app used by Homeowners and Inspectors, plus the web
> Admin Dashboard — as one connected product. After reading this, you can optionally open the
> more detailed documents for each side.

---

## 1. System Overview

**Connect-to-Inspect** (branded as **Kujuba**) is a two-sided marketplace for home inspections. It
connects **Homeowners** who need a property inspected with **licensed Inspectors** who perform the
work — all coordinated through a powerful **Admin Dashboard** that the platform operator uses to
manage, approve, monitor, and oversee everything happening on both sides.

- **Homeowners** use the **mobile app** to browse inspection types, book an inspection, pay
  securely, track progress, and receive a final report.
- **Inspectors** use the **mobile app** to sign up, get approved, receive and accept job assignments,
  conduct inspections in the field, and submit reports.
- **Admins** use the **web dashboard** (connecttoinspect.com) to approve inspector applications,
  assign inspections to available inspectors, monitor all ongoing activity, manage payments, review
  submitted reports, handle customer support, and configure platform-wide settings.

All three sides communicate through the same shared backend API (api.connecttoinspect.com). An
action taken on any one side is immediately visible to the others.

---

## 2. Complete End-to-End Example Flow

> This is the life of a single inspection, touching all three sides in order.

```
1.  INSPECTOR signs up on the mobile app
        └─> submits name, license details, insurance info, and specialisations

2.  ADMIN sees the new application on the web dashboard
        └─> "Inspectors" section shows pending applicants with their details
        └─> Admin clicks Approve (or Reject)
        └─> Inspector's account becomes active — they can now log in and receive jobs

3.  HOMEOWNER opens the mobile app and books an inspection
        └─> selects an inspection type (e.g. Pre-Purchase, Structural, Electrical)
        └─> enters property address, type, and size
        └─> picks a preferred date and time
        └─> optionally marks the booking as Urgent (incurs an urgent fee)
        └─> pays through the app (Stripe)

4.  ADMIN sees the new booking appear in the "Inspections" section
        └─> booking arrives in the system with status: Pending
        └─> Admin assigns an available inspector to the booking
        └─> Inspector is notified on the mobile app

5.  INSPECTOR accepts the job on the mobile app
        └─> booking status updates to: Assigned

6.  INSPECTOR travels to the property and starts the inspection
        └─> booking status updates to: Started / In Progress

7.  INSPECTOR completes the inspection and submits a report
        └─> uploads photos, videos, written notes, and a final report file
        └─> booking status updates to: Completed
        └─> report becomes immediately visible on the Admin Dashboard (Reports section)
        └─> Homeowner can now access and download the report from the mobile app

8.  ADMIN sees the full transaction record on the web dashboard
        └─> Payments section shows: inspection fee, platform commission, inspector payout,
            urgent fee (if applicable), payment status, and disbursement status
        └─> Reports section shows the submitted report with media, notes, and report file
        └─> Admin can archive, favourite, or export the report

9.  HOMEOWNER leaves a review for the inspector on the mobile app
        └─> ADMIN sees the review on the dashboard (Reviews section)
        └─> Admin can show or hide reviews, or suspend an inspector based on review content

10. INSPECTOR gets paid their earnings (inspector share minus platform commission)
        └─> Admin tracks payout disbursement status in the Payments section
```

> Every step above is confirmed by actual code in the admin codebase. No invented steps.

---

## 3. System Map

A visual summary of how actions ripple across all three sides.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SHARED BACKEND API                                    │
│                     api.connecttoinspect.com/api/v1                             │
└──────────────┬────────────────────────────┬────────────────────────────────────┘
               │                            │                            │
               ▼                            ▼                            ▼
  ┌─────────────────────┐      ┌─────────────────────┐      ┌──────────────────────────┐
  │  HOMEOWNER          │      │  INSPECTOR           │      │  ADMIN DASHBOARD         │
  │  (Mobile App)       │      │  (Mobile App)        │      │  (Web - connecttoinspect)│
  └─────────────────────┘      └─────────────────────┘      └──────────────────────────┘

─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  KEY FLOWS  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

Inspector signs up (Mobile)
    │
    └────────────────────────────────────────────────────► Admin sees "Pending" in
                                                           Inspectors list
                                                                │
                                                                └─► Admin approves
                                                                         │
                                                                         ▼
                                                            Inspector can log in + receive jobs

Homeowner books + pays (Mobile)
    │
    └────────────────────────────────────────────────────► Booking appears in Admin
                                                           Inspections → Admin assigns inspector
                                                                │
                                                                ▼
                                                  Inspector gets notified (Mobile)
                                                       │
                                                       └─► Inspector accepts → starts → completes
                                                                │
                                                  ┌─────────────┴────────────────┐
                                                  ▼                              ▼
                                       Homeowner gets report           Admin sees report +
                                       (Mobile)                        payment record + reviews
```

---

## 4. Who Can Do What

| **Capability**                                            | **Homeowner** (Mobile) | **Inspector** (Mobile) | **Admin** (Web Dashboard) |
|-----------------------------------------------------------|:----------------------:|:----------------------:|:-------------------------:|
| Register / create an account                              | ✅                     | ✅                     | —                         |
| Log in with email or Google                               | ✅                     | ✅                     | ✅                        |
| Browse inspection types                                   | ✅                     | —                      | —                         |
| Book an inspection                                        | ✅                     | —                      | —                         |
| Mark a booking as Urgent                                  | ✅                     | —                      | —                         |
| Pay for an inspection (Stripe)                            | ✅                     | —                      | —                         |
| View and download their inspection report                 | ✅                     | —                      | —                         |
| Leave a review for an inspector                           | ✅                     | —                      | —                         |
| Submit a support ticket                                   | ✅                     | ✅                     | —                         |
| View FAQ answers                                          | ✅                     | ✅                     | —                         |
| Apply to become an inspector                              | —                      | ✅                     | —                         |
| Accept or decline an assigned job                         | —                      | ✅                     | —                         |
| Start an inspection in the field                          | —                      | ✅                     | —                         |
| Submit an inspection report with photos, videos, notes    | —                      | ✅                     | —                         |
| Request to cancel an assigned job                         | —                      | ✅                     | —                         |
| View own earnings                                         | —                      | ✅                     | —                         |
| Approve or reject inspector applications                  | —                      | —                      | ✅                        |
| Suspend or reactivate an inspector                        | —                      | —                      | ✅                        |
| Assign an inspector to a booking                          | —                      | —                      | ✅                        |
| Accept or decline an inspector's cancel request           | —                      | —                      | ✅                        |
| Mark an inspection complete manually                      | —                      | —                      | ✅                        |
| View all users (homeowners + inspectors)                  | —                      | —                      | ✅                        |
| Create, suspend, or delete a user account                 | —                      | —                      | ✅                        |
| View all payments and transaction history                 | —                      | —                      | ✅                        |
| Track platform revenue, fees, and inspector payouts       | —                      | —                      | ✅                        |
| Export payment data to a file                             | —                      | —                      | ✅                        |
| View, archive, favourite, or download inspection reports  | —                      | —                      | ✅                        |
| View and moderate user reviews                            | —                      | —                      | ✅                        |
| Reply to support tickets                                  | —                      | —                      | ✅                        |
| Manage FAQ content (add, edit, delete)                    | —                      | —                      | ✅                        |
| Create and manage inspection types                        | —                      | —                      | ✅                        |
| Send platform-wide push notifications                     | —                      | —                      | ✅                        |
| Configure platform settings (fees, penalties, commission) | —                      | —                      | ✅                        |
| See full overview dashboard (revenue, growth, activity)   | —                      | —                      | ✅                        |

---

## 5. Where Each Side Connects

These are every point where an action on one side directly causes something to happen on another side.
All entries are pulled from confirmed code in the admin codebase.

| **Trigger (Action taken on…)**                       | **Effect (What happens on another side)**                                                |
|------------------------------------------------------|------------------------------------------------------------------------------------------|
| Inspector signs up on mobile app                     | A pending application entry appears in Admin Dashboard → Inspectors section              |
| Admin approves an inspector                          | Inspector's account activates — they can log in and receive job assignments on mobile    |
| Admin rejects an inspector                           | Inspector's application is declined — no access to accept work on mobile                 |
| Admin suspends an inspector                          | Inspector loses the ability to accept new jobs on the mobile app                         |
| Admin reactivates an inspector                       | Inspector regains access to accept jobs on mobile                                        |
| Homeowner books and pays on mobile                   | A new booking (status: Pending) appears in Admin Dashboard → Inspections section         |
| Admin assigns an available inspector to a booking    | Inspector receives a job notification on the mobile app                                  |
| Inspector accepts a job on mobile                    | Booking status updates to Assigned — visible to Admin and Homeowner                      |
| Inspector starts the inspection on mobile            | Booking status updates to Started — visible to Admin and Homeowner                       |
| Inspector submits the completed report on mobile     | Booking becomes Completed; report appears in Admin Dashboard → Reports section           |
| Inspector submits the completed report on mobile     | Homeowner gains access to view and download the full report on the mobile app            |
| Inspector requests to cancel a booking on mobile     | A cancel request appears in Admin Dashboard for Admin to Accept or Decline               |
| Admin accepts the inspector's cancel request         | Booking is unassigned; Admin can re-assign to another available inspector                |
| Admin declines the inspector's cancel request        | Booking remains assigned to the original inspector on mobile                             |
| Homeowner submits a support ticket on mobile         | Ticket appears in Admin Dashboard → Support section for Admin to read and reply          |
| Admin replies to a support ticket on dashboard       | Homeowner or Inspector receives the reply on the mobile app                              |
| Homeowner leaves a review on mobile                  | Review appears in Admin Dashboard → Reviews section                                      |
| Admin toggles or hides a review on dashboard         | Review visibility changes for homeowners viewing that inspector's profile on mobile      |
| Admin updates platform fee or penalty in Settings    | New fee/penalty values apply to all future bookings made on the mobile app               |
| Admin creates or updates an inspection type          | New or updated inspection category becomes visible to homeowners browsing on mobile      |
| Admin adds or updates a FAQ entry                    | Updated FAQ content is shown in the FAQ section of the mobile app                        |
| Admin sends a notification from the dashboard        | Push notification is delivered to targeted mobile app users                              |

---

## 6. Full Tech Stack at a Glance

### Mobile App (Homeowner and Inspector Sides)

| Layer              | Technology                                                  |
|--------------------|-------------------------------------------------------------|
| Platform           | Native mobile app (iOS and Android)                         |
| Payment Processing | Stripe (homeowner payments and inspector payouts)           |
| Authentication     | Email and password login + Google Sign-In                   |
| Media              | Photo and video upload (attached to inspection reports)     |
| Backend API        | Shared REST API — api.connecttoinspect.com/api/v1           |

### Admin Dashboard (Web)

| Layer              | Technology                                                  |
|--------------------|-------------------------------------------------------------|
| Framework          | Next.js 16 (React 19)                                       |
| Language           | TypeScript                                                  |
| Styling            | Tailwind CSS v4                                             |
| State Management   | Redux Toolkit + RTK Query                                   |
| Charts and Graphs  | Recharts                                                    |
| Animations         | Framer Motion                                               |
| Icons              | Lucide React and React Icons                                |
| Authentication     | JWT access tokens + refresh tokens (stored in browser)      |
| Google Login       | Google OAuth                                                |
| Notifications      | React Toastify (in-browser alerts)                          |
| Backend API        | Shared REST API — api.connecttoinspect.com/api/v1           |

> Both the mobile app and the admin dashboard talk to the **same backend**. There is no data
> duplication — what Inspectors and Homeowners do on mobile is the same data the Admin reads
> on the web dashboard, updated in real time.

---

## 7. Platform Settings the Admin Controls

These settings are managed from the Admin Dashboard → Settings page and directly govern how
the mobile app behaves for Homeowners and Inspectors:

| Setting                          | What it controls                                                    |
|----------------------------------|---------------------------------------------------------------------|
| Platform Name                    | The branding name shown across the platform                        |
| Support Email                    | The contact email displayed to users inside the mobile app         |
| Max Inspector Area               | The geographic coverage limit for each inspector                   |
| Inspector Response Time          | How long an inspector has to accept a job before reassignment      |
| Urgent Booking Lead Time         | Minimum advance notice required to mark a booking as Urgent        |
| Report Deadline                  | How long an inspector has to submit their report after completing  |
| Platform Commission              | Percentage the platform takes from each inspection payment         |
| Auto-Approve Inspectors          | If on, inspector applications are approved without Admin action    |
| Urgent Inspection Fee            | Extra fee charged when a homeowner marks their booking as Urgent   |
| Late Cancellation Penalty        | Fee applied when a booking is cancelled past the allowed window    |
| Last-Minute Cancellation Penalty | Fee applied for cancellations made at the very last minute         |

---

*Document covers the Admin Dashboard web codebase (fully verified) and Mobile App flows as confirmed
through shared API data structures and booking lifecycle visible in the admin system.*
