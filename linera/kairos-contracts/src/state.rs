use linera_sdk::views::{linera_views, RegisterView, RootView, ViewStorageContext, MapView};
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Market {
    pub id: u64,
    pub question: String,
    pub description: String,
    pub category: String,
    pub resolution_criteria: String,
    pub end_timestamp: u64,
    pub status: String, // "open", "resolved", "cancelled"
    pub resolved_outcome: Option<String>, // "yes" or "no"
    pub creator: String,
    pub created_timestamp: u64,
    pub yes_shares_outstanding: u64,
    pub no_shares_outstanding: u64,
    pub total_volume: u64,
}

#[derive(Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct UserPosition {
    pub owner: String,
    pub market_id: u64,
    pub yes_shares: u64,
    pub no_shares: u64,
}

// Composite key for user positions: format!("{}:{}", market_id, owner)
type PositionKey = String;

#[derive(RootView, async_graphql::SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct KairosContractsState {
    pub next_market_id: RegisterView<u64>,
    pub markets: MapView<u64, Market>,
    // Composite key: "market_id:owner" -> shares for YES outcome
    pub market_yes_shares: MapView<PositionKey, u64>,
    // Composite key: "market_id:owner" -> shares for NO outcome
    pub market_no_shares: MapView<PositionKey, u64>,
}
