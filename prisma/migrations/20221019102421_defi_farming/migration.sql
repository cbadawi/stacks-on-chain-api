BEGIN;

create materialized view defi_farming_history as (
    with contract_calls as (
        select sender_address,
				tx_id, 
                burn_block_time,
                block_height,
                contract_call_contract_id,
                contract_call_function_name,
				contract_call_function_args::text,
				case contract_call_function_name when 'stake-tokens' then 
				('x' || right(contract_call_function_args::text,16))::bit(64)::bigint end as cycles_staked,
				case contract_call_function_name when 'stake-tokens' then 
				('x' || right(split_part(contract_call_function_args::text,'01000000',2), 16))::bit(64)::bigint end as amount
        from txs t
        where status = 1
        and canonical
        and microblock_canonical
        and ((contract_call_contract_id in ('SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-reserve-pool')
                and contract_call_function_name in ('stake-tokens')) 
            or
            (contract_call_contract_id in ('SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.staking-helper')
            and contract_call_function_name in ('claim-staking-reward'))
            )
    )
    select sender_address,
               '0x' || encode(c.tx_id,'hex') as tx_hash, 
                c.block_height,
				TO_TIMESTAMP(burn_block_time)::date,
                c.contract_call_contract_id,
                c.contract_call_function_name,
                asset_identifier,
                (coalesce(f.amount, c.amount)::numeric)/10^8 as amount
    from contract_calls c 
    left join ft_events f on c.tx_id=f.tx_id and c.contract_call_function_name='claim-staking-reward' 
    where (c.contract_call_function_name='stake-tokens' or (c.contract_call_function_name='claim-staking-reward' and f.amount is not null))
);

CREATE UNIQUE INDEX defi_farming_history_tx_hash_index ON defi_farming_history (tx_hash);
CREATE INDEX IF NOT EXISTS defi_farming_history_sender_address_index on defi_farming_history using hash(sender_address);


COMMIT;