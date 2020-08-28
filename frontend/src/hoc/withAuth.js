import React from 'react';
import axios from 'axios';
import { ApiRequestsContext } from '../contexts/ApiRequestsContext';
import Login from '../views/Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// 1. VERIFY TOKEN
// 2. REFRESH TOKEN
function withAuth(WrappedComponent) {

    return class extends React.Component {

        constructor(props) {
            super(props);
            this.state = {isAuth: false, loading: true};
        }

        // get API URL
        static contextType = ApiRequestsContext;

        componentWillMount() {
            // verify token
            const token = localStorage.getItem('token-access');
            axios.post(
                `${ this.context.API }/token-verify/`,
                { token: token }
            ).then(
                () => this.setState({ isAuth: true, loading: false })
            ).catch(
                () => {
                    // refresh token
                    const tokenRefresh = localStorage.getItem('token-refresh');
                    axios.post(
                        `${ this.context.API }/token-refresh/`,
                        { refresh: tokenRefresh }
                    ).then(
                        res => {
                            localStorage.setItem('token-access', res.data.access);
                            this.setState({ isAuth: true, loading: false })
                        }
                    ).catch(
                        () => this.setState({ isAuth: false, loading: false })
                    )
                }
            )
        }

        
        render() {
            // if waiting for response
            if (this.state.loading) {
                return(
                    <div
                        className="text-center text-danger"
                        style={{ marginTop: 150, fontSize: 35 }}
                    >
                        <FontAwesomeIcon icon="spinner" className="fa-pulse" />
                    </div>
                )
            }


            // if no valid token -> login page
            return (
                this.state.isAuth ? 
                    <WrappedComponent { ...this.props }/>
                    : <Login />
            )
        }
    }
}
export default withAuth;