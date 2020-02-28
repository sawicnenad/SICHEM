import React, { useState, useRef, useContext } from 'react';
import { Button, Row, Col, Alert, Popover, ButtonToolbar, Overlay } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';


export default function DataList(props) {
    const { t } = useTranslation();
    const [state, setState] = useState({
        deleteMsg: false
    });
    const entContext = useContext(EnterpriseContext);
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

    if (data.length === 0) {
        return (
            <div>
                <div>{ props.createButton }</div>
                <Alert
                    className="mt-3"
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
            () => {
                let name = props.name;
                let data = entContext[name];
                data = data.filter(o => o.id !== id);
                entContext.refreshState(name, data);
            }
        ).catch(
            e => console.log(e)
        )
    }

    return (
        <div>
            <div>{ props.createButton }</div>
            {
                data.map(
                    (item, inx) => (
                        <div className="p-2 bg-light text-muted shadow-sm my-3" key={inx}>
                            <div className="w-100 border-bottom pb-3" style={{ height: 35 }}>
                                <span className="font-weight-bold float-left pt-1">
                                    { item.title }
                                </span>
                                <span className="float-right">

                                    <ButtonToolbar ref={ref}>
                                        <Button
                                            variant="light"
                                            size="sm"
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
                                                        <Button variant="secondary" size="sm" onClick={handleNoResponse}>
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

                                        <Link to={`${props.link}${item.id}`}>
                                            <Button
                                                variant="light"
                                                size="sm"
                                            >
                                                { t('open') }
                                            </Button>
                                        </Link>
                                    </ButtonToolbar>
                                </span>
                            </div>

                            <Row className="mt-3">
                                {
                                    item.data.map(
                                        (e, inx) => (
                                            <Col key={inx} md={{ span: 6 }} className="mt-2">
                                                <span className="text-dark">
                                                    { e.label }
                                                </span>: <span 
                                                    className="text-muted">
                                                        {e.value}
                                                    </span>
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