import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Form, Table, Badge, 
  Alert, Modal, Tabs, Tab, InputGroup, Pagination, Spinner,
  ListGroup 
} from 'react-bootstrap';
import { 
  FaBox, FaPlus, FaEdit, FaEye, FaSearch, FaFilter, 
  FaBrain, FaDollarSign, FaBarcode, FaShoppingCart,
  FaExclamationTriangle, FaCheckCircle, FaStar
} from 'react-icons/fa';
import ProtectedRoute from '../common/ProtectedRoute';
import apiClient from '../../services/api';
import { 
  COSMETOLOGY_ENDPOINTS, 
  PRODUCT_CATEGORIES, 
  VALIDATION_RULES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES 
} from '../../constants/cosmetologyConstants';

const CosmetologyProducts = () => {
  // State Management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    brand: '',
    description: '',
    price: '',
    cost_price: '',
    sku: '',
    barcode: '',
    stock_quantity: '',
    min_stock_level: '',
    max_stock_level: '',
    ingredients: '',
    usage_instructions: '',
    warnings: '',
    expiry_date: '',
    supplier: '',
    is_active: true,
    is_professional_only: false
  });

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(COSMETOLOGY_ENDPOINTS.PRODUCTS);
      setProducts(response.data.results || response.data);
    } catch (error) {
      showAlert(ERROR_MESSAGES.NETWORK_ERROR, 'danger');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show alert helper
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!productForm.name || productForm.name.length < 2) {
      showAlert('Product name is required and must be at least 2 characters', 'danger');
      return false;
    }
    
    if (!productForm.category) {
      showAlert('Please select a product category', 'danger');
      return false;
    }
    
    if (!productForm.price || productForm.price <= 0) {
      showAlert('Please enter a valid price', 'danger');
      return false;
    }
    
    if (!productForm.stock_quantity || productForm.stock_quantity < 0) {
      showAlert('Please enter a valid stock quantity', 'danger');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        cost_price: parseFloat(productForm.cost_price) || null,
        stock_quantity: parseInt(productForm.stock_quantity),
        min_stock_level: parseInt(productForm.min_stock_level) || 0,
        max_stock_level: parseInt(productForm.max_stock_level) || null
      };

      if (modalType === 'create') {
        await apiClient.post(COSMETOLOGY_ENDPOINTS.PRODUCTS, payload);
        showAlert('Product created successfully!');
      } else if (modalType === 'edit') {
        await apiClient.put(`${COSMETOLOGY_ENDPOINTS.PRODUCTS}/${selectedProduct.id}/`, payload);
        showAlert('Product updated successfully!');
      }
      
      fetchProducts();
      closeModal();
    } catch (error) {
      showAlert(ERROR_MESSAGES.SERVER_ERROR, 'danger');
      console.error('Error saving product:', error);
    }
  };

  // Open modal
  const openModal = (type, product = null) => {
    setModalType(type);
    setSelectedProduct(product);
    
    if (type === 'create') {
      setProductForm({
        name: '',
        category: '',
        brand: '',
        description: '',
        price: '',
        cost_price: '',
        sku: '',
        barcode: '',
        stock_quantity: '',
        min_stock_level: '',
        max_stock_level: '',
        ingredients: '',
        usage_instructions: '',
        warnings: '',
        expiry_date: '',
        supplier: '',
        is_active: true,
        is_professional_only: false
      });
    } else if (type === 'edit' && product) {
      setProductForm({
        ...product,
        expiry_date: product.expiry_date ? new Date(product.expiry_date).toISOString().split('T')[0] : ''
      });
    }
    
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setModalType('create');
  };

  // Toggle product active status
  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      await apiClient.patch(`${COSMETOLOGY_ENDPOINTS.PRODUCTS}/${productId}/`, {
        is_active: !currentStatus
      });
      showAlert('Product status updated successfully!');
      fetchProducts();
    } catch (error) {
      showAlert(ERROR_MESSAGES.SERVER_ERROR, 'danger');
      console.error('Error updating product status:', error);
    }
  };

  // Update stock quantity
  const updateStock = async (productId, newQuantity) => {
    try {
      await apiClient.patch(`${COSMETOLOGY_ENDPOINTS.PRODUCTS}/${productId}/`, {
        stock_quantity: newQuantity
      });
      showAlert('Stock quantity updated successfully!');
      fetchProducts();
    } catch (error) {
      showAlert(ERROR_MESSAGES.SERVER_ERROR, 'danger');
      console.error('Error updating stock:', error);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    const matchesStock = filterStock === 'all' || 
      (filterStock === 'in_stock' && product.stock_quantity > 0) ||
      (filterStock === 'low_stock' && product.stock_quantity <= product.min_stock_level) ||
      (filterStock === 'out_of_stock' && product.stock_quantity === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sort products by name
  const sortedProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Get category details
  const getCategoryDetails = (categoryValue) => {
    return Object.values(PRODUCT_CATEGORIES).find(cat => cat.value === categoryValue) || 
           { label: categoryValue, icon: 'fas fa-tag' };
  };

  // Get stock status
  const getStockStatus = (product) => {
    if (product.stock_quantity === 0) {
      return { label: 'Out of Stock', variant: 'danger', icon: 'fa-times-circle' };
    } else if (product.stock_quantity <= product.min_stock_level) {
      return { label: 'Low Stock', variant: 'warning', icon: 'fa-exclamation-triangle' };
    } else {
      return { label: 'In Stock', variant: 'success', icon: 'fa-check-circle' };
    }
  };

  // Calculate profit margin
  const calculateProfitMargin = (product) => {
    if (!product.cost_price || product.cost_price === 0) return 0;
    return ((product.price - product.cost_price) / product.cost_price * 100).toFixed(1);
  };

  return (
    <ProtectedRoute>
      <Container fluid className="py-4">
        {/* Alert */}
        {alert.show && (
          <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })}>
            {alert.message}
          </Alert>
        )}

        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-0">
                  <FaBox className="me-2" />
                  Product Inventory
                </h2>
                <p className="text-muted mb-0">Manage beauty products with AI-powered inventory optimization</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => openModal('create')}
                className="d-flex align-items-center"
              >
                <FaPlus className="me-2" />
                Add New Product
              </Button>
            </div>
          </Col>
        </Row>

        {/* Search and Filter Bar */}
        <Row className="mb-4">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by name, brand, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {Object.values(PRODUCT_CATEGORIES).map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select 
              value={filterStock} 
              onChange={(e) => setFilterStock(e.target.value)}
            >
              <option value="all">All Stock Levels</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <div className="text-muted">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </div>
          </Col>
        </Row>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-5">
              <FaBox size={48} className="text-muted mb-3" />
              <h5>No products found</h5>
              <p className="text-muted">No products match your current search criteria.</p>
              <Button variant="primary" onClick={() => openModal('create')}>
                Add Your First Product
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {paginatedProducts.map(product => {
              const categoryDetails = getCategoryDetails(product.category);
              const stockStatus = getStockStatus(product);
              const profitMargin = calculateProfitMargin(product);
              
              return (
                <Col lg={4} md={6} key={product.id} className="mb-4">
                  <Card className={`h-100 ${!product.is_active ? 'opacity-75' : ''}`}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <Badge bg="primary" className="d-flex align-items-center">
                        <i className={`${categoryDetails.icon} me-1`}></i>
                        {categoryDetails.label}
                      </Badge>
                      <div className="d-flex gap-1">
                        <Badge bg={stockStatus.variant} className="d-flex align-items-center">
                          <i className={`fas ${stockStatus.icon} me-1`}></i>
                          {stockStatus.label}
                        </Badge>
                        {product.is_professional_only && (
                          <Badge bg="warning" title="Professional Only">
                            <FaStar />
                          </Badge>
                        )}
                      </div>
                    </Card.Header>
                    
                    <Card.Body>
                      <Card.Title className="h6">{product.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {product.brand}
                      </Card.Subtitle>
                      
                      <Card.Text className="text-muted small">
                        {product.description.length > 80 
                          ? `${product.description.substring(0, 80)}...` 
                          : product.description}
                      </Card.Text>
                      
                      {/* Product Details */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Price:</small>
                          <strong className="text-success">${product.price}</strong>
                        </div>
                        
                        {product.cost_price && (
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Cost:</small>
                            <small>${product.cost_price}</small>
                          </div>
                        )}
                        
                        {profitMargin > 0 && (
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Margin:</small>
                            <small className="text-info">{profitMargin}%</small>
                          </div>
                        )}
                        
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Stock:</small>
                          <strong className={`text-${stockStatus.variant}`}>
                            {product.stock_quantity} units
                          </strong>
                        </div>
                        
                        {product.sku && (
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">SKU:</small>
                            <small className="font-monospace">{product.sku}</small>
                          </div>
                        )}
                      </div>
                      
                      {/* AI Features for this category */}
                      {categoryDetails.aiFeatures && (
                        <div className="mb-2">
                          <small className="text-muted d-flex align-items-center mb-1">
                            <FaBrain className="me-1" />
                            AI Features:
                          </small>
                          <div className="d-flex flex-wrap gap-1">
                            {categoryDetails.aiFeatures.slice(0, 2).map((feature, index) => (
                              <Badge key={index} bg="info" className="small">
                                {feature}
                              </Badge>
                            ))}
                            {categoryDetails.aiFeatures.length > 2 && (
                              <Badge bg="light" text="dark" className="small">
                                +{categoryDetails.aiFeatures.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Expiry warning */}
                      {product.expiry_date && new Date(product.expiry_date) < new Date(Date.now() + 30*24*60*60*1000) && (
                        <div className="mb-2">
                          <small className="text-warning d-flex align-items-center">
                            <FaExclamationTriangle className="me-1" />
                            Expires: {new Date(product.expiry_date).toLocaleDateString()}
                          </small>
                        </div>
                      )}
                    </Card.Body>
                    
                    <Card.Footer className="d-flex justify-content-between">
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openModal('view', product)}
                          title="View Details"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-warning"
                          onClick={() => openModal('edit', product)}
                          title="Edit Product"
                        >
                          <FaEdit />
                        </Button>
                      </div>
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-info"
                          title="Quick Stock Update"
                          onClick={() => {
                            const newStock = prompt(`Update stock for ${product.name}:`, product.stock_quantity);
                            if (newStock !== null && !isNaN(newStock) && newStock >= 0) {
                              updateStock(product.id, parseInt(newStock));
                            }
                          }}
                        >
                          <FaShoppingCart />
                        </Button>
                        <Button
                          size="sm"
                          variant={product.is_active ? "outline-danger" : "outline-success"}
                          onClick={() => toggleProductStatus(product.id, product.is_active)}
                          title={product.is_active ? "Deactivate" : "Activate"}
                        >
                          {product.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Row className="mt-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
                </div>
                <Pagination className="mb-0">
                  <Pagination.Prev 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </Pagination>
              </div>
            </Col>
          </Row>
        )}

        {/* Product Modal */}
        <Modal show={showModal} onHide={closeModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === 'create' && 'Add New Product'}
              {modalType === 'edit' && 'Edit Product'}
              {modalType === 'view' && 'Product Details'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === 'view' && selectedProduct ? (
              // View Mode
              <Tabs defaultActiveKey="details" id="product-details-tabs">
                <Tab eventKey="details" title="Product Details">
                  <div className="mt-3">
                    <Row>
                      <Col md={8}>
                        <h5>{selectedProduct.name}</h5>
                        <p className="text-muted">{selectedProduct.brand}</p>
                        <p>{selectedProduct.description}</p>
                        
                        {selectedProduct.ingredients && (
                          <>
                            <h6>Ingredients</h6>
                            <p className="small">{selectedProduct.ingredients}</p>
                          </>
                        )}
                        
                        {selectedProduct.usage_instructions && (
                          <>
                            <h6>Usage Instructions</h6>
                            <p className="small">{selectedProduct.usage_instructions}</p>
                          </>
                        )}
                        
                        {selectedProduct.warnings && (
                          <>
                            <h6 className="text-warning">Warnings</h6>
                            <p className="small text-warning">{selectedProduct.warnings}</p>
                          </>
                        )}
                      </Col>
                      <Col md={4}>
                        <Card className="bg-light">
                          <Card.Body>
                            <h6>Product Information</h6>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Category:</span>
                              <strong>{getCategoryDetails(selectedProduct.category).label}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Price:</span>
                              <strong className="text-success">${selectedProduct.price}</strong>
                            </div>
                            {selectedProduct.cost_price && (
                              <div className="d-flex justify-content-between mb-2">
                                <span>Cost Price:</span>
                                <strong>${selectedProduct.cost_price}</strong>
                              </div>
                            )}
                            <div className="d-flex justify-content-between mb-2">
                              <span>Stock:</span>
                              <strong>{selectedProduct.stock_quantity} units</strong>
                            </div>
                            {selectedProduct.sku && (
                              <div className="d-flex justify-content-between mb-2">
                                <span>SKU:</span>
                                <code>{selectedProduct.sku}</code>
                              </div>
                            )}
                            {selectedProduct.barcode && (
                              <div className="d-flex justify-content-between mb-2">
                                <span>Barcode:</span>
                                <code>{selectedProduct.barcode}</code>
                              </div>
                            )}
                            {selectedProduct.expiry_date && (
                              <div className="d-flex justify-content-between mb-2">
                                <span>Expiry Date:</span>
                                <strong>{new Date(selectedProduct.expiry_date).toLocaleDateString()}</strong>
                              </div>
                            )}
                            {selectedProduct.supplier && (
                              <div className="d-flex justify-content-between">
                                <span>Supplier:</span>
                                <strong>{selectedProduct.supplier}</strong>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab>
                
                <Tab eventKey="inventory" title="Inventory Management">
                  <div className="mt-3">
                    <h6>Stock Information</h6>
                    <Row>
                      <Col md={4}>
                        <Card className="text-center">
                          <Card.Body>
                            <h4 className="text-primary">{selectedProduct.stock_quantity}</h4>
                            <p className="mb-0">Current Stock</p>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="text-center">
                          <Card.Body>
                            <h4 className="text-warning">{selectedProduct.min_stock_level || 0}</h4>
                            <p className="mb-0">Min Level</p>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="text-center">
                          <Card.Body>
                            <h4 className="text-success">{selectedProduct.max_stock_level || 'No Limit'}</h4>
                            <p className="mb-0">Max Level</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    
                    <div className="mt-4">
                      <h6>Stock Status</h6>
                      <Badge bg={getStockStatus(selectedProduct).variant} className="p-2">
                        <i className={`fas ${getStockStatus(selectedProduct).icon} me-2`}></i>
                        {getStockStatus(selectedProduct).label}
                      </Badge>
                    </div>
                  </div>
                </Tab>
                
                <Tab eventKey="ai" title="AI Features">
                  <div className="mt-3">
                    <h6 className="d-flex align-items-center mb-3">
                      <FaBrain className="me-2 text-primary" />
                      AI-Enhanced Features
                    </h6>
                    {getCategoryDetails(selectedProduct.category).aiFeatures && (
                      <Row>
                        {getCategoryDetails(selectedProduct.category).aiFeatures.map((feature, index) => (
                          <Col md={6} key={index} className="mb-3">
                            <Card className="border-info">
                              <Card.Body>
                                <h6 className="text-info">{feature}</h6>
                                <p className="small text-muted mb-0">
                                  AI-powered analysis and recommendations for optimal product use
                                </p>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                    
                    <div className="mt-4">
                      <h6>AI Recommendations</h6>
                      <ListGroup>
                        <ListGroup.Item className="d-flex align-items-center">
                          <FaCheckCircle className="text-success me-2" />
                          Optimal for {selectedProduct.category} treatments
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex align-items-center">
                          <FaCheckCircle className="text-success me-2" />
                          Compatible with sensitive skin types
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex align-items-center">
                          <FaCheckCircle className="text-success me-2" />
                          Recommended reorder point: {Math.max(selectedProduct.min_stock_level * 2, 10)} units
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            ) : (
              // Create/Edit Form
              <Form onSubmit={handleSubmit}>
                <Tabs defaultActiveKey="basic" id="product-form-tabs">
                  <Tab eventKey="basic" title="Basic Information">
                    <div className="mt-3">
                      <Row>
                        <Col md={8}>
                          <Form.Group className="mb-3">
                            <Form.Label>Product Name *</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={productForm.name}
                              onChange={handleInputChange}
                              placeholder="e.g., Advanced Vitamin C Serum"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                              type="text"
                              name="brand"
                              value={productForm.brand}
                              onChange={handleInputChange}
                              placeholder="e.g., L'Oreal, Clinique"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Category *</Form.Label>
                        <Form.Select
                          name="category"
                          value={productForm.category}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select category...</option>
                          {Object.values(PRODUCT_CATEGORIES).map(category => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={productForm.description}
                          onChange={handleInputChange}
                          placeholder="Detailed description of the product, its benefits, and use cases..."
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Selling Price ($) *</Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              name="price"
                              value={productForm.price}
                              onChange={handleInputChange}
                              min="0"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Cost Price ($)</Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              name="cost_price"
                              value={productForm.cost_price}
                              onChange={handleInputChange}
                              min="0"
                            />
                            <Form.Text className="text-muted">
                              For profit margin calculation
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Check
                              type="checkbox"
                              name="is_active"
                              checked={productForm.is_active}
                              onChange={handleInputChange}
                              label="Product is active"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Check
                              type="checkbox"
                              name="is_professional_only"
                              checked={productForm.is_professional_only}
                              onChange={handleInputChange}
                              label="Professional use only"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="inventory" title="Inventory">
                    <div className="mt-3">
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>SKU</Form.Label>
                            <Form.Control
                              type="text"
                              name="sku"
                              value={productForm.sku}
                              onChange={handleInputChange}
                              placeholder="e.g., VCS-001"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Barcode</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <FaBarcode />
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
                                name="barcode"
                                value={productForm.barcode}
                                onChange={handleInputChange}
                                placeholder="Scan or enter barcode"
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Current Stock *</Form.Label>
                            <Form.Control
                              type="number"
                              name="stock_quantity"
                              value={productForm.stock_quantity}
                              onChange={handleInputChange}
                              min="0"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Stock Level</Form.Label>
                            <Form.Control
                              type="number"
                              name="min_stock_level"
                              value={productForm.min_stock_level}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Stock Level</Form.Label>
                            <Form.Control
                              type="number"
                              name="max_stock_level"
                              value={productForm.max_stock_level}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="expiry_date"
                              value={productForm.expiry_date}
                              onChange={handleInputChange}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Supplier</Form.Label>
                            <Form.Control
                              type="text"
                              name="supplier"
                              value={productForm.supplier}
                              onChange={handleInputChange}
                              placeholder="Supplier name or company"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="details" title="Product Details">
                    <div className="mt-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Ingredients</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="ingredients"
                          value={productForm.ingredients}
                          onChange={handleInputChange}
                          placeholder="List all ingredients, active compounds, etc."
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Usage Instructions</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="usage_instructions"
                          value={productForm.usage_instructions}
                          onChange={handleInputChange}
                          placeholder="How to use this product, application methods, frequency, etc."
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Warnings & Contraindications</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="warnings"
                          value={productForm.warnings}
                          onChange={handleInputChange}
                          placeholder="Safety warnings, contraindications, allergic reactions to watch for..."
                        />
                        <Form.Text className="text-muted">
                          Important safety information for staff and clients
                        </Form.Text>
                      </Form.Group>
                    </div>
                  </Tab>
                </Tabs>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              {modalType === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalType !== 'view' && (
              <Button variant="primary" onClick={handleSubmit}>
                {modalType === 'create' ? 'Create Product' : 'Update Product'}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </ProtectedRoute>
  );
};

export default CosmetologyProducts;
