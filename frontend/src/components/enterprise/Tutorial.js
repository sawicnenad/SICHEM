import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';



/*
    Tutorial for SICHEM
*/
export default function Tutorial(props) {

    const { t } = useTranslation();
    const [ page, setPage ] = useState(0); // sets tutorial page that is shown (see below)

    // what is shown in the modal depends on the page state
    const tutorialPages = [
        {
            title: t('tutorial.page-1-title'),
            text: t('tutorial.page-1-text')
        }, {
            title: t('tutorial.page-2-title'),
            text: t('tutorial.page-2-text')
        }, {
            title: t('tutorial.page-3-title'),
            text: t('tutorial.page-3-text')
        }, {
            title: t('tutorial.page-4-title'),
            text: t('tutorial.page-4-text')
        }
    ]

    return(
        <Modal
            show={props.show}
            onHide={props.onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    { t('tutorial.modal-title') }
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div>
                    <h5>
                        { tutorialPages[page].title }
                    </h5>
                    <p>
                        { tutorialPages[page].text }
                    </p>
                </div>
            </Modal.Body>

            <Modal.Footer>
                {
                    tutorialPages.map(
                        (tut, inx) => (
                            <Button 
                                variant={ inx === page ? "outline-danger" : "outline-secondary" }
                                onClick={ () => setPage(inx) }
                            >
                                { inx + 1 }
                            </Button>
                        )
                    )
                }
            </Modal.Footer>
        </Modal>
    )
}