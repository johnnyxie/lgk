import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from '../login/Login';
import DashboardViewer from './DashboardViewer';
import AppBar from './AppBar';
import GridStack from '../gridstack/GridStack';
import GridStackItem from '../gridstack/GridStackItem';
import Welcome from '../../Welcome';
import PersonGrid from '../../PersonGrid';
import {
    Container,
    Panel
} from '@extjs/reactor/modern';

class Main extends Component {

    constructor() {
        super();
    }

    render() {
        const { loggedIn, user, selectedModule } = this.props;

        if (loggedIn) {
            return (
                <Container layout="fit" fullscreen>
                    <AppBar/>
                    <Panel layout="card" activeItem={selectedModule}>
                        <DashboardViewer />
                    </Panel>
                </Container>
            )
        } else {
            return (
                <Login />
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {...state.login, ...state.main};
}

export default connect(mapStateToProps, null, null, {withRef: true})(Main);