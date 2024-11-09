sequenceDiagram
    Requester->>StateTaxAPI: /getTotalPurchasePrice {state, amount}
    StateTaxAPI-->>{state,amount, taxRate, taxAmount, totalPrice}
