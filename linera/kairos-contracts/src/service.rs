#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use std::sync::Arc;

use async_graphql::{EmptySubscription, Object, Schema};
use linera_sdk::{
    graphql::GraphQLMutationRoot, linera_base_types::WithServiceAbi, views::View, Service,
    ServiceRuntime,
};

use kairos_contracts::Operation;

use self::state::{KairosContractsState, Market, UserPosition};

pub struct KairosContractsService {
    state: KairosContractsState,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(KairosContractsService);

impl WithServiceAbi for KairosContractsService {
    type Abi = kairos_contracts::KairosContractsAbi;
}

impl Service for KairosContractsService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = KairosContractsState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        KairosContractsService {
            state,
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, query: Self::Query) -> Self::QueryResponse {
        Schema::build(
            QueryRoot,
            Operation::mutation_root(self.runtime.clone()),
            EmptySubscription,
        )
        .data(self.runtime.clone())
        .finish()
        .execute(query)
        .await
    }
}

struct QueryRoot;

#[Object]
impl QueryRoot {
    /// Get all markets
    async fn markets(&self, ctx: &async_graphql::Context<'_>) -> Vec<Market> {
        let runtime = ctx.data::<Arc<ServiceRuntime<KairosContractsService>>>().unwrap();
        // Note: Accessing state through runtime requires proper async handling
        // This is a placeholder - full implementation would use runtime to access state
        Vec::new()
    }

    /// Get a specific market by ID
    async fn market(&self, ctx: &async_graphql::Context<'_>, id: u64) -> Option<Market> {
        let _runtime = ctx.data::<Arc<ServiceRuntime<KairosContractsService>>>().unwrap();
        // Placeholder
        None
    }

    /// Get user positions for a specific market
    async fn user_positions(&self, ctx: &async_graphql::Context<'_>, _market_id: u64, _owner: String) -> Option<UserPosition> {
        let _runtime = ctx.data::<Arc<ServiceRuntime<KairosContractsService>>>().unwrap();
        // Placeholder - full implementation would access state through runtime
        None
    }

    /// Get all markets by category
    async fn markets_by_category(&self, ctx: &async_graphql::Context<'_>, _category: String) -> Vec<Market> {
        let _runtime = ctx.data::<Arc<ServiceRuntime<KairosContractsService>>>().unwrap();
        // Placeholder - full implementation would filter markets by category
        Vec::new()
    }

    /// Get markets by status
    async fn markets_by_status(&self, ctx: &async_graphql::Context<'_>, _status: String) -> Vec<Market> {
        let _runtime = ctx.data::<Arc<ServiceRuntime<KairosContractsService>>>().unwrap();
        // Placeholder - full implementation would filter markets by status
        Vec::new()
    }

    /// Get the next market ID
    async fn next_market_id(&self, ctx: &async_graphql::Context<'_>) -> u64 {
        let _runtime = ctx.data::<Arc<ServiceRuntime<KairosContractsService>>>().unwrap();
        0
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use async_graphql::{Request, Response, Value};
    use futures::FutureExt as _;
    use linera_sdk::{util::BlockingWait, views::View, Service, ServiceRuntime};
    use serde_json::json;

    use super::{KairosContractsService, KairosContractsState};

    #[test]
    fn query() {
        let value = 60u64;
        let runtime = Arc::new(ServiceRuntime::<KairosContractsService>::new());
        let mut state = KairosContractsState::load(runtime.root_view_storage_context())
            .blocking_wait()
            .expect("Failed to read from mock key value store");
        state.value.set(value);

        let service = KairosContractsService { state, runtime };
        let request = Request::new("{ value }");

        let response = service
            .handle_query(request)
            .now_or_never()
            .expect("Query should not await anything");

        let expected = Response::new(Value::from_json(json!({"value": 60})).unwrap());

        assert_eq!(response, expected)
    }
}
