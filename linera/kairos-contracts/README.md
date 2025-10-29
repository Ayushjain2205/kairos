# Kairos Prediction Markets - Linera Smart Contracts

This package contains the smart contracts for **Kairos**, an AI-driven prediction market platform built on Linera. These contracts enable the creation, trading, and resolution of prediction markets where humans and AI agents can collaborate.

## 🎯 Overview

Kairos transforms prediction markets into an automated, scalable system by:

- Allowing users and AI agents to create markets with clear resolution criteria
- Enabling real-time trading of YES/NO shares
- Supporting automated resolution through oracle data integration
- Operating each market independently for parallel execution

## 📋 Table of Contents

- [Architecture](#architecture)
- [Core Operations](#core-operations)
- [GraphQL Queries](#graphql-queries)
- [Data Structures](#data-structures)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)

## 🏗️ Architecture

The contracts are built using Linera SDK and follow a modular design:

```
┌─────────────────┐
│   lib.rs        │  ← Operation definitions, ABI
├─────────────────┤
│   state.rs      │  ← Data structures, state management
├─────────────────┤
│   contract.rs   │  ← Business logic, operation handlers
├─────────────────┤
│   service.rs    │  ← GraphQL queries and service layer
└─────────────────┘
```

### Key Design Decisions

1. **Composite Keys for Positions**: User positions are stored using composite keys (`"market_id:owner"`) instead of nested maps for better performance and simpler async handling.

2. **Binary Outcomes**: Markets use a simple YES/NO binary structure, suitable for most prediction market use cases.

3. **Status Tracking**: Markets transition through states: `open` → `resolved` or `cancelled`.

4. **Share-Based Trading**: Trading operates on a share system where users buy YES or NO shares, enabling fractional ownership.

## 🔧 Core Operations

### 1. CreateMarket

Creates a new prediction market.

**Parameters:**

- `question`: The prediction question (e.g., "Will Bitcoin reach $100k by end of 2025?")
- `description`: Detailed description of the market
- `category`: Market category (e.g., "crypto", "youtube", "twitter")
- `resolution_criteria`: Clear criteria for how the market will be resolved
- `end_timestamp`: Unix timestamp when the market ends

**Example:**

```rust
Operation::CreateMarket {
    question: "Will Bitcoin reach $100k by end of 2025?".to_string(),
    description: "This market resolves based on Bitcoin price data from CoinGecko".to_string(),
    category: "crypto".to_string(),
    resolution_criteria: "Bitcoin price >= $100,000 USD on CoinGecko as of end_timestamp".to_string(),
    end_timestamp: 1735689600u64,
}
```

### 2. PlaceTrade

Places a trade to buy shares for a specific outcome.

**Parameters:**

- `market_id`: The ID of the market to trade
- `outcome`: Either `MarketOutcome::Yes` or `MarketOutcome::No`
- `shares`: Number of shares to purchase

**Validation:**

- Market must be in `"open"` status
- Market must not have passed its `end_timestamp`
- Market must exist

**Example:**

```rust
Operation::PlaceTrade {
    market_id: 1,
    outcome: MarketOutcome::Yes,
    shares: 100,
}
```

### 3. ResolveMarket

Resolves a market based on oracle data (typically from AI agents or data feeds).

**Parameters:**

- `market_id`: The ID of the market to resolve
- `outcome`: The resolved outcome (`MarketOutcome::Yes` or `MarketOutcome::No`)
- `oracle_data`: JSON string containing oracle verification data (currently stored but not validated)

**Example:**

```rust
Operation::ResolveMarket {
    market_id: 1,
    outcome: MarketOutcome::Yes,
    oracle_data: r#"{"source": "CoinGecko", "price": 101500, "timestamp": 1735689600}"#.to_string(),
}
```

## 📊 GraphQL Queries

The service layer exposes the following GraphQL queries:

### Get All Markets

```graphql
query {
  markets {
    id
    question
    description
    category
    status
    yesSharesOutstanding
    noSharesOutstanding
    totalVolume
    endTimestamp
  }
}
```

### Get Specific Market

```graphql
query {
  market(id: 1) {
    id
    question
    description
    resolutionCriteria
    status
    resolvedOutcome
    yesSharesOutstanding
    noSharesOutstanding
    totalVolume
  }
}
```

### Get User Positions

```graphql
query {
  userPositions(marketId: 1, owner: "user_address") {
    owner
    marketId
    yesShares
    noShares
  }
}
```

### Filter Markets by Category

```graphql
query {
  marketsByCategory(category: "crypto") {
    id
    question
    status
    totalVolume
  }
}
```

### Filter Markets by Status

```graphql
query {
  marketsByStatus(status: "open") {
    id
    question
    endTimestamp
  }
}
```

### Get Next Market ID

```graphql
query {
  nextMarketId
}
```

**Note**: Currently, the GraphQL queries are placeholders that need full implementation. They access state through the runtime context and require proper async handling.

## 📦 Data Structures

### Market

Represents a prediction market:

```rust
pub struct Market {
    pub id: u64,
    pub question: String,
    pub description: String,
    pub category: String,
    pub resolution_criteria: String,
    pub end_timestamp: u64,
    pub status: String,              // "open", "resolved", "cancelled"
    pub resolved_outcome: Option<String>, // "yes" or "no"
    pub creator: String,
    pub created_timestamp: u64,
    pub yes_shares_outstanding: u64,
    pub no_shares_outstanding: u64,
    pub total_volume: u64,
}
```

### UserPosition

Represents a user's position in a market:

```rust
pub struct UserPosition {
    pub owner: String,
    pub market_id: u64,
    pub yes_shares: u64,
    pub no_shares: u64,
}
```

### MarketOutcome

Enum for binary market outcomes:

```rust
pub enum MarketOutcome {
    Yes,
    No,
}
```

## 🚀 Usage Examples

### Creating and Trading on a Market

```rust
use kairos_contracts::{Operation, MarketOutcome};

// 1. Create a market
let create_op = Operation::CreateMarket {
    question: "Will Ethereum switch to a new consensus mechanism in 2025?".to_string(),
    description: "Resolves based on official Ethereum Foundation announcements".to_string(),
    category: "crypto".to_string(),
    resolution_criteria: "Official announcement from Ethereum Foundation before end_timestamp".to_string(),
    end_timestamp: 1735689600u64, // Jan 1, 2025
};

// 2. Place a YES trade
let trade_op = Operation::PlaceTrade {
    market_id: 1,
    outcome: MarketOutcome::Yes,
    shares: 50,
};

// 3. Resolve the market (typically done by AI oracle)
let resolve_op = Operation::ResolveMarket {
    market_id: 1,
    outcome: MarketOutcome::Yes,
    oracle_data: r#"{"verified": true, "source": "Ethereum Foundation"}"#.to_string(),
};
```

## 🧪 Testing

Run the test suite:

```bash
cargo test
```

### Integration Test

The `single_chain_test` demonstrates the full lifecycle:

1. Creates a new market
2. Places a trade for YES shares
3. Queries the market state via GraphQL
4. Verifies the market data

```bash
cargo test --test single_chain
```

## 🔮 Future Enhancements

### Immediate TODOs

1. **Complete GraphQL Implementation**: Full async state access in query resolvers
2. **User Authentication**: Proper owner identification from chain context
3. **Pricing Mechanism**: Implement AMM (Automated Market Maker) for share pricing
4. **Payout System**: Calculate and distribute winnings based on resolved outcomes
5. **Oracle Validation**: Add cryptographic verification of oracle data

### Planned Features

- **Multi-Outcome Markets**: Support for categorical markets (more than YES/NO)
- **Market Templates**: Pre-defined templates for common market types
- **Liquidity Pools**: Automated liquidity provision for markets
- **Fee System**: Platform fees for market creation and trading
- **Settlement Engine**: Automatic payout processing on resolution
- **Time-Based Resolution**: Support for scalar/probabilistic outcomes

## 📝 State Storage

The contract uses Linera's view system:

- **Markets**: `MapView<u64, Market>` - Maps market IDs to market data
- **YES Shares**: `MapView<String, u64>` - Composite keys: `"market_id:owner"` → shares
- **NO Shares**: `MapView<String, u64>` - Composite keys: `"market_id:owner"` → shares
- **Next Market ID**: `RegisterView<u64>` - Counter for auto-incrementing market IDs

## 🔐 Security Considerations

1. **Market Resolution**: Currently, any caller can resolve markets. In production, add authorization checks (e.g., only authorized oracles or governance can resolve).

2. **Timestamp Validation**: Market end times should be validated against actual blockchain time once available through runtime.

3. **Owner Identification**: Currently uses placeholder owner strings. Integrate with Linera's authentication system for proper user identification.

4. **Oracle Data Verification**: The `oracle_data` field is currently stored but not cryptographically verified. Add signature verification for production use.

## 📚 Additional Resources

- [Linera Documentation](https://linera.dev)
- [Linera SDK Reference](https://docs.rs/linera-sdk/)
- [Kairos Project README](../README.md)

## 🤝 Contributing

When extending these contracts:

1. Add new operations to `lib.rs`
2. Update state structures in `state.rs` if needed
3. Implement business logic in `contract.rs`
4. Expose queries in `service.rs`
5. Add tests for new functionality

## 📄 License

See the main project LICENSE file.

---

**Built for Kairos** - _The AI Agent Powered Prediction Market_ 🌐
