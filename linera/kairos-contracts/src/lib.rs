use async_graphql::{Request, Response};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{ContractAbi, ServiceAbi},
};
use serde::{Deserialize, Serialize};

pub struct KairosContractsAbi;

impl ContractAbi for KairosContractsAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for KairosContractsAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Deserialize, Serialize, Clone, Copy, PartialEq, Eq, async_graphql::Enum)]
pub enum MarketOutcome {
    Yes,
    No,
}

#[derive(Debug, Deserialize, Serialize, Clone, PartialEq, Eq)]
pub enum MarketStatus {
    Open,
    Resolved(MarketOutcome),
    Cancelled,
}

#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    CreateMarket {
        question: String,
        description: String,
        category: String,
        resolution_criteria: String,
        end_timestamp: u64,
    },
    PlaceTrade {
        market_id: u64,
        outcome: MarketOutcome,
        shares: u64,
    },
    ResolveMarket {
        market_id: u64,
        outcome: MarketOutcome,
        oracle_data: String,
    },
}
