import React, { useState, useRef } from 'react';
import { Button, Row, Col, Alert, Popover, ButtonToolbar, Overlay } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Link } from 'react-router-dom';


export default function DataList(props) {
    const { t } = useTranslation();
    const [state, setState] = useState({
        deleteMsg: false
    });
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    // handles delete button click
    const handleDeleteBtnClick = event => {
        setState({ ...state, deleteMsg: true });
        setTarget(event.target);
    }
    // in popover -> no response
    const handleNoResponse = () => {
        setState({ ...state, deleteMsg: false });
    }

    // containing list of elements to diplay
    // e.g. list of substances
    const data = props.data;

    const createButton = (
        <div 
            className="text-right mb-4"
        >
            <Link to={props.createBtnLink}>
                <Button variant="danger">
                    { t('create-new') }
                </Button>
            </Link>
        </div>
    )
    

    if (data.length === 0) {
        return (
            <div>
                <div>{ createButton }</div>
                <Alert
                    variant="warning"
                >
                    {t('messages.no-data-for-this-page')}
                </Alert>
            </div>
        )
    }




    /*
        *Handles API requests
        open | delete
    */
    const handleDelete = id => {
        axios.delete(
            props.api + id + '/',
            {headers: {
                Pragma: "no-cache",
                Authorization: 'Bearer ' + localStorage.getItem('token-access')
            }}
        ).then(
            () => console.log("deleted")
        ).catch(
            e => console.log(e)
        )
    }

    return (
        <div>
            <div>{ createButton }</div>
            {
                data.map(
                    item => (
                        <div className="p-2 bg-light text-muted shadow-sm my-2">
                            <div className="w-100 border-bottom pb-3" style={{ height: 35 }}>
                                <span className="font-weight-bold float-left pt-1">
                                    { item.title }
                                </span>
                                <span className="float-right">

                                    <ButtonToolbar ref={ref}>
                                        <Button
                                            variant="outline-dark"
                                            size="sm"
                                            className="mx-1 border-0"
                                            onClick={handleDeleteBtnClick}
                                        >
                                            <FontAwesomeIcon icon="trash-alt" />
                                        </Button>

                                        <Overlay
                                            container={ref.current}
                                            placement="left"
                                            show={state.deleteMsg}
                                            target={target}
                                            containerPadding={20}
                                        >
                                            <Popover style={{ width: 250 }}>
                                                <Popover.Title as="h3">
                                                    { t('messages.are-you-sure') }
                                                </Popover.Title>
                                                <Popover.Content>
                                                        <p>{props.delMsg}</p>
                                                        <Button variant="dark" size="sm" onClick={handleNoResponse}>
                                                            { t('no') }
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDelete(item.id)}
                                                            variant="danger"
                                                            size="sm" className="ml-2"
                                                        >
                                                            { t('yes') }
                                                        </Button>
                                                </Popover.Content>
                                            </Popover>
                                        </Overlay>

                                        <Button variant="outline-danger" size="sm" className="border-0 font-weight-bold">
                                            { t('open') }
                                        </Button>
                                    </ButtonToolbar>
                                </span>
                            </div>

                            <Row className="mt-3">
                                {
                                    item.data.map(
                                        (e, inx) => (
                                            <Col key={inx} md={{ span: 4 }} className="mt-2">
                                                { e.label }: <span className="text-dark">{e.value}</span>
                                            </Col>
                                        )
                                    )
                                }
                            </Row>
                        </div>
                    )
                )
            }
    </div>)  
}