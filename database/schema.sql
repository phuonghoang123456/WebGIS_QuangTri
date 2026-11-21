--
-- PostgreSQL database dump
--

\restrict iOBWpaSWIS8u5e0MncCLGWzZpIBSQDvNJNsmR0coFBACcBTYq1gG2UWxvbZjUDe

-- Dumped from database version 17.12
-- Dumped by pg_dump version 17.12

-- Started on 2026-11-22 01:55:29

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16414)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 5961 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 17501)
-- Name: administrative_units; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.administrative_units (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    unit_type character varying(50),
    parent_id integer,
    geom public.geometry(MultiPolygon,4326)
);


--
-- TOC entry 223 (class 1259 OID 17500)
-- Name: administrative_units_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.administrative_units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5962 (class 0 OID 0)
-- Dependencies: 223
-- Name: administrative_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.administrative_units_id_seq OWNED BY public.administrative_units.id;


--
-- TOC entry 228 (class 1259 OID 17526)
-- Name: climate_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.climate_data (
    id bigint NOT NULL,
    station_id integer NOT NULL,
    observation_date date NOT NULL,
    temperature double precision,
    rainfall double precision,
    humidity double precision
);


--
-- TOC entry 227 (class 1259 OID 17525)
-- Name: climate_data_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.climate_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5963 (class 0 OID 0)
-- Dependencies: 227
-- Name: climate_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.climate_data_id_seq OWNED BY public.climate_data.id;


--
-- TOC entry 232 (class 1259 OID 17560)
-- Name: lst_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lst_data (
    id bigint NOT NULL,
    administrative_unit_id integer,
    observation_date date NOT NULL,
    lst_mean double precision,
    lst_min double precision,
    lst_max double precision,
    raster_path text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 231 (class 1259 OID 17559)
-- Name: lst_data_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lst_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5964 (class 0 OID 0)
-- Dependencies: 231
-- Name: lst_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lst_data_id_seq OWNED BY public.lst_data.id;


--
-- TOC entry 230 (class 1259 OID 17542)
-- Name: ndvi_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ndvi_data (
    id bigint NOT NULL,
    administrative_unit_id integer,
    observation_date date NOT NULL,
    ndvi_mean double precision,
    ndvi_min double precision,
    ndvi_max double precision,
    raster_path text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ndvi_data_ndvi_max_check CHECK (((ndvi_max >= ('-1'::integer)::double precision) AND (ndvi_max <= (1)::double precision))),
    CONSTRAINT ndvi_data_ndvi_mean_check CHECK (((ndvi_mean >= ('-1'::integer)::double precision) AND (ndvi_mean <= (1)::double precision))),
    CONSTRAINT ndvi_data_ndvi_min_check CHECK (((ndvi_min >= ('-1'::integer)::double precision) AND (ndvi_min <= (1)::double precision)))
);


--
-- TOC entry 229 (class 1259 OID 17541)
-- Name: ndvi_data_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ndvi_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5965 (class 0 OID 0)
-- Dependencies: 229
-- Name: ndvi_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ndvi_data_id_seq OWNED BY public.ndvi_data.id;


--
-- TOC entry 238 (class 1259 OID 17609)
-- Name: quangtri_boundary_pre2025; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quangtri_boundary_pre2025 (
    id integer NOT NULL,
    geom public.geometry(MultiPolygon,4326),
    shapename character varying(22),
    shapeiso character varying(5),
    shapeid character varying(23),
    shapegroup character varying(3),
    shapetype character varying(4)
);


--
-- TOC entry 237 (class 1259 OID 17608)
-- Name: quangtri_boundary_pre2025_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quangtri_boundary_pre2025_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5966 (class 0 OID 0)
-- Dependencies: 237
-- Name: quangtri_boundary_pre2025_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quangtri_boundary_pre2025_id_seq OWNED BY public.quangtri_boundary_pre2025.id;


--
-- TOC entry 244 (class 1259 OID 24672)
-- Name: scientific_articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scientific_articles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(300) NOT NULL,
    authors character varying(500) NOT NULL,
    publication_year integer NOT NULL,
    abstract text NOT NULL,
    keywords character varying(500),
    category character varying(100) NOT NULL,
    doi character varying(255),
    source_url text,
    pdf_filename character varying(255),
    original_filename character varying(255),
    status character varying(20) NOT NULL,
    rejection_reason text,
    reviewed_by integer,
    reviewed_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- TOC entry 243 (class 1259 OID 24671)
-- Name: scientific_articles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.scientific_articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5967 (class 0 OID 0)
-- Dependencies: 243
-- Name: scientific_articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.scientific_articles_id_seq OWNED BY public.scientific_articles.id;


--
-- TOC entry 234 (class 1259 OID 17575)
-- Name: tvdi_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tvdi_data (
    id bigint NOT NULL,
    administrative_unit_id integer,
    observation_date date NOT NULL,
    tvdi_mean double precision,
    tvdi_min double precision,
    tvdi_max double precision,
    raster_path text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tvdi_data_tvdi_max_check CHECK (((tvdi_max >= (0)::double precision) AND (tvdi_max <= (1)::double precision))),
    CONSTRAINT tvdi_data_tvdi_mean_check CHECK (((tvdi_mean >= (0)::double precision) AND (tvdi_mean <= (1)::double precision))),
    CONSTRAINT tvdi_data_tvdi_min_check CHECK (((tvdi_min >= (0)::double precision) AND (tvdi_min <= (1)::double precision)))
);


--
-- TOC entry 233 (class 1259 OID 17574)
-- Name: tvdi_data_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tvdi_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5968 (class 0 OID 0)
-- Dependencies: 233
-- Name: tvdi_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tvdi_data_id_seq OWNED BY public.tvdi_data.id;


--
-- TOC entry 242 (class 1259 OID 24626)
-- Name: usage_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usage_events (
    id bigint NOT NULL,
    user_id bigint,
    kind character varying(20) NOT NULL,
    analysis_type character varying(20) NOT NULL,
    details character varying(500) DEFAULT ''::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT usage_events_analysis_type_check CHECK (((analysis_type)::text = ANY ((ARRAY['ndvi'::character varying, 'lst'::character varying, 'tvdi'::character varying, 'climate'::character varying])::text[]))),
    CONSTRAINT usage_events_kind_check CHECK (((kind)::text = ANY ((ARRAY['analysis'::character varying, 'csv_export'::character varying])::text[])))
);


--
-- TOC entry 241 (class 1259 OID 24625)
-- Name: usage_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usage_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5969 (class 0 OID 0)
-- Dependencies: 241
-- Name: usage_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usage_events_id_seq OWNED BY public.usage_events.id;


--
-- TOC entry 236 (class 1259 OID 17593)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text,
    role character varying(20) DEFAULT 'USER'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true NOT NULL,
    token_version integer DEFAULT 0 NOT NULL,
    google_sub character varying(255),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['USER'::character varying, 'ADMIN'::character varying])::text[])))
);


--
-- TOC entry 235 (class 1259 OID 17592)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5970 (class 0 OID 0)
-- Dependencies: 235
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 226 (class 1259 OID 17515)
-- Name: weather_stations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.weather_stations (
    id integer NOT NULL,
    station_code character varying(50) NOT NULL,
    station_name character varying(150) NOT NULL,
    location public.geometry(Point,4326),
    description text
);


--
-- TOC entry 225 (class 1259 OID 17514)
-- Name: weather_stations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.weather_stations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5971 (class 0 OID 0)
-- Dependencies: 225
-- Name: weather_stations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.weather_stations_id_seq OWNED BY public.weather_stations.id;


--
-- TOC entry 240 (class 1259 OID 24609)
-- Name: webgis_layers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webgis_layers (
    id integer NOT NULL,
    code character varying(30) NOT NULL,
    name character varying(100) NOT NULL,
    description text NOT NULL,
    source character varying(50) NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    display_order integer NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- TOC entry 239 (class 1259 OID 24608)
-- Name: webgis_layers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.webgis_layers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5972 (class 0 OID 0)
-- Dependencies: 239
-- Name: webgis_layers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.webgis_layers_id_seq OWNED BY public.webgis_layers.id;


--
-- TOC entry 5704 (class 2604 OID 17504)
-- Name: administrative_units id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.administrative_units ALTER COLUMN id SET DEFAULT nextval('public.administrative_units_id_seq'::regclass);


--
-- TOC entry 5706 (class 2604 OID 17529)
-- Name: climate_data id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.climate_data ALTER COLUMN id SET DEFAULT nextval('public.climate_data_id_seq'::regclass);


--
-- TOC entry 5709 (class 2604 OID 17563)
-- Name: lst_data id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lst_data ALTER COLUMN id SET DEFAULT nextval('public.lst_data_id_seq'::regclass);


--
-- TOC entry 5707 (class 2604 OID 17545)
-- Name: ndvi_data id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ndvi_data ALTER COLUMN id SET DEFAULT nextval('public.ndvi_data_id_seq'::regclass);


--
-- TOC entry 5718 (class 2604 OID 17612)
-- Name: quangtri_boundary_pre2025 id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quangtri_boundary_pre2025 ALTER COLUMN id SET DEFAULT nextval('public.quangtri_boundary_pre2025_id_seq'::regclass);


--
-- TOC entry 5724 (class 2604 OID 24675)
-- Name: scientific_articles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scientific_articles ALTER COLUMN id SET DEFAULT nextval('public.scientific_articles_id_seq'::regclass);


--
-- TOC entry 5711 (class 2604 OID 17578)
-- Name: tvdi_data id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tvdi_data ALTER COLUMN id SET DEFAULT nextval('public.tvdi_data_id_seq'::regclass);


--
-- TOC entry 5721 (class 2604 OID 24629)
-- Name: usage_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage_events ALTER COLUMN id SET DEFAULT nextval('public.usage_events_id_seq'::regclass);


--
-- TOC entry 5713 (class 2604 OID 17596)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5705 (class 2604 OID 17518)
-- Name: weather_stations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weather_stations ALTER COLUMN id SET DEFAULT nextval('public.weather_stations_id_seq'::regclass);


--
-- TOC entry 5719 (class 2604 OID 24612)
-- Name: webgis_layers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webgis_layers ALTER COLUMN id SET DEFAULT nextval('public.webgis_layers_id_seq'::regclass);


--
-- TOC entry 5738 (class 2606 OID 17508)
-- Name: administrative_units administrative_units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.administrative_units
    ADD CONSTRAINT administrative_units_pkey PRIMARY KEY (id);


--
-- TOC entry 5747 (class 2606 OID 17531)
-- Name: climate_data climate_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.climate_data
    ADD CONSTRAINT climate_data_pkey PRIMARY KEY (id);


--
-- TOC entry 5749 (class 2606 OID 17533)
-- Name: climate_data climate_data_station_id_observation_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.climate_data
    ADD CONSTRAINT climate_data_station_id_observation_date_key UNIQUE (station_id, observation_date);


--
-- TOC entry 5753 (class 2606 OID 17568)
-- Name: lst_data lst_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lst_data
    ADD CONSTRAINT lst_data_pkey PRIMARY KEY (id);


--
-- TOC entry 5751 (class 2606 OID 17553)
-- Name: ndvi_data ndvi_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ndvi_data
    ADD CONSTRAINT ndvi_data_pkey PRIMARY KEY (id);


--
-- TOC entry 5764 (class 2606 OID 17614)
-- Name: quangtri_boundary_pre2025 quangtri_boundary_pre2025_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quangtri_boundary_pre2025
    ADD CONSTRAINT quangtri_boundary_pre2025_pkey PRIMARY KEY (id);


--
-- TOC entry 5775 (class 2606 OID 24679)
-- Name: scientific_articles scientific_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scientific_articles
    ADD CONSTRAINT scientific_articles_pkey PRIMARY KEY (id);


--
-- TOC entry 5755 (class 2606 OID 17586)
-- Name: tvdi_data tvdi_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tvdi_data
    ADD CONSTRAINT tvdi_data_pkey PRIMARY KEY (id);


--
-- TOC entry 5772 (class 2606 OID 24637)
-- Name: usage_events usage_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage_events
    ADD CONSTRAINT usage_events_pkey PRIMARY KEY (id);


--
-- TOC entry 5757 (class 2606 OID 17607)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5759 (class 2606 OID 17603)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5761 (class 2606 OID 17605)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 5743 (class 2606 OID 17522)
-- Name: weather_stations weather_stations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weather_stations
    ADD CONSTRAINT weather_stations_pkey PRIMARY KEY (id);


--
-- TOC entry 5745 (class 2606 OID 17524)
-- Name: weather_stations weather_stations_station_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weather_stations
    ADD CONSTRAINT weather_stations_station_code_key UNIQUE (station_code);


--
-- TOC entry 5767 (class 2606 OID 24619)
-- Name: webgis_layers webgis_layers_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webgis_layers
    ADD CONSTRAINT webgis_layers_code_key UNIQUE (code);


--
-- TOC entry 5769 (class 2606 OID 24617)
-- Name: webgis_layers webgis_layers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webgis_layers
    ADD CONSTRAINT webgis_layers_pkey PRIMARY KEY (id);


--
-- TOC entry 5739 (class 1259 OID 17539)
-- Name: idx_administrative_geom; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_administrative_geom ON public.administrative_units USING gist (geom);


--
-- TOC entry 5740 (class 1259 OID 17618)
-- Name: idx_administrative_units_geom; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_administrative_units_geom ON public.administrative_units USING gist (geom);


--
-- TOC entry 5770 (class 1259 OID 24643)
-- Name: idx_usage_events_kind_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usage_events_kind_time ON public.usage_events USING btree (kind, created_at DESC);


--
-- TOC entry 5741 (class 1259 OID 17540)
-- Name: idx_weather_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_weather_location ON public.weather_stations USING gist (location);


--
-- TOC entry 5773 (class 1259 OID 24690)
-- Name: ix_scientific_articles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_scientific_articles_user_id ON public.scientific_articles USING btree (user_id);


--
-- TOC entry 5765 (class 1259 OID 17617)
-- Name: sidx_quangtri_boundary_pre2025_geom; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sidx_quangtri_boundary_pre2025_geom ON public.quangtri_boundary_pre2025 USING gist (geom);


--
-- TOC entry 5762 (class 1259 OID 24691)
-- Name: ux_users_google_sub; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ux_users_google_sub ON public.users USING btree (google_sub);


--
-- TOC entry 5776 (class 2606 OID 17509)
-- Name: administrative_units administrative_units_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.administrative_units
    ADD CONSTRAINT administrative_units_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.administrative_units(id);


--
-- TOC entry 5777 (class 2606 OID 17534)
-- Name: climate_data climate_data_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.climate_data
    ADD CONSTRAINT climate_data_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.weather_stations(id);


--
-- TOC entry 5779 (class 2606 OID 17569)
-- Name: lst_data lst_data_administrative_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lst_data
    ADD CONSTRAINT lst_data_administrative_unit_id_fkey FOREIGN KEY (administrative_unit_id) REFERENCES public.administrative_units(id);


--
-- TOC entry 5778 (class 2606 OID 17554)
-- Name: ndvi_data ndvi_data_administrative_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ndvi_data
    ADD CONSTRAINT ndvi_data_administrative_unit_id_fkey FOREIGN KEY (administrative_unit_id) REFERENCES public.administrative_units(id);


--
-- TOC entry 5782 (class 2606 OID 24685)
-- Name: scientific_articles scientific_articles_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scientific_articles
    ADD CONSTRAINT scientific_articles_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- TOC entry 5783 (class 2606 OID 24680)
-- Name: scientific_articles scientific_articles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scientific_articles
    ADD CONSTRAINT scientific_articles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5780 (class 2606 OID 17587)
-- Name: tvdi_data tvdi_data_administrative_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tvdi_data
    ADD CONSTRAINT tvdi_data_administrative_unit_id_fkey FOREIGN KEY (administrative_unit_id) REFERENCES public.administrative_units(id);


--
-- TOC entry 5781 (class 2606 OID 24638)
-- Name: usage_events usage_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage_events
    ADD CONSTRAINT usage_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


-- Completed on 2026-11-22 01:55:31

--
-- PostgreSQL database dump complete
--

\unrestrict iOBWpaSWIS8u5e0MncCLGWzZpIBSQDvNJNsmR0coFBACcBTYq1gG2UWxvbZjUDe

