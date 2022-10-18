BEGIN;

-- CreateTable
CREATE MATERIALIZED VIEW IF NOT EXISTS list_events as (
with transactions as (
        select block_height,
                burn_block_time,
                tx_id,
                index_block_hash,
                microblock_sequence,
		microblock_hash,
		tx_index,
                sender_address,
                contract_call_contract_id,
                contract_call_function_name,
                contract_call_function_args
        from txs
        where canonical
        and microblock_canonical
        and status=1
        and contract_call_function_name in ('list-asset',
                                            'list-item',
                                            'list-in-ustx',
                                            'list-punk')
 )
select t.block_height,
        t.burn_block_time,
        '0x' || encode(t.tx_id,'hex') as tx_hash, 
        t.microblock_sequence,
        t.tx_index,
        sender_address,
        t.contract_call_contract_id,
        t.contract_call_function_name,
        t.contract_call_function_args, 

        case when n.asset_identifier is not null then split_part(n.asset_identifier,'::',1) else contract_call_contract_id end as collection_contract_id,
        
        case when n.value is not null 
                then ('x' || right(value::bytea::text, 16))::bit(64)::bigint 
          when contract_call_function_name='list-in-ustx' 
                then ('x' || right(split_part(contract_call_function_args::text,'01000000',2), 16))::bit(64)::bigint
        end 											                as token_id,

        case when contract_call_contract_id = 'SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.stacks-art-market-v2'
                  then ('x' || right(split_part(contract_call_function_args::text,'01000000',4), 16))::bit(64)::bigint
                when contract_call_contract_id='SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.stacks-art-market'
                  then ('x' || right(split_part(contract_call_function_args::text,'01000000',4), 16))::bit(64)::bigint
                when contract_call_function_name='list-in-ustx' 
                  then ('x' || right(substring(contract_call_function_args::text, 45, 34), 16))::bit(64)::bigint
                else  ('x' || right(split_part(contract_call_function_args::text,'01000000',3), 16))::bit(64)::bigint
                end                                                                                               as price
from transactions t 
 left join nft_events n on t.tx_id=n.tx_id 
            and t.index_block_hash=n.index_block_hash 
            and t.microblock_hash=n.microblock_hash
            and n.canonical 
            and n.microblock_canonical
            and n.asset_event_type_id=1
    );

CREATE UNIQUE INDEX list_events_tx_hash_index ON list_events (tx_hash);
CREATE INDEX IF NOT EXISTS list_events_sender_address_index on list_events using hash(sender_address);
CREATE INDEX IF NOT EXISTS list_events_block_height_index on list_events (block_height desc);
CREATE INDEX IF NOT EXISTS list_events_collection_index on list_events (collection_contract_id, token_id);


-----

-- CreateTable
CREATE MATERIALIZED VIEW IF NOT EXISTS unlist_events as (
 with transactions as (
        select block_height,
                burn_block_time,
                tx_id,
                index_block_hash,
                microblock_sequence,
                microblock_hash,
                tx_index,
                sender_address,
                contract_call_contract_id,
                contract_call_function_name,
                contract_call_function_args
        from txs
        where canonical
        and microblock_canonical
        and status=1
        and contract_call_function_name in ('unlist-asset',
                                            'unlist-item',
                                            'unlist-in-ustx',
                                            'unlist-punk')
        and contract_call_contract_id not in ('SP2G24RB90P4NWP7RK4EY4SEXNQ2RA6STQR0FY9A.artic-monkeys-nft',
                                            'SP3ZJP253DENMN3CQFEQSPZWY7DK35EH3SEH0J8PK.distant-red-antlion',
                                            'SP5YF41VPG2FZ8NYK4GYGJXNFVSRPKWH26402X1T.stacks-art-market-v2' -- TODO: is this a valid stacks art contract?
                                                                                    )
 )
    select t.block_height,
        t.burn_block_time,
        '0x' || encode(t.tx_id,'hex') as tx_hash, 
        t.microblock_sequence,
        t.tx_index,
        sender_address,
        t.contract_call_contract_id,
        t.contract_call_function_name,
        t.contract_call_function_args, 

        case when n.asset_identifier is not null then split_part(n.asset_identifier,'::',1) else contract_call_contract_id end as collection_contract_id,
        
        case when n.value is not null 
                then ('x' || right(value::bytea::text, 16))::bit(64)::bigint 
                                    else  ('x' || right(contract_call_function_args::bytea::text, 16))::bit(64)::bigint end as token_id
    from transactions t 
        left join nft_events n on t.tx_id=n.tx_id 
            and t.index_block_hash=n.index_block_hash 
            and t.microblock_hash=n.microblock_hash
            and n.canonical 
            and n.microblock_canonical
            and n.asset_event_type_id=1
    );

CREATE UNIQUE INDEX unlist_events_tx_hash_index ON unlist_events (tx_hash);
CREATE INDEX IF NOT EXISTS unlist_events_sender_address_index on unlist_events using hash(sender_address);
CREATE INDEX IF NOT EXISTS unlist_events_block_height_index on unlist_events (block_height desc);
CREATE INDEX IF NOT EXISTS unlist_events_collection_index on unlist_events (collection_contract_id, token_id);


----

-- CreateTable
-- TODO identify & handle transactions that cause issues
-- https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/0x43bcde4f9ed2b38e6c55159b37e8aa64241456f4def8025004c1232063b2f6d5
 create materialized view if not exists change_price_events as (
 with transactions as (
        select block_height,
                burn_block_time,
                tx_id,
                index_block_hash,
                microblock_sequence,
                microblock_hash,
                tx_index,
                sender_address,
                contract_call_contract_id,
                contract_call_function_name,
                contract_call_function_args
        from txs
        where canonical
        and microblock_canonical
        and status=1
        and contract_call_function_name like 'change-price%'
 )
SELECT t.block_height,
        t.burn_block_time,
        '0x' || encode(t.tx_id,'hex') as tx_hash, 
        t.microblock_sequence,
        t.tx_index,
        t.sender_address,
        t.contract_call_contract_id,
        t.contract_call_function_name,
        t.contract_call_function_args,
        case when n.asset_identifier is not null then split_part(n.asset_identifier,'::',1)
            when contract_call_contract_id in ('SP1BX0P4MZ5A3A5JCH0E10YNS170QFR2VQ6TT4NRH.byzantion-market-v6',
                                                'SP1BX0P4MZ5A3A5JCH0E10YNS170QFR2VQ6TT4NRH.byzantion-market-v7',
                                                'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.byzantion-market-v5')
                then split_part(encode(decode(substring(contract_call_function_args::text, 
                                            position('0d0000' in contract_call_function_args::text)+10,
                                            position('010000' in contract_call_function_args::text) 
                                                    - 10 - position('0d0000' in contract_call_function_args::text))
                                    ,'hex')
                            ,'escape'),'::',1) end                                                                       as collection_contract_id,
        case when n.value is not null then ('x' || right(value::bytea::text, 16))::bit(64)::bigint 
                    when contract_call_contract_id in ('SP1BX0P4MZ5A3A5JCH0E10YNS170QFR2VQ6TT4NRH.byzantion-market-v6',
                                                        'SP1BX0P4MZ5A3A5JCH0E10YNS170QFR2VQ6TT4NRH.byzantion-market-v7',
                                                        'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.byzantion-market-v5')
                        then ('x' || right(split_part(contract_call_function_args::text,'01000000',2), 16))::bit(64)::bigint 
                    when contract_call_contract_id = 'SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.stacks-art-market-v2' 
                        then ('x' || right(split_part(contract_call_function_args::text,'01000000',3), 16))::bit(64)::bigint   
        end                                                                                                 as token_id,

        case when contract_call_contract_id='SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S.change-price-v1'
                then case contract_call_function_name 
                            when 'change-price-a' 
                                then ('x' || right(split_part(contract_call_function_args::text,'01000000',3), 16))::bit(64)::bigint 
                            when 'change-price-b' 
                                then ('x' || right(split_part(contract_call_function_args::text,'01000000',4), 16))::bit(64)::bigint 
                            when 'change-price-c' 
                                then ('x' || right(split_part(contract_call_function_args::text,'01000000',3), 16))::bit(64)::bigint 			
                    end
            when contract_call_contract_id in ('SP1BX0P4MZ5A3A5JCH0E10YNS170QFR2VQ6TT4NRH.byzantion-market-v6',
                                                'SP1BX0P4MZ5A3A5JCH0E10YNS170QFR2VQ6TT4NRH.byzantion-market-v7',
                                                'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.byzantion-market-v5')
                then ('x' || right(split_part(contract_call_function_args::text,'01000000',3), 16))::bit(64)::bigint
            when contract_call_contract_id = 'SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.stacks-art-market-v2' 
                then ('x' || right(split_part(contract_call_function_args::text,'01000000',4), 16))::bit(64)::bigint 
        end 					                                                                                as price
 from transactions t 
 left join nft_events n on t.tx_id=n.tx_id 
            and t.index_block_hash=n.index_block_hash 
            and t.microblock_hash=n.microblock_hash
            and n.canonical 
            and n.microblock_canonical
            and n.asset_event_type_id=1
group by 1,2,3,4,5,6,7,8,9,10,11,12
);


CREATE UNIQUE INDEX change_price_tx_hash_index ON change_price_events (tx_hash);
CREATE INDEX IF NOT EXISTS change_price_sender_address_index on change_price_events using hash(sender_address);
CREATE INDEX IF NOT EXISTS change_price_block_height_index on change_price_events (block_height desc);
CREATE INDEX IF NOT EXISTS change_price_collection_index on change_price_events (collection_contract_id, token_id);



COMMIT;