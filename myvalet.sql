--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.3
-- Dumped by pg_dump version 9.5.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: lot_user_login_token; Type: TABLE; Schema: public; Owner: Matthew
--

CREATE TABLE lot_user_login_token (
    id integer NOT NULL,
    lot_user_id integer,
    token character varying,
    login_time timestamp without time zone DEFAULT now(),
    token_expire timestamp without time zone DEFAULT (now() + '1 day'::interval)
);


ALTER TABLE lot_user_login_token OWNER TO "Matthew";

--
-- Name: lot_user_login_token_id_seq; Type: SEQUENCE; Schema: public; Owner: Matthew
--

CREATE SEQUENCE lot_user_login_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE lot_user_login_token_id_seq OWNER TO "Matthew";

--
-- Name: lot_user_login_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Matthew
--

ALTER SEQUENCE lot_user_login_token_id_seq OWNED BY lot_user_login_token.id;


--
-- Name: lot_users; Type: TABLE; Schema: public; Owner: Matthew
--

CREATE TABLE lot_users (
    id integer NOT NULL,
    company_name character varying,
    email character varying,
    password character varying,
    name character varying,
    lot_manager boolean DEFAULT true
);


ALTER TABLE lot_users OWNER TO "Matthew";

--
-- Name: lot_users_id_seq; Type: SEQUENCE; Schema: public; Owner: Matthew
--

CREATE SEQUENCE lot_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE lot_users_id_seq OWNER TO "Matthew";

--
-- Name: lot_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Matthew
--

ALTER SEQUENCE lot_users_id_seq OWNED BY lot_users.id;


--
-- Name: lots; Type: TABLE; Schema: public; Owner: Matthew
--

CREATE TABLE lots (
    id integer NOT NULL,
    lot_user_id integer,
    name character varying,
    address character varying,
    city character varying,
    zipcode integer,
    latitude numeric,
    logitude numeric,
    lot_type character varying,
    amount integer
);


ALTER TABLE lots OWNER TO "Matthew";

--
-- Name: lots_id_seq; Type: SEQUENCE; Schema: public; Owner: Matthew
--

CREATE SEQUENCE lots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE lots_id_seq OWNER TO "Matthew";

--
-- Name: lots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Matthew
--

ALTER SEQUENCE lots_id_seq OWNED BY lots.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: Matthew
--

CREATE TABLE reviews (
    id integer NOT NULL,
    lot_id integer,
    user_id integer,
    review_time timestamp without time zone DEFAULT now(),
    stars integer,
    car_promptly boolean,
    valet_prof boolean,
    valet_engage boolean,
    park_again boolean,
    comments character varying
);


ALTER TABLE reviews OWNER TO "Matthew";

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: Matthew
--

CREATE SEQUENCE reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE reviews_id_seq OWNER TO "Matthew";

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Matthew
--

ALTER SEQUENCE reviews_id_seq OWNED BY reviews.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: Matthew
--

CREATE TABLE transactions (
    id integer NOT NULL,
    lot_id integer,
    user_id integer,
    transaction_time timestamp without time zone DEFAULT now(),
    transaction_type character varying,
    transaction_amount character varying,
    transaction_token character varying,
    ticket_number integer,
    user_name character varying
);


ALTER TABLE transactions OWNER TO "Matthew";

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: Matthew
--

CREATE SEQUENCE transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE transactions_id_seq OWNER TO "Matthew";

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Matthew
--

ALTER SEQUENCE transactions_id_seq OWNED BY transactions.id;


--
-- Name: user_login_tokens; Type: TABLE; Schema: public; Owner: Matthew
--

CREATE TABLE user_login_tokens (
    id integer NOT NULL,
    user_id integer,
    token character varying,
    login_time timestamp without time zone DEFAULT now(),
    token_expire timestamp without time zone DEFAULT (now() + '1 day'::interval)
);


ALTER TABLE user_login_tokens OWNER TO "Matthew";

--
-- Name: user_login_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: Matthew
--

CREATE SEQUENCE user_login_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_login_tokens_id_seq OWNER TO "Matthew";

--
-- Name: user_login_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Matthew
--

ALTER SEQUENCE user_login_tokens_id_seq OWNED BY user_login_tokens.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: Matthew
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying,
    password character varying,
    name character varying,
    lot_manager boolean DEFAULT false
);


ALTER TABLE users OWNER TO "Matthew";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: Matthew
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO "Matthew";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Matthew
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: Matthew
--

CREATE TABLE vehicles (
    id integer NOT NULL,
    lot_id integer,
    user_id integer,
    ticket_number integer,
    time_needed integer,
    push boolean,
    push_status boolean,
    on_lot boolean,
    request_time timestamp without time zone DEFAULT now()
);


ALTER TABLE vehicles OWNER TO "Matthew";

--
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: Matthew
--

CREATE SEQUENCE vehicles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE vehicles_id_seq OWNER TO "Matthew";

--
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Matthew
--

ALTER SEQUENCE vehicles_id_seq OWNED BY vehicles.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY lot_user_login_token ALTER COLUMN id SET DEFAULT nextval('lot_user_login_token_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY lot_users ALTER COLUMN id SET DEFAULT nextval('lot_users_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY lots ALTER COLUMN id SET DEFAULT nextval('lots_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY reviews ALTER COLUMN id SET DEFAULT nextval('reviews_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY transactions ALTER COLUMN id SET DEFAULT nextval('transactions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY user_login_tokens ALTER COLUMN id SET DEFAULT nextval('user_login_tokens_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY vehicles ALTER COLUMN id SET DEFAULT nextval('vehicles_id_seq'::regclass);


--
-- Data for Name: lot_user_login_token; Type: TABLE DATA; Schema: public; Owner: Matthew
--

COPY lot_user_login_token (id, lot_user_id, token, login_time, token_expire) FROM stdin;
1	1	w5XtxodfOPp6kEhpcKkDMspaU4E9rn5p82u8ZEQ5b0Xop0U5g0nt5Hbu8jraqlF9	2016-08-15 16:55:41.396994	2016-08-16 16:55:41.396994
2	1	m56z25NBvG6Vhcs4sg1m64YDP2XfwIVmS6qisQMsew9HqfiON4UIjVKY7UYs2I33	2016-08-17 15:53:58.237843	2016-08-18 15:53:58.237843
3	1	Zjrpw5BrPG0UlyGT57q7yJlfCGqevmzPnXNtb4a3SmtnyTksYVplmt9JMi4hg26D	2016-08-17 15:57:04.628736	2016-08-18 15:57:04.628736
4	1	P9NG0IRHHMZk27lJjHHn0X2mbruyrV3r8hSiDdUMlcF4akjY3d3VhmpBUzkmkfeD	2016-08-17 16:00:01.682265	2016-08-18 16:00:01.682265
5	1	7ybZCytt3zLSgh9O8pJoWMswJFgOseu62fJABTH6XRNoXIRGKmIsKvu2ySPMf8LU	2016-08-17 16:02:42.496861	2016-08-18 16:02:42.496861
6	1	ukSoHGaUkTieNiNtuG6VJRWkhqWAYVy5gZUmQi5qKJT7nFc9Lwo4wj71EWjlELch	2016-08-17 16:06:12.509284	2016-08-18 16:06:12.509284
7	1	5qrwsQiUcUflfu2eEaNNFvXRsyhJEUgULM2PzO0aKe1pqNyC1EgfP0XssdaEp1zy	2016-08-17 16:14:07.791488	2016-08-18 16:14:07.791488
8	1	KMonk69JPQvz5QAXUTDztlgPXPF8nuPN6z4YOfYpts77268OOa3DG45Nnb779Td8	2016-08-17 16:20:06.778235	2016-08-18 16:20:06.778235
9	1	tV3SHQUlt39cMozPkLCngF6X9hjhncpbX4xqQ4JkyAO0adZhDgY1iqctgJtj5wtx	2016-08-17 16:24:20.667437	2016-08-18 16:24:20.667437
10	1	9gvz4WDcC1sQ1EBBCn6mT85Ab8zrpYIJK2ZZFGmlFsSvSiN3ycqCHRTjjwp5ipM4	2016-08-17 16:25:33.3876	2016-08-18 16:25:33.3876
11	1	1tskuY6qZEcL8kMkqEoatsl6brjLvL1vCxGX84LVvRUhzmDEQjbO6KoIDvh9prPG	2016-08-17 20:18:15.621729	2016-08-18 20:18:15.621729
12	1	9zV2wTOLqnwGrAt38Rb2vr4UpcW6HU2MVBJJYQEgk31xZOvKsoPoPbxGVaANYHXL	2016-08-17 20:25:01.896331	2016-08-18 20:25:01.896331
13	1	4Y6UWjt1QLXKGSZSMj46VzJyKWj5QSN36d3SBJgPBJj7kgAZ3ytrgxKDGDpcm44o	2016-08-19 09:08:49.697373	2016-08-20 09:08:49.697373
14	1	yxdl1ZKXSXNyE7sxgkJfEgR5yuGtK8EjNJiKYm8FwfvXnIyDgZ9RnsARaraSNdrC	2016-08-19 09:10:18.092609	2016-08-20 09:10:18.092609
\.


--
-- Name: lot_user_login_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Matthew
--

SELECT pg_catalog.setval('lot_user_login_token_id_seq', 14, true);


--
-- Data for Name: lot_users; Type: TABLE DATA; Schema: public; Owner: Matthew
--

COPY lot_users (id, company_name, email, password, name, lot_manager) FROM stdin;
1	Ameripark	mwingert@gmail.com	$2a$10$Hay847V6b/3u9A6HdRFX..UeL0YhkMgq5EbcCPWOU4sDCtPokN7xu	Mike Wingert	t
\.


--
-- Name: lot_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Matthew
--

SELECT pg_catalog.setval('lot_users_id_seq', 1, true);


--
-- Data for Name: lots; Type: TABLE DATA; Schema: public; Owner: Matthew
--

COPY lots (id, lot_user_id, name, address, city, zipcode, latitude, logitude, lot_type, amount) FROM stdin;
1	1	Home Cookin	292 Supper Club Rd	Dallas	30132	33.945952	-84.931280	pay	15
2	1	Resturant	100 Peachtree Rd	Atlanta	30326	33.748994	-84.388050	comp	0
3	1	Lenox Mall	3393 Peachtree Rd	Atlanta	30326	33.846469	-84.362657	pay	8
4	1	Meehans	322 East Paces Ferry Rd	Atlanta	30101	33.839575	-84.377088	comp	0
5	1	Fogo de Chao	3101 Piedmont Rd NE	Atlanta	30101	33.840656	-84.369370	comp	0
\.


--
-- Name: lots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Matthew
--

SELECT pg_catalog.setval('lots_id_seq', 5, true);


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: Matthew
--

COPY reviews (id, lot_id, user_id, review_time, stars, car_promptly, valet_prof, valet_engage, park_again, comments) FROM stdin;
1	5	1	2016-08-17 11:45:19.691579	5	t	t	t	t	The lot was awesome!
2	3	1	2016-08-17 11:47:22.20038	5	t	\N	t	\N	\N
4	5	1	2016-08-17 11:49:36.602235	5	t	\N	t	\N	\N
5	5	1	2016-08-17 11:49:42.796698	5	t	\N	t	\N	\N
6	5	1	2016-08-17 11:50:30.997272	5	t	\N	t	\N	\N
7	5	1	2016-08-17 11:52:31.25089	5	t	\N	t	\N	\N
8	5	1	2016-08-17 11:54:56.153131	5	t	f	t	f	kjsdhk
9	5	1	2016-08-17 11:56:56.298655	5	t	f	t	f	kjsdhk
10	5	1	2016-08-17 13:37:59.123426	5	t	t	t	t	Great services!
11	5	1	2016-08-17 13:42:34.320387	5	t	t	t	t	Great service!
12	5	1	2016-08-17 13:44:34.820962	5	t	t	t	t	Great service!
13	5	1	2016-08-17 13:45:17.509793	5	t	t	t	t	Great Service!
14	5	1	2016-08-17 13:46:11.691118	3	t	t	t	t	Could be better!
15	5	1	2016-08-17 13:47:01.42134	3	t	t	t	t	Expected Better!
16	5	1	2016-08-17 13:48:01.661275	3	t	t	t	t	Ok service
17	5	1	2016-08-17 13:49:01.256158	4	t	t	t	t	Good
18	5	1	2016-08-17 13:51:01.351788	2	t	t	t	t	Not so good, slow service
19	5	1	2016-08-17 13:55:29.318212	4	t	t	t	t	Ok service
20	5	1	2016-08-17 14:20:13.072978	5	t	t	t	t	Matt is the best!
21	5	1	2016-08-17 14:26:57.34519	5	t	t	t	t	Great service
22	3	1	2016-08-17 14:32:50.333537	5	t	t	t	t	Ok
23	4	1	2016-08-18 13:41:29.580545	4	t	t	t	t	This lot rules!
24	3	1	2016-08-18 14:54:55.549316	5	t	t	t	t	Loved the service!
\.


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Matthew
--

SELECT pg_catalog.setval('reviews_id_seq', 24, true);


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: Matthew
--

COPY transactions (id, lot_id, user_id, transaction_time, transaction_type, transaction_amount, transaction_token, ticket_number, user_name) FROM stdin;
1	4	1	2016-08-18 14:32:35.63958	comp	1200	tok_18jvJbE47dGhAaW4U0uLEz1V	777222	Matthew Brimmer
2	3	1	2016-08-18 14:54:37.64739	pay	2000	tok_18jvevE47dGhAaW4xY6NTrXy	785345	Matthew Brimmer
\.


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Matthew
--

SELECT pg_catalog.setval('transactions_id_seq', 2, true);


--
-- Data for Name: user_login_tokens; Type: TABLE DATA; Schema: public; Owner: Matthew
--

COPY user_login_tokens (id, user_id, token, login_time, token_expire) FROM stdin;
1	1	ZJJqd9K24f0NNcR5TR4xlMRMcLOfDfaho5QxyPb9BhVKXLlZBnUZ15eLvBLY1yry	2016-08-15 15:50:47.396128	2016-08-16 15:50:47.396128
35	1	GBAvQSR7zkJiXC9RHaiTZQl6INA0MDvLUk4lvdUtXAG5kfTGCmQixUk9Sh5Dab1x	2016-08-16 11:21:23.323497	2016-08-17 11:21:23.323497
36	1	6v2qrLvvx6OQ84bj3GEBTTfVnmmvQCfsesFkhvwtGA8C9zX64mOiz8c9rLrgwKHj	2016-08-16 11:45:06.534353	2016-08-17 11:45:06.534353
37	1	PyGCM7N5rrAZ3RUUT8xMBYmvbSfYJXEVrze6GESKKRxxEQBKj5xPgAmHjU7bVrVu	2016-08-16 11:45:45.566518	2016-08-17 11:45:45.566518
38	1	tsmuHF5hDRuSRoTiuwZH3342Jz7HD9LG4sImjVW5Wg4TAquhTyj7MArxJ0zfam75	2016-08-16 11:47:18.364274	2016-08-17 11:47:18.364274
39	1	EjBh66BHQcN9nB8Mh50NAzJxvZSOpv6eLwkdNLSjwoEoG1gf1pqhWs81dAEpnqu5	2016-08-16 11:48:04.116522	2016-08-17 11:48:04.116522
40	1	BTnhbHBlGKKXbcQ1XBPlAp5s0GXsJ1zqu2txOyQ40s1aywoCzG2pqrZwH6yOtjxt	2016-08-16 11:59:07.211337	2016-08-17 11:59:07.211337
41	1	77V6YGcS7G44wKTjg7ac7saKdCCtTfUW5x8HxCOBfscyDBqDCZvCWG9tqxKaKtew	2016-08-16 12:57:40.72203	2016-08-17 12:57:40.72203
42	1	uIAO6FV7WCPHsJ1NlcOgtBMqtPQl9XuCJSQ5cvJlIMl9NfOGsDV09nAo588xvchR	2016-08-16 13:02:19.162087	2016-08-17 13:02:19.162087
43	1	Tw64i2HdfBQ7rbBHRE2ms0dOvEnmaBwyU1ZLNiXNrwXXFDYlBLNqmr2cgSdxJOMl	2016-08-16 13:04:04.243455	2016-08-17 13:04:04.243455
44	1	J2W5oM9HFSBsGFQvz7PQpFzBi4zRwrn1Yzu83kDKRBIetOFv2Vgcj4A0U8OoWEZV	2016-08-16 13:04:54.988754	2016-08-17 13:04:54.988754
45	1	8CqBcNhYZjSC3rLWMD6WDt6rkrik3tHZruCBemgYj88R2GbMVIf5WL8e9T9BqYKQ	2016-08-16 13:06:04.523014	2016-08-17 13:06:04.523014
46	1	AH6TqezpVEFLfVIOdofj5f4WfIjQcGEWv6TzCx4oRnvqSsMHlkz5oyFbzt3nMV5W	2016-08-16 13:10:37.765046	2016-08-17 13:10:37.765046
47	1	uu4vhZEG0HAGFpsOzb9pdLuxhiXdNoDMKnsZQd8XXymklUALPgLZH4zZFW36KD72	2016-08-16 13:13:14.284933	2016-08-17 13:13:14.284933
48	1	fMOsOhZKn9f96cFDGdZif6P5oxyZQMOgooKqqEBMOxFSY8UIebETHqP9yJnOtrdL	2016-08-16 14:53:56.625811	2016-08-17 14:53:56.625811
49	1	Ri7BYOEaPxYSmIgsBcrsDzyijj9xOFSQh2IOlgO5uME5W1PDI21YZDejzLgT789e	2016-08-16 15:02:08.229105	2016-08-17 15:02:08.229105
50	1	gqkA0vbRNNnFOTEZz4t9whnu5VLUJiUIADaNLUPBmlpryZfkJ3PLwwkQ94xByuqB	2016-08-16 15:03:26.003315	2016-08-17 15:03:26.003315
51	1	umtWNP4SBamYFdlQhSKe5hreaivKAc7OqsLMbF7jpJg9uZGusfXFMsHu7vZwguHY	2016-08-16 15:14:16.202792	2016-08-17 15:14:16.202792
52	1	rHi2U5XIb29eT8Kn1x2GfjDhOBzrb82s1F8Ofds3FFwS5k5B6QEDvfkfIz9k8QK7	2016-08-16 15:17:01.748155	2016-08-17 15:17:01.748155
53	1	yHGviZVnlok6M5WQ8YOk30jrQmH2PfwTn4XKKmCjHulllTVo8HaSwp7R0KHCobs1	2016-08-16 15:32:33.971477	2016-08-17 15:32:33.971477
54	1	6n1ESxfHB1qc5cTkdejdGSDBiEqGS9Z2wQcz0YtLY70gK7eGQ1gczOZC7VY4eBTr	2016-08-16 15:45:51.248072	2016-08-17 15:45:51.248072
55	1	mtMFYxrJDNwUtmQRKwzQr44HwyIWKy5X17p3yaYGDaJ8FnBNmQlUa6JMtEKd6DWV	2016-08-16 15:48:51.539472	2016-08-17 15:48:51.539472
56	1	dtRU7DIPea63ab3AGtQmPFDChV7xrxyKdvJdXIIuoKii1UVYFTN7aIIAsTeDidYn	2016-08-17 11:23:16.060252	2016-08-18 11:23:16.060252
57	1	K8qtporFVGTscP4lASMipnOAHL25s6QQsk0DVDuyDmpA2EV0xQALlMWOcnLcuRGr	2016-08-17 11:24:24.258509	2016-08-18 11:24:24.258509
58	1	VoLhKUKqUkBLBYUgzbweQlPcY9lZKiBcutHhJG6z9ZphjTdkmgruphjMcnHRTx3E	2016-08-17 14:28:32.966913	2016-08-18 14:28:32.966913
59	1	fQXlh1b6HMNEOohc6iDVntplJiiVbqQXUh1auHzImPGQoGrGWq08olTIbk2w0Y3G	2016-08-17 15:24:08.43906	2016-08-18 15:24:08.43906
60	1	9UEpChSogwHw7XnlG931KiJ2Qf1Vq1Qd1pgJTuTS7lQDN1bL91ZonpIaOHDycfJO	2016-08-17 15:47:10.064332	2016-08-18 15:47:10.064332
61	1	Oy2NtHtiNEPvjsm3sSyorATcTkVe19Pb16edXYqm7YAazBJoKQvXkCq88hy0xGlH	2016-08-17 15:48:17.306783	2016-08-18 15:48:17.306783
62	1	D4eKXXScTcKZK6YqEKTdJ3OmjqFDgnVnK3hY9KFIF3egazY6qp3jjm4RQa5d1z8k	2016-08-17 15:55:31.642972	2016-08-18 15:55:31.642972
63	1	GbeCPx5fHTNKJknqRJghSpvniMTMyTlto1laiDBchaDIvU85G8vwOHzGAvfTwePg	2016-08-17 15:59:17.299125	2016-08-18 15:59:17.299125
64	1	RVu3D7fScqxY2zYXMQ36fPkftO3XR9TzpWDE2ms8UqjlDFFwe7jQc648THNjx60V	2016-08-17 16:00:58.411806	2016-08-18 16:00:58.411806
65	1	KzkOyJG8A8O8Yh3uCRVOVwwOtytOtJrzhF87tYmPYVOOe6M7a0e5QDNtHdmTCHqk	2016-08-17 16:03:14.556341	2016-08-18 16:03:14.556341
66	1	J33hKdOM7GUpdzXTmjhsnfgRT67b2KLWWr1bEibMX3ibH6mXwOZIik1Hoqjx2914	2016-08-17 16:05:43.943396	2016-08-18 16:05:43.943396
67	1	eAonn9DkgajB1ffJa4CDxWbrW5K8n8j0MeTOp2SXOtdyQqdUX8sgSxjaX1MImucW	2016-08-17 16:07:55.043878	2016-08-18 16:07:55.043878
68	1	kDGMxkNvbRKDHdsk2PgzvjKZmOwFMgI0gChn4SrM0iVI63zMXcbVTJsXkNnuKuYa	2016-08-17 16:10:23.463019	2016-08-18 16:10:23.463019
69	1	rgnVzdQLyoKwKBozMiNtvO7ePMY2PhxqkLQOekw3Z3VhCmyVw5Hfv3Lg6woGP4hT	2016-08-17 16:13:52.853015	2016-08-18 16:13:52.853015
70	1	EiVejDq5H4BSdng20JUBR8vwEZDtZE5ewi72Ee5Nyb66wtzeGXsYXpwllEsrkSDP	2016-08-17 16:21:38.071431	2016-08-18 16:21:38.071431
71	1	elywmgIICzADoG6CtmzOZgLo07gy4SIjwEBGAo9cWM5JgqL0BzVvXJeOybQ9yKlj	2016-08-17 16:24:07.867431	2016-08-18 16:24:07.867431
72	1	C0AC3AZ6VHpP11zxVOppjDQZo6ETTJQImC8PaRPV7t8flC2W9nDcWUkl6rWxg02L	2016-08-17 20:20:18.922344	2016-08-18 20:20:18.922344
\.


--
-- Name: user_login_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Matthew
--

SELECT pg_catalog.setval('user_login_tokens_id_seq', 72, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: Matthew
--

COPY users (id, email, password, name, lot_manager) FROM stdin;
1	mbrimmer1@gmail.com	$2a$10$ilyfe4H0ChzNIcCEo.fDM.nhi3/qADP5D7.xiJ3US8.R7EX26I44a	Matthew Brimmer	f
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Matthew
--

SELECT pg_catalog.setval('users_id_seq', 2, true);


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: Matthew
--

COPY vehicles (id, lot_id, user_id, ticket_number, time_needed, push, push_status, on_lot, request_time) FROM stdin;
20	3	1	123456	10	t	f	t	2016-08-11 16:55:20.952829
26	3	1	123456	15	t	f	t	2016-08-11 17:07:23.772652
31	3	1	123456	15	t	f	t	2016-08-11 17:13:54.750252
32	3	1	123456	15	t	f	t	2016-08-11 17:14:37.412137
33	3	1	123456	15	t	f	t	2016-08-11 17:16:37.407476
41	5	1	123456	15	t	f	t	2016-08-12 10:59:43.037755
42	5	1	123456	15	t	f	t	2016-08-12 13:48:18.393649
43	5	1	123456	15	t	f	t	2016-08-12 13:50:07.228655
44	5	1	123456	15	t	f	t	2016-08-12 13:52:07.234309
45	5	1	123456	15	t	f	t	2016-08-12 13:54:40.818083
46	5	1	123456	15	t	f	t	2016-08-12 13:56:11.193021
47	5	1	123456	15	t	f	t	2016-08-12 13:56:40.813387
48	5	1	123456	15	t	f	t	2016-08-12 13:58:11.204949
49	5	1	123456	15	t	f	t	2016-08-12 13:59:50.203156
50	5	1	456123	5	t	f	t	2016-08-12 14:00:27.760868
51	5	1	123456	10	t	f	t	2016-08-12 14:01:23.236003
52	5	1	123456	10	t	f	t	2016-08-12 14:01:53.781765
53	5	1	123789	0	t	f	t	2016-08-12 14:02:16.656653
54	5	1	123789	0	t	f	t	2016-08-12 14:04:16.681268
55	5	1	123789	0	t	f	t	2016-08-12 14:13:17.569316
56	5	1	123456	15	t	f	t	2016-08-12 14:15:08.679029
57	5	1	123456	10	t	f	t	2016-08-12 14:15:42.810088
58	5	1	123456	10	t	f	t	2016-08-12 14:17:42.829022
60	5	1	123456	15	t	f	t	2016-08-12 14:23:44.207265
61	5	1	123456	10	t	f	t	2016-08-12 14:25:52.130848
62	5	1	123456	10	t	f	t	2016-08-12 14:26:48.437927
63	5	1	123456	5	t	f	t	2016-08-12 14:27:32.516555
64	1	1	123456	\N	t	f	t	2016-08-15 20:55:34.429117
65	4	1	123456	15	t	f	t	2016-08-16 10:52:46.654564
66	5	1	123456	10	t	f	t	2016-08-16 13:10:55.43527
67	5	1	123456	10	t	f	t	2016-08-16 13:13:30.987111
68	5	1	123456	10	t	f	t	2016-08-16 13:15:31.013871
69	5	1	123456	10	t	f	t	2016-08-16 13:17:31.017433
70	5	1	123456	10	t	f	t	2016-08-16 14:54:20.345738
71	3	1	123456	10	t	f	t	2016-08-16 15:02:27.247755
73	5	1	123456	15	t	f	t	2016-08-16 15:13:02.594555
74	5	1	123456	10	t	f	t	2016-08-16 15:32:54.246925
75	5	1	123456	5	t	f	t	2016-08-16 15:49:16.861103
76	5	1	123456	5	t	f	t	2016-08-16 15:51:16.952864
77	5	1	123456	5	t	f	t	2016-08-17 13:56:01.984785
78	5	1	223	5	t	f	t	2016-08-17 14:19:03.980606
79	5	1	123456	10	t	f	t	2016-08-18 10:26:47.910123
80	3	1	123456	0	t	f	t	2016-08-18 11:01:32.146599
82	5	1	987123	15	t	f	t	2016-08-18 11:07:01.903875
1	5	1	123456	10	t	f	f	2016-08-11 10:19:53.322878
40	5	1	123456	15	t	f	f	2016-08-12 10:57:43.047354
72	4	1	123456	15	t	f	f	2016-08-16 15:07:13.37219
2	5	1	123456	10	t	f	f	2016-08-11 10:21:53.321428
3	5	1	123456	15	t	f	f	2016-08-11 15:35:40.201918
4	5	1	123456	10	t	f	f	2016-08-11 15:38:45.909218
5	5	1	123456	10	t	f	f	2016-08-11 15:40:45.906972
6	5	1	123456	10	t	f	f	2016-08-11 15:42:30.215645
7	5	1	123456	10	t	f	f	2016-08-11 15:44:30.237637
8	5	1	123456	15	t	f	f	2016-08-11 15:45:49.156649
9	5	1	123456	15	t	f	f	2016-08-11 15:53:02.699748
81	3	1	123456	0	t	f	f	2016-08-18 11:03:32.287117
21	3	1	123456	15	t	f	f	2016-08-11 16:58:38.761059
22	3	1	123456	15	t	f	f	2016-08-11 16:59:17.074077
23	3	1	123456	15	t	f	f	2016-08-11 17:00:38.765965
24	3	1	123456	15	t	f	f	2016-08-11 17:01:17.076204
25	3	1	123456	15	t	f	f	2016-08-11 17:05:37.130069
83	5	1	456123	0	t	f	f	2016-08-18 13:17:18.982102
27	3	1	123456	15	t	f	f	2016-08-11 17:07:37.090219
28	3	1	123456	15	t	f	f	2016-08-11 17:09:18.015085
29	3	1	123456	15	t	f	f	2016-08-11 17:09:23.765583
30	3	1	123456	15	t	f	f	2016-08-11 17:11:18.032103
84	4	1	789456	10	t	f	t	2016-08-18 13:18:25.155046
85	3	1	543999	10	t	f	t	2016-08-18 13:19:04.16513
10	5	1	123456	15	t	f	f	2016-08-11 15:58:20.378297
11	5	1	123456	10	t	f	f	2016-08-11 15:59:50.985668
12	5	1	123456	15	t	f	f	2016-08-11 16:31:21.351549
13	5	1	123456	15	t	f	f	2016-08-11 16:33:21.36643
14	5	1	123456	15	t	f	f	2016-08-11 16:36:34.097661
15	5	1	123456	15	t	f	f	2016-08-11 16:38:34.096958
16	5	1	123456	15	t	f	f	2016-08-11 16:43:35.132778
17	5	1	123456	15	t	f	f	2016-08-11 16:45:35.169985
18	5	1	123456	10	t	f	f	2016-08-11 16:50:24.597606
19	5	1	123456	10	t	f	f	2016-08-11 16:52:24.61798
34	5	1	123456	10	t	f	f	2016-08-12 10:03:59.479626
35	5	1	123456	10	t	f	f	2016-08-12 10:04:54.725093
36	5	1	123456	10	t	f	f	2016-08-12 10:06:54.707175
37	5	1	123456	10	t	f	f	2016-08-12 10:18:11.256638
38	5	1	123456	10	t	f	f	2016-08-12 10:20:11.238301
39	5	1	123456	10	t	f	f	2016-08-12 10:38:32.614686
86	4	1	999000	15	t	f	t	2016-08-18 13:22:23.785047
87	3	1	111777	0	t	f	t	2016-08-18 13:22:51.60834
88	5	1	111654	5	t	f	t	2016-08-18 13:23:19.296992
90	3	1	785345	5	t	f	t	2016-08-18 14:44:44.925607
59	4	1	123456	10	t	f	f	2016-08-12 14:19:14.834642
89	4	1	674248	10	t	f	f	2016-08-18 14:44:02.551306
\.


--
-- Name: vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Matthew
--

SELECT pg_catalog.setval('vehicles_id_seq', 90, true);


--
-- Name: lot_user_login_token_pkey; Type: CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY lot_user_login_token
    ADD CONSTRAINT lot_user_login_token_pkey PRIMARY KEY (id);


--
-- Name: lot_users_pkey; Type: CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY lot_users
    ADD CONSTRAINT lot_users_pkey PRIMARY KEY (id);


--
-- Name: lots_pkey; Type: CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY lots
    ADD CONSTRAINT lots_pkey PRIMARY KEY (id);


--
-- Name: reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: user_login_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY user_login_tokens
    ADD CONSTRAINT user_login_tokens_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: lot_user_login_token_lot_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY lot_user_login_token
    ADD CONSTRAINT lot_user_login_token_lot_user_id_fkey FOREIGN KEY (lot_user_id) REFERENCES lot_users(id);


--
-- Name: reviews_lot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY reviews
    ADD CONSTRAINT reviews_lot_id_fkey FOREIGN KEY (lot_id) REFERENCES lots(id);


--
-- Name: reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: transactions_lot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_lot_id_fkey FOREIGN KEY (lot_id) REFERENCES lots(id);


--
-- Name: transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: user_login_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY user_login_tokens
    ADD CONSTRAINT user_login_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: vehicles_lot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Matthew
--

ALTER TABLE ONLY vehicles
    ADD CONSTRAINT vehicles_lot_id_fkey FOREIGN KEY (lot_id) REFERENCES lots(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

