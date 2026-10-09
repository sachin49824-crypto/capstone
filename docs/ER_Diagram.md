# ER Diagram

This diagram shows the MVP data model for the Vehicle Tracking & Fleet Monitoring Platform.

```mermaid
erDiagram

    USER {
        INTEGER id PK
        TEXT name
        TEXT email
        TEXT password
        TEXT role
        TEXT status
    }

    DRIVER {
        INTEGER id PK
        INTEGER user_id FK
        TEXT name
        TEXT phone
        TEXT license_number
        TEXT status
    }

    VEHICLE {
        INTEGER id PK
        TEXT vin
        TEXT plate_number
        TEXT model
        TEXT status
        TEXT current_location
        TEXT last_reported_at
        INTEGER driver_id FK
    }

    TRIP {
        INTEGER id PK
        INTEGER vehicle_id FK
        INTEGER driver_id FK
        TEXT start_time
        TEXT end_time
        TEXT origin
        TEXT destination
        TEXT status
    }

    ALERT {
        INTEGER id PK
        INTEGER vehicle_id FK
        INTEGER trip_id FK
        TEXT type
        TEXT severity
        TEXT message
        TEXT created_at
        TEXT resolved_at
        TEXT status
    }

    MAINTENANCE {
        INTEGER id PK
        INTEGER vehicle_id FK
        TEXT title
        TEXT description
        TEXT scheduled_date
        TEXT completed_date
        TEXT status
    }

    LOCATION_HISTORY {
        INTEGER id PK
        INTEGER vehicle_id FK
        TEXT timestamp
        REAL latitude
        REAL longitude
        REAL speed
        REAL heading
    }

    USER ||--o| DRIVER : "has profile"
    DRIVER ||--o{ VEHICLE : "assigned to"
    DRIVER ||--o{ TRIP : "drives"
    VEHICLE ||--o{ TRIP : "runs"
    VEHICLE ||--o{ ALERT : "generates"
    TRIP ||--o{ ALERT : "may relate to"
    VEHICLE ||--o{ MAINTENANCE : "has"
    VEHICLE ||--o{ LOCATION_HISTORY : "reports"
```

## Entity Descriptions

* `User`: stores login credentials, account status, and user role such as Admin, Fleet Manager, or Driver.
* `Driver`: stores driver-specific information including phone number and license details.
* `Vehicle`: stores fleet vehicle information, current status, current location, and assigned driver.
* `Trip`: records vehicle and driver assignments, journey origin, destination, start/end times, and trip status.
* `Alert`: records vehicle or trip-related events such as offline vehicles, over-speed conditions, and maintenance warnings.
* `Maintenance`: stores scheduled and completed maintenance activities for vehicles.
* `LocationHistory`: stores vehicle location points including latitude, longitude, speed, heading, and timestamp.

## User Roles

The `User` entity supports three main roles:

1. **Admin** – manages users and overall system operations.
2. **Fleet Manager** – manages vehicles, drivers, trips, maintenance, and fleet monitoring.
3. **Driver** – views assigned vehicle and trip information and updates trip-related status.

## Primary Keys and Foreign Keys

* `USER.id` → Primary Key
* `DRIVER.id` → Primary Key
* `DRIVER.user_id` → Foreign Key referencing `USER.id`
* `VEHICLE.id` → Primary Key
* `VEHICLE.driver_id` → Foreign Key referencing `DRIVER.id`
* `TRIP.id` → Primary Key
* `TRIP.vehicle_id` → Foreign Key referencing `VEHICLE.id`
* `TRIP.driver_id` → Foreign Key referencing `DRIVER.id`
* `ALERT.id` → Primary Key
* `ALERT.vehicle_id` → Foreign Key referencing `VEHICLE.id`
* `ALERT.trip_id` → Foreign Key referencing `TRIP.id`
* `MAINTENANCE.id` → Primary Key
* `MAINTENANCE.vehicle_id` → Foreign Key referencing `VEHICLE.id`
* `LOCATION_HISTORY.id` → Primary Key
* `LOCATION_HISTORY.vehicle_id` → Foreign Key referencing `VEHICLE.id`
