import React, { useState, useEffect } from "react";
import axios from "axios";
import NavigationLink from "./NavigationLink";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import SuccessModal from "../Modal/SuccessModal";
import { fetchRecipientName } from "../api/transactionApi";
import "../css/sendMoney.css";

// Utility function to format currency
const formatCurrency = (amount, currencyCode) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(amount);
};

const SendMoney = () => {
  const [senderAccountNumber, setSenderAccountNumber] = useState("");
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGR");
  const [transferMethod, setTransferMethod] = useState("instant");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const formattedAmount = formatCurrency(amount, currency);

  // Fetching the account number from local storage
  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem("userInfo");
    if (userInfoFromStorage) {
      const parsedUserInfo = JSON.parse(userInfoFromStorage);
      const accountNumberFromStorage = parsedUserInfo.user.accountNumber;
      setSenderAccountNumber(accountNumberFromStorage);
      console.log(
        "Account Number from local storage:",
        accountNumberFromStorage
      );
    }
  }, []);

  // Handle recipient account number input change
  const handleRecipientAccountNumberChange = (event) => {
    setRecipientAccountNumber(event.target.value);
  };

  // Fetch recipient name when recipientAccountNumber is entered
  useEffect(() => {
    if (recipientAccountNumber.length === 10) {
      setIsLoading(true);
      setError("");
      fetchRecipientName(recipientAccountNumber)
        .then((response) => {
          setRecipientName(response.fullname);
          setIsLoading(false);
        })
        .catch(() => {
          setError("Recipient not found");
          setIsLoading(false);
        });
    }
  }, [recipientAccountNumber]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const transactionDetails = {
      senderAccountNumber, // Use sender's account number from localStorage
      recipientAccountNumber,
      fullname: recipientName,
      amount: parseFloat(amount),
      currency,
      transferMethod,
      memo,
    };

    try {
      await axios.post("/api/users/submit-transaction", transactionDetails);
      setTransactionStatus("Transaction successful!");
      setShowSuccessModal(true);

      // Reset form fields
      setRecipientAccountNumber("");
      setRecipientName("");
      setAmount("");
      setCurrency("NGR");
      setTransferMethod("instant");
      setMemo("");
    } catch (error) {
      setTransactionStatus("Transaction failed. Please try again.");
    }
  };
  return (
    <>
      <Container className="send-money-container py-5">
        <Form onSubmit={handleSubmit}>
          <Row className="send-money-grid">
            <Col xs={12} md={6}>
              <Form.Group controlId="recipientAccountNumber" className="mb-3">
                <Form.Label className="send-money-label">
                  Recipient Account Number
                </Form.Label>
                <Form.Control
                  type="text"
                  className="send-money-input"
                  value={recipientAccountNumber}
                  onChange={handleRecipientAccountNumberChange}
                  placeholder="Recipient Account Number"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="send-money-label">
                  Recipient Name
                </Form.Label>
                <div className="send-money-recipient-name">
                  {isLoading
                    ? "Searching..."
                    : recipientName || error || "Enter a valid account number"}
                </div>
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="amount" className="mb-3">
                <Form.Label className="send-money-label">Amount</Form.Label>
                <Form.Control
                  type="number"
                  className="send-money-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="currency" className="mb-3">
                <Form.Label className="send-money-label">Currency</Form.Label>
                <Form.Select
                  className="send-money-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="NGR">NGR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="transferMethod" className="mb-3">
                <Form.Label className="send-money-label">
                  Transfer Method
                </Form.Label>
                <Form.Select
                  className="send-money-select"
                  value={transferMethod}
                  onChange={(e) => setTransferMethod(e.target.value)}
                >
                  <option value="instant">Instant Transfer</option>
                  <option value="scheduled">Scheduled Transfer</option>
                  <option value="recurring">Recurring Transfer</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label className="send-money-label">
                  Formatted Amount
                </Form.Label>
                <div className="formatted-amount">{formattedAmount}</div>
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group controlId="memo" className="mb-3">
                <Form.Label className="send-money-label">
                  Memo (Optional)
                </Form.Label>
                <Form.Control
                  type="text"
                  className="send-money-input"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Button type="submit" className="send-money-button w-100">
                Send Money
              </Button>
            </Col>

            {transactionStatus && (
              <Col xs={12}>
                <div className="transaction-status mt-3">
                  {transactionStatus}
                </div>
              </Col>
            )}
          </Row>
        </Form>

        {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )}
        <div className="navigation-links-container">
          <NavigationLink />
        </div>
      </Container>
    </>
  );
};

export default SendMoney;
