import React from 'react';
import { connect } from 'react-redux';
import { logIn } from '../../../actions';
import { tryRegister } from '../../../controllers/BobbaProxy';

const initialState = {
    username: '',
    email: '',
    password: '',
    password2: '',
    accept: '',
    wrongUsername: false,
    wrongEmail: false,
    wrongPassword: false,
    wrongPassword2: false,
    wrongAccept: false,
    errorMessage: '',
};

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    handleInputChange = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = event => {
        event.preventDefault();

        const { dispatch } = this.props;

        const wrongUsername = this.state.username === '';
        const wrongEmail = this.state.email === '';
        const wrongPassword = this.state.password === '';
        const wrongPassword2 = wrongPassword || this.state.password !== this.state.password2;
        const wrongAccept = this.state.accept !== true;

        let errorMessage = '';

        if (wrongAccept) {
            errorMessage = 'You must agree to terms and conditions'
        }

        if (wrongPassword2) {
            errorMessage = 'Passwords do not match';
        }

        if (wrongUsername || wrongEmail || wrongPassword) {
            errorMessage = 'Please complete all fields';
        }

        if (errorMessage === '') {
            tryRegister(this.state.username, this.state.email, this.state.password)
                .then(response => {
                    if (response.token != null) {
                        dispatch(logIn(response.token));
                    } else {
                        if (response.error != null) {
                            if (response.error === 'username') {
                                this.setState({
                                    errorMessage: 'The username is already occupied',
                                    wrongUsername: true,
                                });
                            } else if (response.error === 'email') {
                                this.setState({
                                    errorMessage: 'That email is already registered',
                                    wrongEmail: true,
                                });
                            }
                        } else {
                            this.setState({
                                errorMessage: 'Error when registering'
                            });
                        }
                    }
                }).catch(err => {
                    this.setState({
                        errorMessage: 'Error when contacting the server'
                    });
                });
        } else {
            this.setState({
                wrongUsername, wrongEmail, wrongPassword, wrongPassword2, errorMessage
            });
        }
    }

    getErrorSection(errorMessage) {
        return (
            <h1>
                {errorMessage}
            </h1>
        );
    }

    render() {

        const { username, password, password2, email, accept, wrongUsername, wrongEmail, wrongPassword, wrongPassword2, wrongAccept, errorMessage } = this.state;

        let usernameClassName = wrongUsername ? 'wrong' : '';
        let passwordClassName = wrongPassword ? 'wrong' : '';
        let password2ClassName = wrongPassword2 ? 'wrong' : '';
        let emailClassName = wrongEmail ? 'wrong' : '';
        let acceptClassName = wrongAccept ? 'wrong' : '';

        let errorContainer = null;
        if (errorMessage !== '') {
            errorContainer = this.getErrorSection(errorMessage);
        }

        return (
            <>
                <h1 className="green">Record</h1>
                {errorContainer}
                <form onSubmit={this.handleSubmit}>
                    <div className="input_group">
                        <label htmlFor="username">Username: </label>
                        <input id="username" name="username" type="text" aria-label="Username" placeholder="User"
                            onChange={this.handleInputChange} value={username} className={usernameClassName} />
                        <p>From 3 to 14 character. Letters, numbers y character as (. , ; : - @).</p>
                    </div>
                    <div className="input_group">
                        <label htmlFor="email">Email: </label>
                        <input id="email" name="email" type="email" aria-label="Email"
                            placeholder="correo@correo.com" onChange={this.handleInputChange} value={email} className={emailClassName} />
                        <p>To be in contact in case of problems!</p>
                    </div>
                    <div className="input_group">
                        <label htmlFor="password">Password: </label>
                        <input id="password" name="password" type="password" aria-label="Password" placeholder="******"
                            onChange={this.handleInputChange} value={password} className={passwordClassName} />
                        <p>They are recommended upper, lowercase and numbers at the same time.</p>
                    </div>
                    <div className="input_group">
                        <label htmlFor="password2">Repeat password: </label>
                        <input id="password2" name="password2" type="password" aria-label="Repeat password"
                            placeholder="******" onChange={this.handleInputChange} value={password2} className={password2ClassName} />
                        <p>Por seguridad.</p>
                    </div>

                    <div className="input_group">
                        <input id="accept" name="accept" type="checkbox"
                            onChange={this.handleInputChange} checked={accept} className={acceptClassName} />
                        <label htmlFor="accept">I accept the terms and conditions</label>
                    </div>
                    <div className="input_group">
                        <input type="submit" value="To enter" aria-label="To enter" />
                    </div>
                </form>
            </>
        );
    }
}

export default connect()(Register);