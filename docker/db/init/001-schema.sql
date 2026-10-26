CREATE TABLE locations (
    id              integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            text NOT NULL
);

CREATE TABLE items (
    id              integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            text NOT NULL,
    location_id     integer NOT NULL REFERENCES locations,
    quantity        numeric NOT NULL DEFAULT 1,
    unit            text, -- "g", "can", "box", or null
    expires_on      date
);
