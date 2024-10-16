export const getBalance = async () => {
  if (window.webln) {
    try {
      await window.webln.enable();
      const balance = await window.webln.getBalance();
      console.log("Balance fetched successfully");
      return balance;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
  } else {
    console.error("WebLN not supported");
    return null;
  }
};

export const createInvoice = async (amount, memo) => {
  if (window.webln) {
    try {
      await window.webln.enable();
      const { paymentRequest } = await window.webln.makeInvoice({ amount, memo });
      console.log("Payment request created:", paymentRequest);
      return paymentRequest;
    } catch (error) {
      console.error("Error creating invoice:", error);
      return null;
    }
  } else {
    console.error("WebLN not supported");
    return null;
  }
};

export const getInfo = async () => {
    if (window.webln) {
      try {
        await window.webln.enable();
        const info = await window.webln.getInfo();
        console.log("Info fetched successfully", {info});
        console.log(info.node.alias);
        return info;
      } catch (error) {
        console.error("Error fetching info:", error);
        return 0;
      }
    } else {
      console.error("WebLN not supported");
      return null;
    }
  };

  export const getTrans = async () => {
    if (window.webln) {
      try {
        await window.webln.enable();
        const transactions = await window.webln.request("listinvoices");
        console.log("Transactions fetched successfully:", transactions);
        return transactions;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return null;
      }
    } else {
      console.error("WebLN not supported");
      return null;
    }
  };