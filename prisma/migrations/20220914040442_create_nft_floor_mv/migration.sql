BEGIN;

create materialized view nft_floor as (

    with marketplace_events as (

        select 'list' as event,
            block_height,
            to_timestamp(burn_block_time)::date as tx_day,
            tx_hash,
            microblock_sequence,
            tx_index,
            sender_address,
            contract_call_contract_id,
            contract_call_function_name,
            contract_call_function_args,
            collection_contract_id,
            token_id,
            price
        from list_events

        union all

        select 'unlist' as event,
            block_height,
            to_timestamp(burn_block_time)::date as tx_day,
            tx_hash,
            microblock_sequence,
            tx_index,
            sender_address,
            contract_call_contract_id,
            contract_call_function_name,
            contract_call_function_args,
            collection_contract_id,
            token_id,
            null
        from unlist_events

        union all
        
        select 'change-price' as event,
            block_height,
            to_timestamp(burn_block_time)::date as tx_day,
            tx_hash,
            microblock_sequence,
            tx_index,
            sender_address,
            contract_call_contract_id,
            contract_call_function_name,
            contract_call_function_args,
            collection_contract_id,
            token_id,
            price
        from change_price_events

    ), nft_transfers as (
        select block_height, 
            tx_id,
            '0x' || encode(tx_id,'hex') as tx_hash,
            microblock_sequence,
            tx_index,
            index_block_hash,
            microblock_hash,
            split_part(asset_identifier,'::',1) as collection_contract_id,
            ('x' || right(value::bytea::text, 16))::bit(64)::bigint  as token_id
        from nft_events n 
        where n.canonical 
            and n.microblock_canonical
            and n.asset_event_type_id=1
            and asset_identifier!='SP000000000000000000002Q6VF78.bns::names'

    ), events as (
        select 'transfer' as event,
            t.block_height,
            to_timestamp(burn_block_time)::date as tx_day,
            n.tx_hash,
            t.microblock_sequence,
            t.tx_index, 
            t.sender_address,
            t.contract_call_contract_id,
            t.contract_call_function_name,
            t.contract_call_function_args, 
            n.collection_contract_id,
            n.token_id,
            null as price
        from txs t
        join nft_transfers n using (tx_id,index_block_hash,microblock_hash)
        where t.canonical
            and t.microblock_canonical
            and t.status=1
            and not exists (select 1 from  marketplace_events e where e.tx_hash=n.tx_hash)

        union all

        select * from marketplace_events 

            )
    select collection_contract_id,
            date,
            min(price) as floor
    from (
            select *,
            case when event in ('change-price','list')
                then lead(tx_day) over (partition by collection_contract_id, token_id order by block_height,microblock_sequence, tx_index)  
            end as lead_block_time
            from events 
        ) subq
	join (select DATE(generate_series('2021-01-01', now(), interval '1 day'))) d  
        on d.date between tx_day and coalesce(lead_block_time, current_date)
    where event in ('change-price','list')
    group by 1,2 
    order by 1,2
);

CREATE UNIQUE INDEX nft_floor_collection_date_index ON nft_floor (collection_contract_id, date);

COMMIT;