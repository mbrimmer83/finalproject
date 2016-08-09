CREATE TABLE users (
  id serial PRIMARY KEY,
  email varchar,
  password varchar,
  name varchar,
  address varchar,
  city varchar,
  zipcode integer
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
  address varchar,
  city varchar,
  zipcode integer
);
 CREATE TABLE transactions (
   id serial PRIMARY KEY,
   lot_id integer REFERENCES lots (id),
   user_id integer REFERENCES users (id),
   transaction_time timestamp default current_timestamp,
   transaction_type varchar,
   transaction_amount varchar
 );
