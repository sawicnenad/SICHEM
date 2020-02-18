import React from 'react';
import axios from 'axios';
import { ApiRequestsContext } from '../contexts/ApiRequestsContext';
import Login from '../views/Login';


// 1. VERIFY TOKEN
// 2. REFRESH TOKEN
function withAuth(WrappedComponent) {
    return class extends React.Component {

        constructor(props) {
            super(props);
            this.state = {isAuth: false};
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
                () => this.setState({ isAuth: true })
            ).catch(
                e => {
                    console.log(e);
                    this.setState({ isAuth: false })

                    // refresh token
                    const tokenRefresh = localStorage.getItem('token-refresh');
                    axios.post(
                        `${ this.context.API }/token-refresh/`,
                        { refresh: tokenRefresh }
                    ).then(
                        res => {
                            localStorage.setItem('token-access', res.data.access);
                            this.setState({ isAuth: true })
                        }
                    ).catch(
                        () => this.setState({ isAuth: false })
                    )
                }
            )
        }
        
        render() {
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