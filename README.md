```mermaid
sequenceDiagram
    Requester->>StateTaxAPI: POST /getTotalPurchasePrice {state,amount}
    StateTaxAPI-->>Requester: {state,amount, taxRate, taxAmount, totalPrice}

```
