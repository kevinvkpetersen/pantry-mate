CREATE TABLE items (
    id              integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            text NOT NULL,
    quantity        numeric NOT NULL DEFAULT 1,
    unit            text, -- "g", "can", "box", or null
    expires_on      date
);
