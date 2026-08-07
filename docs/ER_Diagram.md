# ER Diagram

This diagram shows the MVP data model for the vehicle tracking and fleet monitoring system.

```mermaid
erDiagram
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
    DRIVER {
        INTEGER id PK
        TEXT name
        TEXT phone
        TEXT license_number
        TEXT status
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

    VEHICLE ||--o{ DRIVER : "assigned to"
    VEHICLE ||--o{ TRIP : "runs"
    DRIVER ||--o{ TRIP : "drives"
    VEHICLE ||--o{ ALERT : "generates"
    TRIP ||--o{ ALERT : "may relate to"
    VEHICLE ||--o{ MAINTENANCE : "maintains"
    VEHICLE ||--o{ LOCATION_HISTORY : "reports"
```

## Entity descriptions
- `Vehicle`: stores each fleet asset, current status, and assigned driver.
- `Driver`: stores driver details and license information.
- `Trip`: logs journey start/end, origin/destination, and assignment.
- `Alert`: records exceptions such as offline vehicles, over-speed, and maintenance warnings.
- `Maintenance`: tracks scheduled and completed vehicle work.
- `LocationHistory`: stores GPS points and speed history for vehicles.
