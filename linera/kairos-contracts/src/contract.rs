#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

use kairos_contracts::{Operation, MarketOutcome};

use self::state::{KairosContractsState, Market};

pub struct KairosContractsContract {
    state: KairosContractsState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(KairosContractsContract);

impl WithContractAbi for KairosContractsContract {
    type Abi = kairos_contracts::KairosContractsAbi;
}

impl Contract for KairosContractsContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = KairosContractsState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        KairosContractsContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
        // Initialize next_market_id to 1 if not already set
        if *self.state.next_market_id.get() == 0 {
            self.state.next_market_id.set(1);
        }
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::CreateMarket {
                question,
                description,
                category,
                resolution_criteria,
                end_timestamp,
            } => {
                self.create_market(question, description, category, resolution_criteria, end_timestamp).await;
            }
            Operation::PlaceTrade {
                market_id,
                outcome,
                shares,
            } => {
                self.place_trade(market_id, outcome, shares).await;
            }
            Operation::ResolveMarket {
                market_id,
                outcome,
                oracle_data: _,
            } => {
                self.resolve_market(market_id, outcome).await;
            }
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {}

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

impl KairosContractsContract {
    async fn create_market(
        &mut self,
        question: String,
        description: String,
        category: String,
        resolution_criteria: String,
        end_timestamp: u64,
    ) {
        let market_id = *self.state.next_market_id.get();
        // For now, use a placeholder for creator and timestamp
        // TODO: Get actual chain ID and timestamp from runtime when API is available
        let creator = "system".to_string();
        let current_timestamp = end_timestamp - 86400; // Approximate: 1 day before end

        let market = Market {
            id: market_id,
            question,
            description,
            category,
            resolution_criteria,
            end_timestamp,
            status: "open".to_string(),
            resolved_outcome: None,
            creator,
            created_timestamp: current_timestamp,
            yes_shares_outstanding: 0,
            no_shares_outstanding: 0,
            total_volume: 0,
        };

        self.state.markets.insert(&market_id, market).expect("Failed to insert market");
        // Nested MapViews will be created automatically when first accessed
        self.state.next_market_id.set(market_id + 1);
    }

    async fn place_trade(
        &mut self,
        market_id: u64,
        outcome: MarketOutcome,
        shares: u64,
    ) {
        // Get the market
        let Some(mut market) = self.state.markets.get(&market_id).await.ok().flatten() else {
            panic!("Market not found");
        };

        // Verify market is still open
        if market.status != "open" {
            panic!("Market is not open for trading");
        }

        // Verify market hasn't ended (simplified - use end_timestamp check)
        // TODO: Get actual timestamp from runtime when API is available
        // For now, we allow trading if the market is open

        // For now, use a simple owner identifier
        // In production, this would be the actual user's chain ID or address
        let owner = "owner".to_string(); // TODO: Get from context

        // Update shares based on outcome using composite keys
        let position_key = format!("{}:{}", market_id, owner);
        
        match outcome {
            MarketOutcome::Yes => {
                let current = self.state.market_yes_shares.get(&position_key).await
                    .ok().flatten().unwrap_or(0);
                self.state.market_yes_shares.insert(&position_key, current + shares)
                    .expect("Failed to update yes shares");
                market.yes_shares_outstanding += shares;
            }
            MarketOutcome::No => {
                let current = self.state.market_no_shares.get(&position_key).await
                    .ok().flatten().unwrap_or(0);
                self.state.market_no_shares.insert(&position_key, current + shares)
                    .expect("Failed to update no shares");
                market.no_shares_outstanding += shares;
            }
        }

        market.total_volume += shares;
        self.state.markets.insert(&market_id, market).expect("Failed to update market");
    }

    async fn resolve_market(
        &mut self,
        market_id: u64,
        outcome: MarketOutcome,
    ) {
        let Some(mut market) = self.state.markets
            .get(&market_id).await.ok().flatten() else {
            panic!("Market not found");
        };

        if market.status != "open" {
            panic!("Market is already resolved or cancelled");
        }

        let outcome_str = match outcome {
            MarketOutcome::Yes => "yes",
            MarketOutcome::No => "no",
        };

        market.status = "resolved".to_string();
        market.resolved_outcome = Some(outcome_str.to_string());
        
        self.state.markets.insert(&market_id, market).expect("Failed to update market");
    }
}

#[cfg(test)]
mod tests {
    use futures::FutureExt as _;
    use linera_sdk::{util::BlockingWait, views::View, Contract, ContractRuntime};

    use kairos_contracts::Operation;

    use super::{KairosContractsContract, KairosContractsState};

    #[test]
    fn operation() {
        let initial_value = 10u64;
        let mut app = create_and_instantiate_app(initial_value);

        let increment = 10u64;

        let _response = app
            .execute_operation(Operation::Increment { value: increment })
            .now_or_never()
            .expect("Execution of application operation should not await anything");

        assert_eq!(*app.state.value.get(), initial_value + increment);
    }

    fn create_and_instantiate_app(initial_value: u64) -> KairosContractsContract {
        let runtime = ContractRuntime::new().with_application_parameters(());
        let mut contract = KairosContractsContract {
            state: KairosContractsState::load(runtime.root_view_storage_context())
                .blocking_wait()
                .expect("Failed to read from mock key value store"),
            runtime,
        };

        contract
            .instantiate(initial_value)
            .now_or_never()
            .expect("Initialization of application state should not await anything");

        assert_eq!(*contract.state.value.get(), initial_value);

        contract
    }
}
