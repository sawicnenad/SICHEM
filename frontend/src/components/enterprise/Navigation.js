import React from 'react';
import {
    Row,
    Col,
    Icon,
    Input
} from 'antd';


const styling = {
    icon: {
        fontSize: 22,
        display: "inline-block",
        padding: 10,
        background: "#262626",
        height: "50px",
        float: "left"
    }, 
    inputDiv: {
        width: 350,
        display: "inline-block",
        marginLeft: 20,
        float: "left",
        paddingTop: 10
    },
    input: {
        background: "#262626",
        color: "white"
    }
}


function Navigation() {
    return (
        <div className="navigation">
            <Row type="flex" justify="space-between" className="navigation-row">
                <Col>
                    <div style={{ marginTop: 0 }}>
                        <div style={styling.icon} className="cursor-on-hover">
                            <Icon type="home" />
                        </div>
                        <div style={styling.inputDiv}>
                            <Input style={ styling.input } />
                        </div>
                    </div>
                </Col>
                <Col>
                    <div style={ styling.icon } className="cursor-on-hover">
                        <Icon type="menu" />
                    </div>
                </Col>
            </Row>
        </div>
    )
}
export default Navigation;