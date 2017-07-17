import React, { Component } from 'react';
import {
    Container,
    Panel,
    FormPanel,
    TextField,
    Combobox,
    Button,
    Toolbar
} from '@extjs/reactor/modern';
import { connect } from 'react-redux';
import { loginClick } from './actions';

Ext.require('Ext.layout.Center');

class Login extends Component {

    constructor() {
        super()
    }

    onClickLogin() {
        if (this.username && this.password) {
            let username = this.username.getValue();
            let password = this.password.getValue();
            let data = {username, password};
            this.props.dispatch(loginClick(data));
        }
    }

    render() {
        return (
            <Container
                padding="10"
                platformConfig={{
                    phone: {
                        layout: 'fit'
                    },
                    "!phone": {
                        layout: 'center'
                    }
                }}
            >
                <FormPanel
                    ref={form => this.form = form}
                    shadow 
                    padding="20"
                    platformConfig={{
                        "!phone": {
                            maxHeight: 500,
                            width: 350
                        }
                    }}
                >
                    <TextField ref={(tf) => {this.username = tf;}} label="Username" required allowBlank={false} enableKeyEvents />
                    <TextField ref={(tf) => {this.password = tf;}} label="Password" required cls="password" inputType="password" allowBlank={false} enableKeyEvents />
                    <Toolbar docked="bottom" layout={{ type: 'hbox', pack: 'right'}}>
                        <Button text="Login" handler={() => this.onClickLogin()} /> 
                    </Toolbar>
                </FormPanel>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {...state};
}

export default connect(mapStateToProps, null, null, {withRef: true})(Login);