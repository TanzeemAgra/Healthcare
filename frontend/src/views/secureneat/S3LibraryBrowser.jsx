import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { 
  RiBookOpenLine, 
  RiFolderLine, 
  RiSearchLine, 
  RiUploadLine,
  RiFileTextLine,
  RiDownloadLine,
  RiQuestionLine,
  RiTimeLine
} from 'react-icons/ri';

const S3LibraryBrowser = ({ onSelectBook, onGenerateMCQ, isGenerating }) => {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load books when category or search changes
  useEffect(() => {
    if (selectedCategory || searchTerm) {
      loadBooks();
    }
  }, [selectedCategory, selectedSubcategory, searchTerm]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/secureneat/library/categories/');
      setCategories(data.categories || data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
    setLoading(false);
  };

  const loadBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
      if (searchTerm) params.append('search', searchTerm);

      const { data } = await apiClient.get('/secureneat/library/books/', { params: Object.fromEntries(params) });
      setBooks(data.books || data || []);
    } catch (error) {
      console.error('Failed to load books:', error);
    }
    setLoading(false);
  };

  const handleGenerateMCQ = async (book, options) => {
    if (onGenerateMCQ) {
      await onGenerateMCQ({
        s3_key: book.key,
        filename: book.filename,
        ...options
      });
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'medical_books': '📚',
      'nursing_books': '👩‍⚕️',
      'research_papers': '🔬',
      'study_notes': '📝',
      'reference_materials': '📖',
      'exam_prep': '🎯',
      'clinical_guidelines': '⚕️',
      'medical_journals': '📰'
    };
    return iconMap[category] || '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="s3-library-browser">
      {/* Header with Search and Upload */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <RiBookOpenLine className="me-2" />
          Medical Library
        </h4>
        <button 
          className="btn btn-primary"
          onClick={() => setShowUploadModal(true)}
        >
          <RiUploadLine className="me-2" />
          Upload Book
        </button>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text">
              <RiSearchLine />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search books by title or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select"
            value={selectedCategory || ''}
            onChange={(e) => {
              setSelectedCategory(e.target.value || null);
              setSelectedSubcategory(null);
            }}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.key} value={category.key}>
                {getCategoryIcon(category.key)} {category.name} ({category.file_count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Categories Grid */}
      {!searchTerm && !selectedCategory && (
        <div className="row mb-4">
          {categories.map(category => (
            <div key={category.key} className="col-md-3 mb-3">
              <div 
                className="card h-100 category-card"
                onClick={() => setSelectedCategory(category.key)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body text-center">
                  <div className="fs-1 mb-2">{getCategoryIcon(category.key)}</div>
                  <h6 className="card-title">{category.name}</h6>
                  <p className="card-text text-muted">{category.file_count} books</p>
                  {category.subcategories.length > 0 && (
                    <small className="text-muted">
                      {category.subcategories.length} subcategories
                    </small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subcategories */}
      {selectedCategory && !searchTerm && (
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2">
            <button
              className={`btn btn-sm ${!selectedSubcategory ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedSubcategory(null)}
            >
              All
            </button>
            {categories
              .find(c => c.key === selectedCategory)?.subcategories
              .map(sub => (
                <button
                  key={sub}
                  className={`btn btn-sm ${selectedSubcategory === sub ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedSubcategory(sub)}
                >
                  <RiFolderLine className="me-1" />
                  {sub}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Books List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading books...</p>
        </div>
      ) : (
        <div className="row">
          {books.map(book => (
            <div key={book.key} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 book-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="file-type-icon">
                      {book.extension === '.pdf' ? '📕' : '📄'}
                    </div>
                    <span className="badge bg-info">{book.category.replace('_', ' ')}</span>
                  </div>
                  
                  <h6 className="card-title" title={book.filename}>
                    {book.filename.length > 40 
                      ? book.filename.substring(0, 40) + '...' 
                      : book.filename
                    }
                  </h6>
                  
                  <div className="book-metadata mb-3">
                    <small className="text-muted d-block">
                      <RiFileTextLine className="me-1" />
                      {formatFileSize(book.size)}
                    </small>
                    <small className="text-muted d-block">
                      <RiTimeLine className="me-1" />
                      {new Date(book.last_modified).toLocaleDateString()}
                    </small>
                    {book.subcategory && (
                      <small className="text-muted d-block">
                        <RiFolderLine className="me-1" />
                        {book.subcategory}
                      </small>
                    )}
                  </div>
                </div>
                
                <div className="card-footer bg-transparent">
                  <div className="btn-group w-100" role="group">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => window.open(book.download_url, '_blank')}
                      title="Download"
                    >
                      <RiDownloadLine />
                    </button>
                    <button
                      className="btn btn-primary btn-sm flex-grow-1"
                      onClick={() => handleGenerateMCQ(book, {
                        num_questions: 10,
                        generation_type: 'full_book_wise'
                      })}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <RiQuestionLine className="me-1" />
                          Generate MCQs
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Quick MCQ Options */}
                  <div className="btn-group w-100 mt-2" role="group">
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => handleGenerateMCQ(book, {
                        num_questions: 5,
                        generation_type: 'chapter_wise'
                      })}
                      disabled={isGenerating}
                      title="5 Questions - Chapter wise"
                    >
                      5Q
                    </button>
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => handleGenerateMCQ(book, {
                        num_questions: 10,
                        generation_type: 'full_book_wise'
                      })}
                      disabled={isGenerating}
                      title="10 Questions - Full book"
                    >
                      10Q
                    </button>
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => handleGenerateMCQ(book, {
                        num_questions: 20,
                        generation_type: 'full_book_wise'
                      })}
                      disabled={isGenerating}
                      title="20 Questions - Full book"
                    >
                      20Q
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {books.length === 0 && !loading && (
        <div className="text-center py-5">
          <RiBookOpenLine size={64} className="text-muted mb-3" />
          <h5 className="text-muted">No books found</h5>
          <p className="text-muted">
            {searchTerm 
              ? `No books found matching "${searchTerm}"`
              : selectedCategory 
                ? 'No books in this category yet'
                : 'Upload some books to get started'
            }
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadBookModal 
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={() => {
            setShowUploadModal(false);
            loadBooks();
            loadCategories();
          }}
          categories={categories}
        />
      )}

      <style jsx>{`
        .category-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }
        
        .book-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }
        
        .file-type-icon {
          font-size: 1.5rem;
        }
        
        .book-metadata {
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};

// Upload Book Modal Component
const UploadBookModal = ({ onClose, onUploadSuccess, categories }) => {
  const [formData, setFormData] = useState({
    file: null,
    title: '',
    category: 'medical_books',
    subcategory: '',
    author: '',
    description: '',
    tags: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', formData.file);
      uploadData.append('title', formData.title);
      uploadData.append('category', formData.category);
      uploadData.append('subcategory', formData.subcategory);
      uploadData.append('author', formData.author);
      uploadData.append('description', formData.description);
      uploadData.append('tags', formData.tags);

      const response = await apiClient.post('/secureneat/library/upload/', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response && response.status >= 200 && response.status < 300) {
        onUploadSuccess();
      } else {
        const error = response?.data || {};
        alert(`Upload failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.response?.data?.error || error.message}`);
    }
    setUploading(false);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <RiUploadLine className="me-2" />
              Upload Book to Library
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">File *</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={(e) => setFormData({
                    ...formData,
                    file: e.target.files[0],
                    title: formData.title || (e.target.files[0] ? e.target.files[0].name.split('.')[0] : '')
                  })}
                  required
                />
              </div>
              
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Book title (auto-filled from filename)"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option key={cat.key} value={cat.key}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Subcategory</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                      placeholder="e.g., Cardiology, Neurology"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Author</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      placeholder="Author name"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the book content"
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Tags</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="cardiology, emergency, surgery (comma-separated)"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={uploading || !formData.file}
              >
                {uploading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <RiUploadLine className="me-2" />
                    Upload Book
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default S3LibraryBrowser;
