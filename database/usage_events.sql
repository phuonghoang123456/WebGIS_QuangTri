
CREATE TABLE IF NOT EXISTS public.usage_events (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT
        REFERENCES public.users(id)
        ON DELETE SET NULL,

    kind VARCHAR(20) NOT NULL
        CHECK (kind IN ('analysis', 'csv_export')),

    analysis_type VARCHAR(20) NOT NULL
        CHECK (
            analysis_type IN (
                'ndvi', 'lst', 'tvdi', 'climate'
            )
        ),

    details VARCHAR(500) NOT NULL DEFAULT '',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usage_events_kind_time
ON public.usage_events (kind, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_usage_events_user
ON public.usage_events (user_id);

GRANT SELECT, INSERT
ON public.usage_events TO webgis_app;

GRANT USAGE, SELECT
ON SEQUENCE public.usage_events_id_seq
TO webgis_app;