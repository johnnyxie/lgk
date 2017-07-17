import React, { Component } from 'react';
import {
    Container,
    Button,
    Menu,
    MenuItem,
    MenuSeparator,
    Spacer,
    TitleBar
} from '@extjs/reactor/modern';
import { connect } from 'react-redux';
import { selectModule, addWidget, renameDashboard, addDashboard, selectDashboard } from './actions';

// include all plugins
require('../../plugins/index');

Ext.require("Ext.MessageBox");

class AppBar extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <TitleBar
                height={60}
                ui="main-titlebar"
                docked="top"
                titleAlign="left"
                shadow
                style={{ zIndex: 100 }}
            >
                <Container cls="pan-logo" width={45} />
                <Container cls="pan-header-title" height={40} width={300} html="LGK League" />
                <Container height={40} width={50} cls="pan-header-spacer" />
                {this.createSelectedDashboard()}
                <Button align="right" iconCls={['x-fa', 'fa-search']} />
                <Button align="right" iconCls={['x-fa', 'fa-cog']} />
                <Button align="right" iconCls={['x-fa', 'fa-question-circle-o']} />
                {this.createUserSetting()}
                <Spacer align="right" width={20} />
                {this.createWidgetList()}
            </TitleBar>
        );
    }

    createUserSetting() {
        const { modules, selectedModule, user } = this.props;
        let module = modules[selectedModule];
        let dashboard = module.dashboards[module.selectedDashboard];
        return (
            <Button text={user.name} align="right" iconCls={['x-fa', 'fa-user']}>
                <Menu rel="menu" >
                    <MenuItem text="Account Info" name="account" iconCls={['x-fa', 'fa-address-book-o']} />
                    <MenuItem text="Notification" name="notification" iconCls={['x-fa', 'fa-bell-o']} />
                    <MenuItem text="Tasks" name="task" iconCls={['x-fa', 'fa-tasks']} />
                    <MenuSeparator />
                    <MenuItem text="Sign Out" name="signout" iconCls={['x-fa', 'fa-sign-out']} />
                </Menu>
            </Button>
        );
    }

    dashboardAdd(module) {
        Ext.Msg.prompt('New', 'What\'s the new dashboard name?', (btn, value) => {
            if (btn == 'ok') {
                this.props.dispatch(addDashboard(module.title, value));
                this.props.dispatch(selectDashboard(module.title, value));
            }
        });
    }

    dashboardRename(module) {
        Ext.Msg.prompt('Rename', 'What\'s the dashboard name?', (btn, value) => {
            if (btn == 'ok') {
                let dashboard = module.dashboards[module.selectedDashboard];
                this.props.dispatch(renameDashboard(module.title, dashboard.title, value));
            }
        });
    }

    createSelectedDashboard() {
        const { modules, selectedModule } = this.props;
        let module = modules[selectedModule];
        let dashboard = module.dashboards[module.selectedDashboard];
        return (
            <Button text={dashboard.title} ui="main-button">
                <Menu rel="menu" >
                    <MenuItem text="New ..." name="new-dashboard" iconCls={['x-fa', 'fa-plus-circle']}
                        handler={() => {
                            this.dashboardAdd(module)
                        }}
                    />
                    <MenuItem text="Rename ..." name="new-dashboard" iconCls={['x-fa', 'fa-exchange']}
                        handler={() => {
                            this.dashboardRename(module)
                        }}
                     />
                    <MenuItem text="Delete" name="new-dashboard" iconCls={['x-fa', 'fa-minus-circle']} />
                </Menu>
            </Button>
        );
    }

    createMenuItems(module) {
        const { plugins } = this.props;
        let menuitems = [];
        plugins.forEach((p) => {
            menuitems.push(p.widgets.map((w) => {
                return (
                    <MenuItem text={w.text} name={w.text} iconCls={w.iconCls} handler={(params) => {
                        let dashboard = module.dashboards[module.selectedDashboard];
                        this.props.dispatch(addWidget(module.title, dashboard.title, w.text, w.component));
                    }} />
                );
            }));
        });
        return menuitems;
    }

    createWidgetList() {
        const { modules, selectedModule } = this.props;
        let module = modules[selectedModule];
        return (
            <Button align="right" ui="main-button" iconCls={['x-fa', 'fa-bars']} arrow={false}>
                <Menu rel="menu" >
                { this.createMenuItems(module) }
                </Menu>
            </Button>
        );
    }

    createModules() {
        const { modules, selectedModule } = this.props;
        return modules.map((item, index) => {
            let pressed = (index == selectedModule);
            return (
                <Button
                    ref={button => this.button = button}
                    key={item.title}
                    text={item.title}
                    ui="action"
                    pressed={pressed}
                    handler={() => this.selectModule(item.title)}
                />
            );
        })
    }

    selectModule(title) {
        this.props.dispatch(selectModule(title));
    }
}

const mapStateToProps = (state) => {
    return { ...state.main, ...state.login, ...state.plugin };
}

export default connect(mapStateToProps, null, null, { withRef: true })(AppBar);