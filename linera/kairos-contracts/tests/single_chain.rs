// Copyright (c) Zefchain Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

//! Integration testing for the kairos_contracts application.

#![cfg(not(target_arch = "wasm32"))]

use kairos_contracts::{Operation, MarketOutcome};
use linera_sdk::test::{QueryOutcome, TestValidator};

/// Tests creating a prediction market and placing trades
#[tokio::test(flavor = "multi_thread")]
async fn prediction_market_test() {
    let (validator, module_id) =
        TestValidator::with_current_module::<kairos_contracts::KairosContractsAbi, (), ()>().await;
    let mut chain = validator.new_chain().await;

    let application_id = chain
        .create_application(module_id, (), (), vec![])
        .await;

    // Create a market
    let end_timestamp = 1735689600u64; // Example: Jan 1, 2025
    chain
        .add_block(|block| {
            block.with_operation(application_id, Operation::CreateMarket {
                question: "Will Bitcoin reach $100k by end of 2025?".to_string(),
                description: "This market resolves based on Bitcoin price data from CoinGecko".to_string(),
                category: "crypto".to_string(),
                resolution_criteria: "Bitcoin price >= $100,000 USD on CoinGecko as of end_timestamp".to_string(),
                end_timestamp,
            });
        })
        .await;

    // Place a trade for YES
    chain
        .add_block(|block| {
            block.with_operation(application_id, Operation::PlaceTrade {
                market_id: 1,
                outcome: MarketOutcome::Yes,
                shares: 100,
            });
        })
        .await;

    // Query the market
    let QueryOutcome { response, .. } = chain
        .graphql_query(application_id, r#"query { market(id: 1) { id question status yesSharesOutstanding totalVolume } }"#)
        .await;
    
    let market = &response["market"];
    assert_eq!(market["id"].as_u64().unwrap(), 1);
    assert_eq!(market["status"].as_str().unwrap(), "open");
    assert_eq!(market["yesSharesOutstanding"].as_u64().unwrap(), 100);
    assert_eq!(market["totalVolume"].as_u64().unwrap(), 100);
}
