# Vehicle Tracking and Fleet Monitoring System

## MVP Overview
This capstone project is a console-based Minimum Viable Product for a vehicle tracking and fleet monitoring system. It includes vehicle registration, driver assignment, trip summaries, alerts, and fleet reporting via a CLI menu.

## MVP Scope
- Vehicle registration and status tracking
- Driver profiles and assignment
- Trip logging and fleet summary
- Alert and fleet health reporting
- SQLite data model for fast prototyping

## Tech Stack
- Node.js
- SQLite
- Console CLI

## Project Structure
- `server.js` - Main console application entry point
- `db/init.js` - Database schema initialization
- `db/fleet.db` - Local SQLite database (generated)
- `docs/ER_Diagram.md` - ER diagram and data model

## Setup
1. Open a terminal in the project folder
2. Run `npm install`
3. Run `npm run init-db` to create the SQLite schema
4. Run `npm start`

## Console Menu
- View vehicles
- Add a vehicle
- Update vehicle status
- View drivers
- Add a driver
- View trips
- View alerts
- Show fleet summary

## ER Diagram
See `docs/ER_Diagram.md` for the entity relationship model, including `Vehicle`, `Driver`, `Trip`, `Alert`, `Maintenance`, and `LocationHistory`.

## Notes
This project now runs in the terminal and is ready for CLI-based fleet management demonstrations.
