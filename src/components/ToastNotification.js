// src/components/ToastNotification.js
import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastNotification = ({ show, onClose, message, type }) => {
    return (
        <ToastContainer position="bottom-end" style={{ zIndex: 1050 }}>
            <Toast show={show} onClose={onClose} bg={type} delay={3000} autohide>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default ToastNotification;
