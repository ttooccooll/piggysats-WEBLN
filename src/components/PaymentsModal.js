import React, { useState } from "react";
import Modal from "react-modal";
import "./PaymentsModal.css";
import QRCode from 'qrcode.react';
import { createInvoice } from './lnd-webln';

const PaymentsModal = ({ modalState, setModalState, onClose }) => {

  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [invoice, setInvoice] = useState("");
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const playMP3 = () => {
    const audio = new Audio("/oink-40664.mp3");
    audio.volume = 0.1;
    audio.play();
  };

  const playMP4 = () => {
    const audio = new Audio("/put-away-book.mp3");
    audio.play();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const paymentRequest = await createInvoice(amount, memo);
    if (paymentRequest) {
      setInvoice(paymentRequest);
      setMessage('Invoice created successfully.');
      setSubmitted(true);
    } else {
      setMessage('Error creating invoice.');
    }
  };

  // Function to clear all of our state when we close the modal
  const clearForms = () => {
    setModalState({
      type: "",
      open: false,
    });
    setInvoice("");
  };

  return (
    <Modal
      isOpen={modalState.open}
      style={{
        content: {
          top: "10%",
          left: "40%",
          right: "40%",
          bottom: "10%",
          backgroundColor: "black",
          zindex: 9999999999999
        },
      }}
      contentLabel="Example Modal"
      appElement={document.getElementById("root")}
    >
      <p
        className="close-button"
        onClick={() => { clearForms(); playMP4(); }}
      >
        X
      </p>

      {modalState.type === "receive" && (
        <form onSubmit={handleSubmit}>
          <label>Enter Amount:</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <label>Enter Message:</label>
          <input
            type="text"
            placeholder="Enter Memo"
            value={memo}
            defaultValue="I forgot to write a message."
            onChange={(e) => setMemo(e.target.value)}
          />
          <button className="buttonq" type="submit" onClick={(e) => { playMP3(); }}>
            Deposit
          </button>
        </form>
      )}
      {submitted && (
        <section>
          <h6>{message}</h6>
          {invoice && (
            <div className="qr-code-container">
              <QRCode value={invoice} size={198} fgColor="aqua" bgColor="#brown" zIndex="9999999999" />
            </div>
          )}
          {invoice && <p>{invoice}</p>}
        </section>
      )}
    </Modal>
  );
};

export default PaymentsModal;
