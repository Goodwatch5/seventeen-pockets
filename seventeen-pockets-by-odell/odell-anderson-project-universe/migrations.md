# Database Migrations for Seventeen Pockets

Automated database schema setup for Supabase.

## Migration Files

### 001\_initial\_schema.sql

* Creates pockets table
* Creates metrics table
* Creates deployment\_logs table
* Creates sync\_history table
* Adds performance indexes
* Inserts initial pocket data (17 pockets)
* Inserts initial metrics

### 002\_add\_rls\_policies.sql

* Enables Row Level Security (RLS)
* Creates public read policies
* Creates authenticated update policies
* Secures data access

### 003\_create\_views.sql

* Creates pocket\_status\_summary view
* Creates deployment\_summary view
* Creates recent\_deployments view
* Enables easy querying

### 004\_create\_functions.sql

* `update_pocket_status()` - Update pocket status
* `get_ready_pockets()` - Get all ready pockets
* `get_deployment_rate()` - Calculate deployment rate
* `log_deployment()` - Log deployment events

### 005\_create\_triggers.sql

* Auto-update timestamps
* Auto-update metrics on pocket changes
* Maintain data consistency

## Running Migrations

### Using Supabase CLI

```bash
supabase db push
```

### Using psql

```bash
psql -h your-host -U postgres -d postgres -f migrations/001_initial_schema.sql
psql -h your-host -U postgres -d postgres -f migrations/002_add_rls_policies.sql
psql -h your-host -U postgres -d postgres -f migrations/003_create_views.sql
psql -h your-host -U postgres -d postgres -f migrations/004_create_functions.sql
psql -h your-host -U postgres -d postgres -f migrations/005_create_triggers.sql
```

## Database Schema

### Tables

**pockets**

* id (PRIMARY KEY)
* name (VARCHAR)
* status (VARCHAR)
* description (TEXT)
* created\_at (TIMESTAMP)
* updated\_at (TIMESTAMP)

**metrics**

* id (PRIMARY KEY)
* uptime (VARCHAR)
* response\_time (VARCHAR)
* error\_rate (VARCHAR)
* deployed\_pockets (INTEGER)
* total\_pockets (INTEGER)
* deployment\_rate (DECIMAL)
* last\_check (TIMESTAMP)
* updated\_at (TIMESTAMP)

**deployment\_logs**

* id (PRIMARY KEY)
* pocket\_id (FOREIGN KEY)
* status (VARCHAR)
* message (TEXT)
* deployed\_at (TIMESTAMP)
* created\_at (TIMESTAMP)

**sync\_history**

* id (PRIMARY KEY)
* pockets\_synced (INTEGER)
* status (VARCHAR)
* sync\_timestamp (TIMESTAMP)
* created\_at (TIMESTAMP)

### Views

**pocket\_status\_summary**

* Shows count and percentage of pockets by status

**deployment\_summary**

* Shows daily deployment statistics

**recent\_deployments**

* Shows last 50 deployments with pocket names

### Functions

**update\_pocket\_status(pocket\_id, new\_status)**

* Updates pocket status and returns updated record

**get\_ready\_pockets()**

* Returns all pockets with 'Ready' status

**get\_deployment\_rate()**

* Calculates current deployment rate percentage

**log\_deployment(pocket\_id, status, message)**

* Logs deployment event and returns record

## Security

* Row Level Security (RLS) enabled on all tables
* Public read access for all tables
* Authenticated users can update pockets and metrics
* Authenticated users can insert deployment logs

## Performance

* Indexes on frequently queried columns
* Views for common queries
* Triggers for automatic updates
* Optimized for real-time monitoring

## Built by

Odell Anderson - Intelligence Dev for Seventeen Pockets Namespace
