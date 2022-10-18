-- trigger functions are not ideal for MV refresh due to possible concurrecnies.
-- however stacks blocks are ~10 minutes apart which makes concurrency implausible.

BEGIN;

CREATE OR REPLACE FUNCTION on_transaction()
RETURNS TRIGGER LANGUAGE plpgsql 
AS $$ 
BEGIN 
    REFRESH MATERIALIZED VIEW CONCURRENTLY unlist_events;
    REFRESH MATERIALIZED VIEW CONCURRENTLY list_events;
    REFRESH MATERIALIZED VIEW CONCURRENTLY change_price_events;
RETURN NULL;
END $$;

CREATE TRIGGER trigger_refresh_marketplace_mv
AFTER INSERT OR UPDATE OR DELETE 
ON txs 
FOR EACH statement 
EXECUTE FUNCTION on_transaction();

COMMIT;