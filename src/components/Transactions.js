import React from "react";
import "./Transactions.css";

export const Transactions = ({ transactions }) => {
  const parseTx = (tx) => {
    if (!tx || typeof tx.value !== 'string' || !tx.memo || !tx.creation_date) {
      return null;
    }

    const date = new Date(tx.creation_date * 1000);
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    if (tx.pending || !tx.settled) return null;

    return (
      <div key={tx.r_hash} className="rosie">
        {tx.value > 0 ? (
          <>
            <p className="u">Deposit - {tx.r_hash.substring(0, 7)}...</p>
            <p className="t">+{(parseInt(tx.value) / 1000).toFixed(0)} sats</p>
            <p className="r">{tx.memo}</p>
            <p className="q">Date: {formattedDate}</p>
          </>
        ) : (
          <>
            <p className="u">Withdrawal - {tx.r_hash.substring(0, 7)}...</p>
            <p className="t">{(parseInt(tx.value) / 1000).toFixed(0)} sats</p>
            <p className="r">{tx.memo}</p>
            <p className="q">Date: {formattedDate}</p>
          </>
        )}
      </div>
    );
  };

  const sortedTransactions = [...transactions].sort((a, b) => b.creation_date - a.creation_date);

  return (
    <div className="rosiex">
      <h4>Transactions</h4>
      <div className="transaction-list">
        {sortedTransactions.map((transaction) => (
          <div key={transaction.r_hash} className="transaction">
            {parseTx(transaction)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
