import React, { Component } from 'react';
import {
    TabPanel,
    TabBar
} from '@extjs/reactor/modern';
import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import { selectDashboard } from './actions';
import Script from 'react-load-script';

class DashboardViewer extends Component {

    constructor() {
        super();
    }

    state = {
        activeItem: 0
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedDashboard !== this.props.selectedDashboard) {
            this.setState({
                activeItem: nextProps.selectedDashboard
            })
        }
    }

    render() {
        return (
            <TabPanel
                tabBar={{
                    shadow: true, 
                    docked: 'bottom', 
                    height: 45
                }}
                style={{ zIndex: 100 }}
                ui="dashboard-tabpanel"
                defaults={{scrollable: true}}
                activeItem={this.state.activeItem}
                onActiveItemchange={(sender, value, oldValue) => this.activeItemchange(sender, value, oldValue)}
            >
                { this.createViewer() }
            </TabPanel>
        );
    }

    activeItemchange(sender, value, oldValue) {
        const { title } = this.props;
        this.props.dispatch(selectDashboard(title, value.getTitle()));
    }

    createViewer() {
        const { dashboards } = this.props;
        return dashboards.map((item, index) => {
            return (
                <Dashboard key={item.title} index={index} />
            );
        })
    }
}

const mapStateToProps = (state) => {
    let module = {};
    for (let i=0; i<state.main.modules.length; i++) {
        let item = state.main.modules[i];
        if (item.title == "Dashboards") {
            module = item; 
        }
    }

    return {...module};
}

export default connect(mapStateToProps, null, null, {withRef: true})(DashboardViewer);