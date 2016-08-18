CREATE TABLE users (
  id serial PRIMARY KEY,
  email varchar,
  password varchar,
  name varchar
);

CREATE TABLE lots (
  id serial PRIMARY KEY,
  lot_user_id integer REFERENCES lot_users (id),
  name varchar,
  address varchar,
  city varchar,
  zipcode integer,
  latitude decimal,
  logitude decimal,
  lot_type varchar,
  amount integer
);

CREATE TABLE lot_users (
  id serial PRIMARY KEY,
  company_name varchar,
  email varchar,
  password varchar,
  name varchar,
  lot_manager boolean
);
 CREATE TABLE transactions (
   id serial PRIMARY KEY,
   lot_id integer REFERENCES lots (id),
   user_id integer REFERENCES users (id),
   transaction_time timestamp default current_timestamp,
   transaction_type varchar,
   transaction_amount varchar,
   transaction_token varchar
 );

CREATE TABLE vehicles (
  id serial PRIMARY KEY,
  lot_id integer REFERENCES lots (id),
  user_id integer REFERENCES users (id),
  ticket_number integer,
  time_needed integer,
  push boolean,
  push_status boolean,
  on_lot boolean,
  request_time timestamp default current_timestamp
);

CREATE TABLE user_login_tokens (
  id serial PRIMARY KEY,
  user_id  integer REFERENCES users (id)
  token varchar,
  login_time timestamp default current_timestamp,
  token_expire timestamp default current_timestamp + interval '1 day'
)

CREATE TABLE lot_user_login_token (
  id serial PRIMARY KEY,
  lot_user_id integer REFERENCES lot_users (id),
  token varchar,
  login_time timestamp default current_timestamp,
  token_expire timestamp default current_timestamp + interval '1 day'
)

CREATE TABLE reviews (
  id serial PRIMARY KEY,
  lot_id integer REFERENCES lots (id),
  user_id integer REFERENCES users (id),
  review_time timestamp default current_timestamp,
  stars integer,
  car_promptly boolean,
  valet_prof boolean,
  valet_engage boolean,
  park_again boolean,
  comments varchar
)
