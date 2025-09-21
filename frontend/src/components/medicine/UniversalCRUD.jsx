import React, { useState, useEffect } from 'react';
import { MEDICINE_SECTIONS, DATA_CONFIG, UI_CONFIG, API_ENDPOINTS } from '../../config/advancedMedicineConfig';

const UniversalCRUD = ({ 
  sectionKey, 
  data: initialData = [], 
  columns = [], 
  onDataChange = () => {},
  customActions = [],
  enableSearch = true,
  enablePagination = true,
  enableSorting = true,
  enableFiltering = true 
}) => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DATA_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE);
  const [sortField, setSortField] = useState(DATA_CONFIG.SORTING.DEFAULT_SORT);
  const [sortOrder, setSortOrder] = useState(DATA_CONFIG.SORTING.DEFAULT_ORDER);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view, delete
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const section = MEDICINE_SECTIONS[sectionKey];

  // Initialize data
  useEffect(() => {
    setData(initialData);
    setFilteredData(initialData);
  }, [initialData]);

  // Handle search and filtering
  useEffect(() => {
    let filtered = [...data];

    // Apply search
    if (searchTerm && enableSearch) {
      filtered = filtered.filter(item =>
        DATA_CONFIG.SEARCH.SEARCH_FIELDS.some(field =>
          item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    if (enableFiltering) {
      Object.entries(filters).forEach(([field, value]) => {
        if (value) {
          filtered = filtered.filter(item => 
            item[field]?.toString().toLowerCase().includes(value.toLowerCase())
          );
        }
      });
    }

    // Apply sorting
    if (enableSorting && sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const modifier = sortOrder === 'desc' ? -1 : 1;
        
        if (aVal < bVal) return -1 * modifier;
        if (aVal > bVal) return 1 * modifier;
        return 0;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [data, searchTerm, filters, sortField, sortOrder, enableSearch, enableFiltering, enableSorting]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = enablePagination 
    ? filteredData.slice(startIndex, startIndex + pageSize)
    : filteredData;

  // Event handlers
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setModalType('create');
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalType('edit');
    setShowModal(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setModalType('view');
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setModalType('delete');
    setShowModal(true);
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} on:`, selectedItems);
    // Implement bulk actions
  };

  const handleSave = (formData) => {
    setLoading(true);
    
    if (modalType === 'create') {
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const newData = [...data, newItem];
      setData(newData);
      onDataChange(newData);
    } else if (modalType === 'edit') {
      const updatedData = data.map(item =>
        item.id === selectedItem.id
          ? { ...item, ...formData, updated_at: new Date().toISOString() }
          : item
      );
      setData(updatedData);
      onDataChange(updatedData);
    }
    
    setLoading(false);
    setShowModal(false);
  };

  const handleDeleteConfirm = () => {
    const updatedData = data.filter(item => item.id !== selectedItem.id);
    setData(updatedData);
    onDataChange(updatedData);
    setShowModal(false);
  };

  const renderTableHeader = () => (
    <thead className="table-dark">
      <tr>
        <th>
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedItems(paginatedData.map(item => item.id));
              } else {
                setSelectedItems([]);
              }
            }}
            checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
          />
        </th>
        {columns.map(column => (
          <th 
            key={column.key}
            onClick={() => column.sortable && handleSort(column.key)}
            style={{ cursor: column.sortable ? 'pointer' : 'default' }}
          >
            {column.label}
            {column.sortable && sortField === column.key && (
              <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-line ms-1`}></i>
            )}
          </th>
        ))}
        <th>Actions</th>
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
      {paginatedData.map(item => (
        <tr key={item.id}>
          <td>
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItems([...selectedItems, item.id]);
                } else {
                  setSelectedItems(selectedItems.filter(id => id !== item.id));
                }
              }}
            />
          </td>
          {columns.map(column => (
            <td key={column.key}>
              {column.render ? column.render(item[column.key], item) : item[column.key]}
            </td>
          ))}
          <td>
            <div className="btn-group btn-group-sm">
              <button 
                className="btn btn-outline-primary"
                onClick={() => handleView(item)}
                title="View"
              >
                <i className="ri-eye-line"></i>
              </button>
              <button 
                className="btn btn-outline-success"
                onClick={() => handleEdit(item)}
                title="Edit"
              >
                <i className="ri-edit-line"></i>
              </button>
              <button 
                className="btn btn-outline-danger"
                onClick={() => handleDelete(item)}
                title="Delete"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  const renderSearchAndFilters = () => (
    <div className="row mb-3">
      {enableSearch && (
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="ri-search-line"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
      
      <div className="col-md-6 text-end">
        <div className="btn-group">
          <button 
            className={`btn btn-${section?.color || 'primary'}`}
            onClick={handleCreate}
          >
            <i className="ri-add-line me-1"></i>
            Add New
          </button>
          
          {selectedItems.length > 0 && (
            <div className="btn-group">
              <button 
                className="btn btn-outline-secondary dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                Bulk Actions ({selectedItems.length})
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button 
                    className="dropdown-item"
                    onClick={() => handleBulkAction('delete')}
                  >
                    <i className="ri-delete-bin-line me-1"></i>
                    Delete Selected
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item"
                    onClick={() => handleBulkAction('export')}
                  >
                    <i className="ri-download-line me-1"></i>
                    Export Selected
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPagination = () => {
    if (!enablePagination || totalPages <= 1) return null;

    return (
      <div className="row align-items-center">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <span className="me-2">Show:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {DATA_CONFIG.PAGINATION.PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="ms-2">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length} entries
            </span>
          </div>
        </div>
        
        <div className="col-md-6">
          <nav>
            <ul className="pagination pagination-sm justify-content-end mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  );
                }
                return null;
              })}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {modalType === 'create' && `Add New ${section?.label}`}
                {modalType === 'edit' && `Edit ${section?.label}`}
                {modalType === 'view' && `View ${section?.label}`}
                {modalType === 'delete' && `Delete ${section?.label}`}
              </h5>
              <button 
                type="button" 
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            
            <div className="modal-body">
              {modalType === 'delete' ? (
                <div className="text-center">
                  <i className="ri-delete-bin-line text-danger" style={{ fontSize: '3rem' }}></i>
                  <h4 className="mt-3">Are you sure?</h4>
                  <p>This action cannot be undone. This will permanently delete the selected item.</p>
                </div>
              ) : (
                <CRUDForm
                  data={selectedItem}
                  columns={columns}
                  readOnly={modalType === 'view'}
                  onSave={handleSave}
                  loading={loading}
                />
              )}
            </div>
            
            {modalType === 'delete' && (
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="universal-crud">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-0">
                <i className={`${section?.icon} me-2`}></i>
                {section?.label || 'Data Management'}
              </h5>
              {section?.description && (
                <small className="text-muted">{section.description}</small>
              )}
            </div>
            <div className="badge bg-secondary">
              {filteredData.length} items
            </div>
          </div>
        </div>
        
        <div className="card-body">
          {renderSearchAndFilters()}
          
          <div className="table-responsive">
            <table className="table table-hover">
              {renderTableHeader()}
              {renderTableBody()}
            </table>
          </div>
          
          {paginatedData.length === 0 && (
            <div className="text-center py-4">
              <i className="ri-inbox-line" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <p className="text-muted mt-2">No data available</p>
            </div>
          )}
          
          {renderPagination()}
        </div>
      </div>
      
      {renderModal()}
    </div>
  );
};

// Form component for CRUD operations
const CRUDForm = ({ data, columns, readOnly, onSave, loading }) => {
  const [formData, setFormData] = useState(data || {});

  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {columns.filter(col => col.editable !== false).map(column => (
          <div key={column.key} className={`col-md-${column.width || 6} mb-3`}>
            <label className="form-label">{column.label}</label>
            {column.type === 'textarea' ? (
              <textarea
                className="form-control"
                value={formData[column.key] || ''}
                onChange={(e) => handleChange(column.key, e.target.value)}
                disabled={readOnly}
                rows={3}
              />
            ) : column.type === 'select' ? (
              <select
                className="form-select"
                value={formData[column.key] || ''}
                onChange={(e) => handleChange(column.key, e.target.value)}
                disabled={readOnly}
              >
                <option value="">Select...</option>
                {column.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={column.type || 'text'}
                className="form-control"
                value={formData[column.key] || ''}
                onChange={(e) => handleChange(column.key, e.target.value)}
                disabled={readOnly}
              />
            )}
          </div>
        ))}
      </div>
      
      {!readOnly && (
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => window.modalClose?.()}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </form>
  );
};

export default UniversalCRUD;
