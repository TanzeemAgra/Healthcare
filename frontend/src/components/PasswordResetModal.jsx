import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PasswordChangeForm from './PasswordChangeForm';
import { Key, Shield, Lock } from 'lucide-react';

const PasswordResetModal = ({ show, onHide, userEmail, onSuccess }) => {
    const [isChanging, setIsChanging] = useState(false);

    const handlePasswordChangeSuccess = (result) => {
        setIsChanging(false);
        onSuccess(result);
        onHide();
    };

    const handlePasswordChangeCancel = () => {
        setIsChanging(false);
    };

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            size="lg" 
            centered
            backdrop="static"
            className="password-reset-modal"
        >
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title className="d-flex align-items-center">
                    <Shield className="me-2" size={24} />
                    Change Your Password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '500px' }}>
                    <PasswordChangeForm
                        userEmail={userEmail}
                        onSuccess={handlePasswordChangeSuccess}
                        onCancel={handlePasswordChangeCancel}
                        showCancelButton={false}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className="bg-light">
                <Button variant="secondary" onClick={onHide}>
                    <Lock className="me-2" size={16} />
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PasswordResetModal;
