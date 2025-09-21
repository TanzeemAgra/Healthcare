import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Badge, Pagination, InputGroup, Spinner, Alert } from 'react-bootstrap';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';

const ITEMS_PER_PAGE = 10;

const ReportHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await apiClient.get('/radiology/history/');
                setHistory(response.data.results || response.data); // Adjust if pagination is handled by API
            } catch (err) {
                setError('Failed to load report history. Please try again.');
                console.error("Error fetching report history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredHistory = history.filter(item =>
        (item.original_filename && item.original_filename.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.user_email && item.user_email.toLowerCase().includes(searchTerm.toLowerCase())) || // Assuming user_email is for admin view, might remove for user view
        (item.processing_type_display && item.processing_type_display.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.status_display && item.status_display.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
    const currentTableData = filteredHistory.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return <Badge bg="success-subtle" text="success">Completed</Badge>;
            case 'pending': return <Badge bg="warning-subtle" text="warning">Pending</Badge>;
            case 'failed': return <Badge bg="danger-subtle" text="danger">Failed</Badge>;
            default: return <Badge bg="secondary-subtle" text="secondary">{status}</Badge>;
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    let paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    if (loading) {
        return (
            <Container fluid className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading history...</p>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Header.Title>
                                <h3 className="card-title text-primary">Radiology Processing History</h3>
                            </Card.Header.Title>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                            <Row className="mb-3 align-items-center">
                                <Col md={8}>
                                    <InputGroup>
                                        <InputGroup.Text><i className="ri-search-line text-primary"></i></InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search by filename, type, or status..."
                                            value={searchTerm}
                                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col md={4} className="text-md-end mt-2 mt-md-0">
                                    <Button variant="primary-subtle" as={Link} to="/radiology/analyze-report" className="me-2">
                                        <i className="ri-add-line me-1"></i>Analyze Report
                                    </Button>
                                    <Button variant="success-subtle" as={Link} to="/radiology/anonymize">
                                        <i className="ri-shield-keyhole-line me-1"></i>Anonymize Doc
                                    </Button>
                                </Col>
                            </Row>

                            <div className="table-responsive">
                                <Table striped hover responsive className="mt-2">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Filename / Input</th>
                                            <th>Processing Type</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Details</th>
                                            {/* <th>Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTableData.length > 0 ? currentTableData.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{((currentPage - 1) * ITEMS_PER_PAGE) + index + 1}</td>
                                                <td>{item.original_filename || item.input_preview || 'N/A'}</td>
                                                <td><Badge bg="light" text="dark" pill>{item.processing_type_display}</Badge></td>
                                                <td>{new Date(item.created_at).toLocaleString()}</td>
                                                <td>{getStatusBadge(item.status_display)}</td>
                                                <td>
                                                    {item.processing_type === 'anonymization' && item.redacted_item_counts &&
                                                        `Redacted: ${Object.values(item.redacted_item_counts).reduce((a, b) => a + b, 0)} items`
                                                    }
                                                    {item.processing_type === 'report_analysis' && typeof item.accuracy_score === 'number' &&
                                                        `Accuracy: ${item.accuracy_score.toFixed(1)}%`
                                                    }
                                                    {item.output_preview && (
                                                        <span className="d-block text-muted small">
                                                            Preview: {item.output_preview.length > 20
                                                                ? '...' + item.output_preview.substring(0, 50)
                                                                : item.output_preview}
                                                        </span>
                                                    )}


                                                </td>
                                                {/* <td>
                                                    <Button variant="link" size="sm" className="p-1 text-primary" title="View Details">
                                                        <i className="ri-eye-line ri-lg"></i>
                                                    </Button>
                                                </td> */}
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted py-4">No processing history found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-3">
                                    <Pagination>
                                        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                                        {paginationItems}
                                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                                    </Pagination>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ReportHistory;