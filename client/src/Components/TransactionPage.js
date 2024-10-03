import React, { useEffect, useState } from 'react';
import { Card, Accordion, Container, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import { fetchTransactionData } from '../api/transactionApi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../css/transaction-form.css';

function TransactionPage() {
  const { userInfo } = useSelector((state) => state.user);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTransactionData = async () => {
      if (!userInfo?.accountNumber) {
        console.error('Account number is not available');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchTransactionData(userInfo.accountNumber);
        setTransactions(data);
      } catch (error) {
        console.error('Error in fetching transaction data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getTransactionData();
  }, [userInfo]);

  if (loading) return <p>Loading transaction data...</p>;
  if (error) return <p>Error: {error.message || 'Unable to fetch transaction data.'}</p>;
  if (transactions.length === 0) return <p>No transaction data available.</p>;

  return (
    <Container fluid className="transaction-form py-4">
      <Row className="justify-content-center transaction-form-grid">
        <Col xs={12} md={8} lg={6}>
          <h1 className="text-center mb-4">Transaction History</h1>

          {transactions.map(transaction => (
            <Card 
              className={`transaction-card bg-warning mx-auto my-3 ${transaction.type}-transaction`} 
              key={transaction.transactionId}
            >
              <Card.Header className="transaction-header">
                {transaction.type === 'sent' ? 'Sent to' : 'Received from'}: {transaction.otherParty.fullname}
              </Card.Header>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0" className="transaction-accordion-item">
                  <Accordion.Header className="transaction-accordion-header">
                    {transaction.amount} {transaction.currency} - {new Date(transaction.transactionTime).toLocaleString()}
                  </Accordion.Header>
                  <Accordion.Body className="transaction-accordion-body">
                    <p><strong>Transaction ID:</strong> {transaction.transactionId}</p>
                    <p><strong>Other Party Account:</strong> {transaction.otherParty.accountNumber}</p>
                    <p><strong>Transfer Method:</strong> {transaction.transferMethod}</p>
                    <p><strong>Status:</strong> {transaction.status}</p>
                    {transaction.memo && <p><strong>Memo:</strong> {transaction.memo}</p>}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card>
          ))}

          <div className="back-link-container link-container text-center mt-4">
            <Link to="/account-dashboard" className="linktag mx-2">
              <h3 className="back">My Dashboard</h3>
            </Link>
            <Link to="/account" className="linktag mx-2">
              <h3 className="back">Go Back To Accounts</h3>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default TransactionPage;