-- 1. Employees
CREATE TABLE employees (
    id           SERIAL PRIMARY KEY,
    employee_id  VARCHAR(20)  NOT NULL UNIQUE,      -- e.g. EMP101
    name         VARCHAR(100) NOT NULL,
    department   VARCHAR(100) NULL,
    email        VARCHAR(100) NULL,
    status       VARCHAR(20)  DEFAULT 'Active'
);

-- 2. Review periods
CREATE TABLE review_periods (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,               -- e.g. H1 2026
    start_date  DATE        NOT NULL,
    end_date    DATE        NOT NULL,
    status      VARCHAR(20) DEFAULT 'Open',
    CONSTRAINT chk_period_dates  CHECK (end_date >= start_date),
    CONSTRAINT chk_period_status CHECK (status IN ('Open', 'Closed'))
);

-- 3. Performance reviews
CREATE TABLE performance_reviews (
    id               SERIAL PRIMARY KEY,
    employee_id      INTEGER NOT NULL REFERENCES employees(id),
    period_id        INTEGER NOT NULL REFERENCES review_periods(id),
    quality_rating   INTEGER NOT NULL CHECK (quality_rating  BETWEEN 1 AND 5),
    delivery_rating  INTEGER NOT NULL CHECK (delivery_rating BETWEEN 1 AND 5),
    teamwork_rating  INTEGER NOT NULL CHECK (teamwork_rating BETWEEN 1 AND 5),
    average_rating   DECIMAL(3,2) NOT NULL
        GENERATED ALWAYS AS (
            ROUND((quality_rating + delivery_rating + teamwork_rating) / 3.0, 2)
        ) STORED,
    comments         TEXT NULL,
    created_at       TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uq_employee_period UNIQUE (employee_id, period_id)
);