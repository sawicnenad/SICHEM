import React from 'react';
import { Toast } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


export default function RequestNotification(props) {
    const { t } = useTranslation();

    const msgFailed = (
        <span className="text-danger">
            { props.msgFailed ? props.msgFailed : t('messages.request.failed') }
        </span>
    )
    const msgSuccess = (
        <span className="text-success">
            { props.msgSuccess ? props.msgSuccess : t('messages.request.success') }
        </span>
    )

    const iconFailed = (
        <img
            src={require('../../media/icons/alert-circle-fill.svg')}
            className="rounded mr-2"
            alt=""
        />);

    const iconSuccess = (
        <img
            src={require('../../media/icons/check-circle.svg')}
            className="rounded mr-2"
            alt=""
        />);

    return(
        <Toast
            autohide
            delay={3000}
            onClose={props.onClose}
            show={props.show} 
            style={{ 
                position: "fixed",
                top: 0,
                right: 0,
                margin: "1%",
                width: 300
            }}
        >
            <Toast.Header>
                { props.success ? iconSuccess : iconFailed }

                <strong className="mr-auto">
                    { props.success ? msgSuccess : msgFailed }
                </strong>
            </Toast.Header>

            {
                props.text ?
                <Toast.Body className="text-muted">
                    { props.text }
                </Toast.Body>
                : ""
            }
        </Toast>
    )
}