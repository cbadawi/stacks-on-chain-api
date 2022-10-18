-- CreateTable
CREATE TABLE "blocks" (
    "index_block_hash" BYTEA NOT NULL,
    "block_hash" BYTEA NOT NULL,
    "block_height" INTEGER NOT NULL,
    "burn_block_time" INTEGER NOT NULL,
    "burn_block_hash" BYTEA NOT NULL,
    "burn_block_height" INTEGER NOT NULL,
    "miner_txid" BYTEA NOT NULL,
    "parent_index_block_hash" BYTEA NOT NULL,
    "parent_block_hash" BYTEA NOT NULL,
    "parent_microblock_hash" BYTEA NOT NULL,
    "parent_microblock_sequence" INTEGER NOT NULL,
    "canonical" BOOLEAN NOT NULL,
    "execution_cost_read_count" BIGINT NOT NULL,
    "execution_cost_read_length" BIGINT NOT NULL,
    "execution_cost_runtime" BIGINT NOT NULL,
    "execution_cost_write_count" BIGINT NOT NULL,
    "execution_cost_write_length" BIGINT NOT NULL,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("index_block_hash")
);

-- CreateTable
CREATE TABLE "burnchain_rewards" (
    "id" SERIAL NOT NULL,
    "canonical" BOOLEAN NOT NULL,
    "burn_block_hash" BYTEA NOT NULL,
    "burn_block_height" INTEGER NOT NULL,
    "burn_amount" DECIMAL NOT NULL,
    "reward_recipient" TEXT NOT NULL,
    "reward_amount" DECIMAL NOT NULL,
    "reward_index" INTEGER NOT NULL,

    CONSTRAINT "burnchain_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config_state" (
    "id" BOOLEAN NOT NULL DEFAULT true,
    "bns_names_onchain_imported" BOOLEAN NOT NULL DEFAULT false,
    "bns_subdomains_imported" BOOLEAN NOT NULL DEFAULT false,
    "token_offering_imported" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "config_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_logs" (
    "id" SERIAL NOT NULL,
    "event_index" INTEGER NOT NULL,
    "tx_id" BYTEA NOT NULL,
    "tx_index" SMALLINT NOT NULL,
    "block_height" INTEGER NOT NULL,
    "index_block_hash" BYTEA NOT NULL,
    "parent_index_block_hash" BYTEA NOT NULL,
    "microblock_hash" BYTEA NOT NULL,
    "microblock_sequence" INTEGER NOT NULL,
    "microblock_canonical" BOOLEAN NOT NULL,
    "canonical" BOOLEAN NOT NULL,
    "contract_identifier" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "value" BYTEA NOT NULL,

    CONSTRAINT "contract_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_observer_requests" (
    "id" BIGSERIAL NOT NULL,
    "receive_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "event_path" TEXT NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "event_observer_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faucet_requests" (
    "id" SERIAL NOT NULL,
    "currency" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "occurred_at" BIGINT NOT NULL,

    CONSTRAINT "faucet_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ft_events" (
    "id" SERIAL NOT NULL,
    "event_index" INTEGER NOT NULL,
    "tx_id" BYTEA NOT NULL,
    "tx_index" SMALLINT NOT NULL,
    "block_height" INTEGER NOT NULL,
    "index_block_hash" BYTEA NOT NULL,
    "parent_index_block_hash" BYTEA NOT NULL,
    "microblock_hash" BYTEA NOT NULL,
    "microblock_sequence" INTEGER NOT NULL,
    "microblock_canonical" BOOLEAN NOT NULL,
    "canonical" BOOLEAN NOT NULL,
    "asset_event_type_id" SMALLINT NOT NULL,
    "asset_identifier" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "sender" TEXT,
    "recipient" TEXT,

    CONSTRAINT "ft_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ft_metadata" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "token_uri" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_uri" TEXT NOT NULL,
    "image_canonical_uri" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "tx_id" BYTEA NOT NULL,
    "sender_address" TEXT NOT NULL,

    CONSTRAINT "ft_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mempool_txs" (
    "id" SERIAL NOT NULL,
    "pruned" BOOLEAN NOT NULL,
    "tx_id" BYTEA NOT NULL,
    "type_id" SMALLINT NOT NULL,
    "anchor_mode" SMALLINT NOT NULL,
    "status" SMALLINT NOT NULL,
    "post_conditions" BYTEA NOT NULL,
    "nonce" INTEGER NOT NULL,
    "fee_rate" BIGINT NOT NULL,
    "sponsored" BOOLEAN NOT NULL,
    "sponsor_address" TEXT,
    "sponsor_nonce" INTEGER,
    "sender_address" TEXT NOT NULL,
    "origin_hash_mode" SMALLINT NOT NULL,
    "raw_tx" BYTEA NOT NULL,
    "receipt_time" INTEGER NOT NULL,
    "receipt_block_height" INTEGER NOT NULL,
    "token_transfer_recipient_address" TEXT,
    "token_transfer_amount" BIGINT,
    "token_transfer_memo" BYTEA,
    "smart_contract_contract_id" TEXT,
    "smart_contract_source_code" TEXT,
    "contract_call_contract_id" TEXT,
    "contract_call_function_name" TEXT,
    "contract_call_function_args" BYTEA,
    "poison_microblock_header_1" BYTEA,
    "poison_microblock_header_2" BYTEA,
    "coinbase_payload" BYTEA,

    CONSTRAINT "mempool_txs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "microblocks" (
    "id" BIGSERIAL NOT NULL,
    "receive_timestamp" TIMESTAMP(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "canonical" BOOLEAN NOT NULL,
    "microblock_canonical" BOOLEAN NOT NULL,
    "microblock_hash" BYTEA NOT NULL,
    "microblock_sequence" INTEGER NOT NULL,
    "microblock_parent_hash" BYTEA NOT NULL,
    "index_block_hash" BYTEA NOT NULL,
    "parent_index_block_hash" BYTEA NOT NULL,
    "block_height" INTEGER NOT NULL,
    "parent_block_height" INTEGER NOT NULL,
    "parent_block_hash" BYTEA NOT NULL,
    "parent_burn_block_height" INTEGER NOT NULL,
    "parent_burn_block_time" INTEGER NOT NULL,
    "parent_burn_block_hash" BYTEA NOT NULL,
    "block_hash" BYTEA NOT NULL,

    CONSTRAINT "microblocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "miner_rewards" (
    "id" SERIAL NOT NULL,
    "block_hash" BYTEA NOT NULL,
    "index_block_hash" BYTEA NOT NULL,
    "from_index_block_hash" BYTEA NOT NULL,
    "mature_block_height" INTEGER NOT NULL,
    "canonical" BOOLEAN NOT NULL,
    "recipient" TEXT NOT NULL,
    "coinbase_amount" DECIMAL NOT NULL,
    "tx_fees_anchored" DECIMAL NOT NULL,
    "tx_fees_streamed_confirmed" DECIMAL NOT NULL,
    "tx_fees_streamed_produced" DECIMAL NOT NULL,

    CONSTRAINT "miner_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "names" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "registered_at" INTEGER NOT NULL,
    "expire_block" INTEGER NOT NULL,
    "zonefile_hash" TEXT NOT NULL,
    "namespace_id" TEXT NOT NULL,
    "grace_period" TEXT,
    "renewal_deadline" INTEGER,
    "resolver" TEXT,
    "tx_id" BYTEA,
    "tx_index" SMALLINT NOT NULL,
    "status" TEXT,
    "canonical" BOOLEAN NOT NULL DEFAULT true,
    "index_block_hash" BYTEA,
    "parent_index_block_hash" BYTEA NOT NULL,
    "microblock_hash" BYTEA NOT NULL,
    "microblock_sequence" INTEGER NOT NULL,
    "microblock_canonical" BOOLEAN NOT NULL,

    CONSTRAINT "names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "namespaces" (
    "id" SERIAL NOT NULL,
    "namespace_id" TEXT NOT NULL,
    "launched_at" INTEGER,
    "address" TEXT NOT NULL,
    "reveal_block" INTEGER NOT NULL,
    "ready_block" INTEGER NOT NULL,
    "buckets" TEXT NOT NULL,
    "base" INTEGER NOT NULL,
    "coeff" INTEGER NOT NULL,
    "nonalpha_discount" INTEGER NOT NULL,
    "no_vowel_discount" INTEGER NOT NULL,
    "lifetime" INTEGER NOT NULL,
    "status" TEXT,
    "tx_id" BYTEA,
    "tx_index" SMALLINT NOT NULL,
    "canonical" BOOLEAN NOT NULL DEFAULT true,
    "index_block_hash" BYTEA,
    "parent_index_block_hash" BYTEA NOT NULL,
    "microblock_hash" BYTEA NOT NULL,
    "microblock_sequence" INTEGER NOT NULL,
    "microblock_canonical" BOOLEAN NOT NULL,

    CONSTRAINT "namespaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nft_events" (
    "id" SERIAL NOT NULL,
    "event_index" INTEGER NOT NULL,
    "tx_id" BYTEA NOT NULL,
    "tx_index" SMALLINT NOT NULL,
    "block_height" INTEGER NOT NULL,
    "index_block_hash" BYTEA NOT NULL,
    "parent_index_block_hash" BYTEA NOT NULL,
    "microblock_hash" BYTEA NOT NULL,
    "microblock_sequence" INTEGER NOT NULL,
    "microblock_canonical" BOOLEAN NOT NULL,
    "canonical" BOOLEAN NOT NULL,
    "asset_event_type_id" SMALLINT NOT NULL,
    "asset_identifier" TEXT NOT NULL,
    "value" BYTEA NOT NULL,
    "sender" TEXT,
    "recipient" TEXT,

    CONSTRAINT "nft_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nft_metadata" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "token_uri" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_uri" TEXT NOT NULL,
    "image_canonical_uri" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "tx_id" BYTEA NOT NULL,
    "sender_address" TEXT NOT NULL,

    CONSTRAINT "nft_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pgmigrations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "run_on" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "pgmigrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "principal_stx_txs" (
    "id" SERIAL NOT NULL,
    "principal" TEXT NOT NULL,
    "tx_id" BYTEA NOT NULL,
    "block_height" INTEGER NOT NULL,
    "index_block_hash" BYTEA NOT NULL,
    "microblock_hash" BYTEA NOT NULL,
    "microblock_sequence" INTEGER NOT NULL,
    "tx_index" SMALLINT NOT NULL,
    "canonical" BOOLEAN NOT NULL,
    "microblock_canonical" BOOLEAN NOT NULL,

    CONSTRAINT "principal_stx_txs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward_slot_holders" (
    "id" SERIAL NOT NULL,
    "canonical" BOOLEAN NOT NULL,
    "burn_block_hash" BYTEA NOT NULL,
    "burn_block_height" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "slot_index" INTEGER NOT NULL,

    CONSTRAINT "reward_slot_holders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smart_contracts" (
    "id" SERIAL NOT NULL,
    "tx_id" BYTEA NOT NULL,
    "canonical" BOOLEAN NOT NULL,
    "contract_id" TEXT NOT NULL,
    "block_height" INTEGER NOT NULL,
    "index_block_hash" BYTEA NOT NULL,
    "parent_index_block_hash" BYTEA NOT NULL,
    "microblock_hash" BYTEA NOT NULL,
    "microblock_sequence" INTEGER NOT NULL,
    "microblock_canonical" BOOLEAN NOT NULL,
    "source_code" TEXT NOT NULL,
    "abi" JSONB NOT NULL,

    CONSTRAINT "smart_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stx_events" (
    "id" SERIAL NOT NULL,
    "event_index" INTEGER NOT NULL,
    "tx_id" BYTEA NOT NULL,
    "tx_index" SMALLINT NOT NULL,
    "block_height" INTEGER NOT NULL,
    "index_block_hash" BYTEA NOT NULL,
    "parent_index_block_hash" BYTEA NOT NULL,
    "microblock_hash" BYTEA NOT NULL,
    "microblock_sequence" INTEGER NOT NULL,
    "microblock_canonical" BOOLEAN NOT NULL,
    "canonical" BOOLEAN NOT NULL,
    "asset_event_type_id" SMALLINT NOT NULL,
    "amount" BIGINT NOT NULL,
    "sender" TEXT,
    "recipient" TEXT,

    CONSTRAINT "stx_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stx_lock_events" (
    "id" SERIAL NOT NULL,
    "event_index" INTEGER NOT NULL,
    "tx_id" BYTEA NOT NULL,
    "tx_index" SMALLINT NOT NULL,
    "block_height" INTEGER NOT NULL,
    "index_block_hash" BYTEA NOT NULL,
    "parent_index_block_hash" BYTEA NOT NULL,
    "microblock_hash" BYTEA NOT NULL,
    "microblock_sequence" INTEGER NOT NULL,
    "microblock_canonical" BOOLEAN NOT NULL,
    "canonical" BOOLEAN NOT NULL,
    "locked_amount" DECIMAL NOT NULL,
    "unlock_height" INTEGER NOT NULL,
    "locked_address" TEXT NOT NULL,

    CONSTRAINT "stx_lock_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subdomains" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "namespace_id" TEXT NOT NULL,
    "fully_qualified_subdomain" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "zonefile_hash" TEXT NOT NULL,
    "parent_zonefile_hash" TEXT NOT NULL,
    "parent_zonefile_index" INTEGER NOT NULL,
    "tx_index" SMALLINT NOT NULL,
    "block_height" INTEGER NOT NULL,
    "zonefile_offset" INTEGER,
    "resolver" TEXT,
    "tx_id" BYTEA,
    "canonical" BOOLEAN NOT NULL DEFAULT true,
    "index_block_hash" BYTEA,
    "parent_index_block_hash" BYTEA NOT NULL,
    "microblock_hash" BYTEA NOT NULL,
    "microblock_sequence" INTEGER NOT NULL,
    "microblock_canonical" BOOLEAN NOT NULL,

    CONSTRAINT "subdomains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_metadata_queue" (
    "queue_id" SERIAL NOT NULL,
    "tx_id" BYTEA NOT NULL,
    "contract_id" TEXT NOT NULL,
    "contract_abi" TEXT NOT NULL,
    "block_height" INTEGER NOT NULL,
    "processed" BOOLEAN NOT NULL,
    "retry_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "token_metadata_queue_pkey" PRIMARY KEY ("queue_id")
);

-- CreateTable
CREATE TABLE "token_offering_locked" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "value" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,

    CONSTRAINT "token_offering_locked_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "txs" (
    "id" SERIAL NOT NULL,
    "tx_id" BYTEA NOT NULL,
    "tx_index" SMALLINT NOT NULL,
    "raw_result" BYTEA NOT NULL,
    "index_block_hash" BYTEA NOT NULL,
    "block_hash" BYTEA NOT NULL,
    "block_height" INTEGER NOT NULL,
    "parent_block_hash" BYTEA NOT NULL,
    "burn_block_time" INTEGER NOT NULL,
    "parent_burn_block_time" INTEGER NOT NULL,
    "type_id" SMALLINT NOT NULL,
    "anchor_mode" SMALLINT NOT NULL,
    "status" SMALLINT NOT NULL,
    "canonical" BOOLEAN NOT NULL,
    "post_conditions" BYTEA NOT NULL,
    "nonce" INTEGER NOT NULL,
    "fee_rate" BIGINT NOT NULL,
    "sponsored" BOOLEAN NOT NULL,
    "sponsor_address" TEXT,
    "sponsor_nonce" INTEGER,
    "sender_address" TEXT NOT NULL,
    "origin_hash_mode" SMALLINT NOT NULL,
    "event_count" INTEGER NOT NULL,
    "execution_cost_read_count" BIGINT NOT NULL,
    "execution_cost_read_length" BIGINT NOT NULL,
    "execution_cost_runtime" BIGINT NOT NULL,
    "execution_cost_write_count" BIGINT NOT NULL,
    "execution_cost_write_length" BIGINT NOT NULL,
    "raw_tx" BYTEA NOT NULL,
    "microblock_canonical" BOOLEAN NOT NULL,
    "microblock_sequence" INTEGER NOT NULL,
    "microblock_hash" BYTEA NOT NULL,
    "parent_index_block_hash" BYTEA NOT NULL,
    "token_transfer_recipient_address" TEXT,
    "token_transfer_amount" BIGINT,
    "token_transfer_memo" BYTEA,
    "smart_contract_contract_id" TEXT,
    "smart_contract_source_code" TEXT,
    "contract_call_contract_id" TEXT,
    "contract_call_function_name" TEXT,
    "contract_call_function_args" BYTEA,
    "poison_microblock_header_1" BYTEA,
    "poison_microblock_header_2" BYTEA,
    "coinbase_payload" BYTEA,

    CONSTRAINT "txs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zonefiles" (
    "id" SERIAL NOT NULL,
    "zonefile" TEXT NOT NULL,
    "zonefile_hash" TEXT NOT NULL,

    CONSTRAINT "zonefiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nft_custody" (
    "asset_identifier" TEXT NOT NULL,
    "value" BYTEA NOT NULL,
    "recipient" TEXT,
    "tx_id" BYTEA NOT NULL,
    "block_height" INTEGER NOT NULL,

    CONSTRAINT "nft_custody_pkey" PRIMARY KEY ("asset_identifier","value")
);

-- CreateIndex
CREATE INDEX "blocks_block_hash_index" ON "blocks" USING HASH ("block_hash");

-- CreateIndex
CREATE INDEX "blocks_block_height_index" ON "blocks"("block_height" DESC);

-- CreateIndex
CREATE INDEX "blocks_burn_block_hash_index" ON "blocks" USING HASH ("burn_block_hash");

-- CreateIndex
CREATE INDEX "blocks_burn_block_height_index" ON "blocks"("burn_block_height" DESC);

-- CreateIndex
CREATE INDEX "blocks_index_block_hash_index" ON "blocks" USING HASH ("index_block_hash");

-- CreateIndex
CREATE INDEX "burnchain_rewards_burn_block_hash_index" ON "burnchain_rewards" USING HASH ("burn_block_hash");

-- CreateIndex
CREATE INDEX "burnchain_rewards_burn_block_height_index" ON "burnchain_rewards"("burn_block_height" DESC);

-- CreateIndex
CREATE INDEX "burnchain_rewards_reward_recipient_index" ON "burnchain_rewards" USING HASH ("reward_recipient");

-- CreateIndex
CREATE INDEX "contract_logs_event_index_index" ON "contract_logs"("event_index");

-- CreateIndex
CREATE INDEX "contract_logs_index_block_hash_index" ON "contract_logs" USING HASH ("index_block_hash");

-- CreateIndex
CREATE INDEX "contract_logs_microblock_hash_index" ON "contract_logs" USING HASH ("microblock_hash");

-- CreateIndex
CREATE INDEX "contract_logs_tx_id_index" ON "contract_logs" USING HASH ("tx_id");

-- CreateIndex
CREATE INDEX "faucet_requests_address_index" ON "faucet_requests" USING HASH ("address");

-- CreateIndex
CREATE INDEX "ft_events_block_height_index" ON "ft_events"("block_height" DESC);

-- CreateIndex
CREATE INDEX "ft_events_event_index_index" ON "ft_events"("event_index");

-- CreateIndex
CREATE INDEX "ft_events_index_block_hash_index" ON "ft_events" USING HASH ("index_block_hash");

-- CreateIndex
CREATE INDEX "ft_events_microblock_hash_index" ON "ft_events" USING HASH ("microblock_hash");

-- CreateIndex
CREATE INDEX "ft_events_recipient_index" ON "ft_events" USING HASH ("recipient");

-- CreateIndex
CREATE INDEX "ft_events_sender_index" ON "ft_events" USING HASH ("sender");

-- CreateIndex
CREATE INDEX "ft_events_tx_id_index" ON "ft_events" USING HASH ("tx_id");

-- CreateIndex
CREATE INDEX "ft_metadata_contract_id_index" ON "ft_metadata" USING HASH ("contract_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tx_id" ON "mempool_txs"("tx_id");

-- CreateIndex
CREATE INDEX "mempool_txs_contract_call_contract_id_index" ON "mempool_txs" USING HASH ("contract_call_contract_id");

-- CreateIndex
CREATE INDEX "mempool_txs_nonce_index" ON "mempool_txs"("nonce");

-- CreateIndex
CREATE INDEX "mempool_txs_receipt_time_index" ON "mempool_txs"("receipt_time" DESC);

-- CreateIndex
CREATE INDEX "mempool_txs_sender_address_index" ON "mempool_txs" USING HASH ("sender_address");

-- CreateIndex
CREATE INDEX "mempool_txs_smart_contract_contract_id_index" ON "mempool_txs" USING HASH ("smart_contract_contract_id");

-- CreateIndex
CREATE INDEX "mempool_txs_sponsor_address_index" ON "mempool_txs" USING HASH ("sponsor_address");

-- CreateIndex
CREATE INDEX "mempool_txs_token_transfer_recipient_address_index" ON "mempool_txs" USING HASH ("token_transfer_recipient_address");

-- CreateIndex
CREATE INDEX "mempool_txs_tx_id_index" ON "mempool_txs" USING HASH ("tx_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_microblock_hash" ON "microblocks"("microblock_hash");

-- CreateIndex
CREATE INDEX "microblocks_block_height_microblock_sequence_index" ON "microblocks"("block_height" DESC, "microblock_sequence" DESC);

-- CreateIndex
CREATE INDEX "microblocks_microblock_hash_index" ON "microblocks" USING HASH ("microblock_hash");

-- CreateIndex
CREATE INDEX "microblocks_parent_index_block_hash_index" ON "microblocks" USING HASH ("parent_index_block_hash");

-- CreateIndex
CREATE INDEX "miner_rewards_index_block_hash_index" ON "miner_rewards" USING HASH ("index_block_hash");

-- CreateIndex
CREATE INDEX "miner_rewards_mature_block_height_index" ON "miner_rewards"("mature_block_height" DESC);

-- CreateIndex
CREATE INDEX "miner_rewards_recipient_index" ON "miner_rewards" USING HASH ("recipient");

-- CreateIndex
CREATE INDEX "names_index_block_hash_index" ON "names" USING HASH ("index_block_hash");

-- CreateIndex
CREATE INDEX "names_microblock_hash_index" ON "names" USING HASH ("microblock_hash");

-- CreateIndex
CREATE INDEX "names_name_index" ON "names" USING HASH ("name");

-- CreateIndex
CREATE INDEX "names_registered_at_index" ON "names"("registered_at" DESC);

-- CreateIndex
CREATE INDEX "names_tx_id_index" ON "names" USING HASH ("tx_id");

-- CreateIndex
CREATE INDEX "namespaces_index_block_hash_index" ON "namespaces" USING HASH ("index_block_hash");

-- CreateIndex
CREATE INDEX "namespaces_microblock_hash_index" ON "namespaces" USING HASH ("microblock_hash");

-- CreateIndex
CREATE INDEX "namespaces_ready_block_index" ON "namespaces"("ready_block" DESC);

-- CreateIndex
CREATE INDEX "nft_events_asset_identifier_value_index" ON "nft_events"("asset_identifier", "value");

-- CreateIndex
CREATE INDEX "nft_events_block_height_index" ON "nft_events"("block_height" DESC);

-- CreateIndex
CREATE INDEX "nft_events_event_index_index" ON "nft_events"("event_index");

-- CreateIndex
CREATE INDEX "nft_events_index_block_hash_index" ON "nft_events" USING HASH ("index_block_hash");

-- CreateIndex
CREATE INDEX "nft_events_microblock_hash_index" ON "nft_events" USING HASH ("microblock_hash");

-- CreateIndex
CREATE INDEX "nft_events_recipient_index" ON "nft_events" USING HASH ("recipient");

-- CreateIndex
CREATE INDEX "nft_events_sender_index" ON "nft_events" USING HASH ("sender");

-- CreateIndex
CREATE INDEX "nft_events_tx_id_index" ON "nft_events" USING HASH ("tx_id");

-- CreateIndex
CREATE INDEX "nft_metadata_contract_id_index" ON "nft_metadata" USING HASH ("contract_id");

-- CreateIndex
CREATE INDEX "principal_stx_txs_block_height_microblock_sequence_tx_index_ind" ON "principal_stx_txs"("block_height" DESC, "microblock_sequence" DESC, "tx_index" DESC);

-- CreateIndex
CREATE INDEX "principal_stx_txs_principal_index" ON "principal_stx_txs" USING HASH ("principal");

-- CreateIndex
CREATE INDEX "principal_stx_txs_tx_id_index" ON "principal_stx_txs" USING HASH ("tx_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_principal_tx_id_index_block_hash_microblock_hash" ON "principal_stx_txs"("principal", "tx_id", "index_block_hash", "microblock_hash");

-- CreateIndex
CREATE INDEX "reward_slot_holders_burn_block_hash_index" ON "reward_slot_holders" USING HASH ("burn_block_hash");

-- CreateIndex
CREATE INDEX "reward_slot_holders_burn_block_height_index" ON "reward_slot_holders"("burn_block_height" DESC);

-- CreateIndex
CREATE INDEX "smart_contracts_contract_id_index" ON "smart_contracts" USING HASH ("contract_id");

-- CreateIndex
CREATE INDEX "smart_contracts_index_block_hash_index" ON "smart_contracts" USING HASH ("index_block_hash");

-- CreateIndex
CREATE INDEX "smart_contracts_microblock_hash_index" ON "smart_contracts" USING HASH ("microblock_hash");

-- CreateIndex
CREATE INDEX "stx_events_block_height_index" ON "stx_events"("block_height" DESC);

-- CreateIndex
CREATE INDEX "stx_events_event_index_index" ON "stx_events"("event_index");

-- CreateIndex
CREATE INDEX "stx_events_index_block_hash_index" ON "stx_events" USING HASH ("index_block_hash");

-- CreateIndex
CREATE INDEX "stx_events_microblock_hash_index" ON "stx_events" USING HASH ("microblock_hash");

-- CreateIndex
CREATE INDEX "stx_events_recipient_index" ON "stx_events" USING HASH ("recipient");

-- CreateIndex
CREATE INDEX "stx_events_sender_index" ON "stx_events" USING HASH ("sender");

-- CreateIndex
CREATE INDEX "stx_events_tx_id_index" ON "stx_events" USING HASH ("tx_id");

-- CreateIndex
CREATE INDEX "stx_lock_events_block_height_index" ON "stx_lock_events"("block_height" DESC);

-- CreateIndex
CREATE INDEX "stx_lock_events_index_block_hash_index" ON "stx_lock_events" USING HASH ("index_block_hash");

-- CreateIndex
CREATE INDEX "stx_lock_events_locked_address_index" ON "stx_lock_events" USING HASH ("locked_address");

-- CreateIndex
CREATE INDEX "stx_lock_events_microblock_hash_index" ON "stx_lock_events" USING HASH ("microblock_hash");

-- CreateIndex
CREATE INDEX "stx_lock_events_tx_id_index" ON "stx_lock_events" USING HASH ("tx_id");

-- CreateIndex
CREATE INDEX "stx_lock_events_unlock_height_index" ON "stx_lock_events"("unlock_height" DESC);

-- CreateIndex
CREATE INDEX "subdomains_block_height_index" ON "subdomains"("block_height" DESC);

-- CreateIndex
CREATE INDEX "subdomains_fully_qualified_subdomain_index" ON "subdomains" USING HASH ("fully_qualified_subdomain");

-- CreateIndex
CREATE INDEX "subdomains_index_block_hash_index" ON "subdomains" USING HASH ("index_block_hash");

-- CreateIndex
CREATE INDEX "subdomains_microblock_hash_index" ON "subdomains" USING HASH ("microblock_hash");

-- CreateIndex
CREATE INDEX "subdomains_owner_index" ON "subdomains" USING HASH ("owner");

-- CreateIndex
CREATE INDEX "subdomains_zonefile_hash_index" ON "subdomains" USING HASH ("zonefile_hash");

-- CreateIndex
CREATE INDEX "token_metadata_queue_block_height_index" ON "token_metadata_queue"("block_height" DESC);

-- CreateIndex
CREATE INDEX "token_offering_locked_address_index" ON "token_offering_locked" USING HASH ("address");

-- CreateIndex
CREATE INDEX "txs_block_height_microblock_sequence_tx_index_index" ON "txs"("block_height" DESC, "microblock_sequence" DESC, "tx_index" DESC);

-- CreateIndex
CREATE INDEX "txs_contract_call_contract_id_index" ON "txs" USING HASH ("contract_call_contract_id");

-- CreateIndex
CREATE INDEX "txs_index_block_hash_index" ON "txs" USING HASH ("index_block_hash");

-- CreateIndex
CREATE INDEX "txs_microblock_hash_index" ON "txs" USING HASH ("microblock_hash");

-- CreateIndex
CREATE INDEX "txs_sender_address_index" ON "txs" USING HASH ("sender_address");

-- CreateIndex
CREATE INDEX "txs_smart_contract_contract_id_index" ON "txs" USING HASH ("smart_contract_contract_id");

-- CreateIndex
CREATE INDEX "txs_sponsor_address_index" ON "txs" USING HASH ("sponsor_address");

-- CreateIndex
CREATE INDEX "txs_token_transfer_recipient_address_index" ON "txs" USING HASH ("token_transfer_recipient_address");

-- CreateIndex
CREATE INDEX "txs_tx_id_index" ON "txs" USING HASH ("tx_id");

-- CreateIndex
CREATE INDEX "txs_tx_index_index" ON "txs"("tx_index" DESC);

-- CreateIndex
CREATE INDEX "txs_type_id_index" ON "txs"("type_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tx_id_index_block_hash_microblock_hash" ON "txs"("tx_id", "index_block_hash", "microblock_hash");

-- CreateIndex
CREATE INDEX "zonefiles_zonefile_hash_index" ON "zonefiles" USING HASH ("zonefile_hash");

-- AddForeignKey
ALTER TABLE "nft_events" ADD CONSTRAINT "nft_events_asset_identifier_value_fkey" FOREIGN KEY ("asset_identifier", "value") REFERENCES "nft_custody"("asset_identifier", "value") ON DELETE RESTRICT ON UPDATE CASCADE;
