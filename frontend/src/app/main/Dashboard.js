import React, { Component } from 'react';
import {
    Container,
    Panel
} from '@extjs/reactor/modern';
import { connect } from 'react-redux';
import GridStack from '../gridstack/GridStack';
import GridStackItem from '../gridstack/GridStackItem';
import { deleteWidget } from './actions';


class Dashboard extends Component {

    constructor() {
        super();
    }

    render() {
        const { modules, selectedModule, index } = this.props;
        let module = modules[selectedModule];
        let dashboard = module.dashboards[index];

        return (
            <Panel layout="fit" title={dashboard.title} scrollable>
                <GridStack>
                    {this.createWidgets()}
                </GridStack>
            </Panel>
        )
    }

    createWidgets() {
        const { modules, selectedModule, index } = this.props;
        let module = modules[selectedModule];
        let dashboard = module.dashboards[index];
        let widgets = [...dashboard.widgets];
        if (!Ext.isEmpty(widgets)) {
            return widgets.map((widget) => {
                return (
                    <GridStackItem {...widget}>
                        <Panel
                            title={widget.title}
                            layout="fit"
                            border
                            tools={this.createTools(module.title, dashboard.title, widget.title)}
                        >
                            {widget.render()}
                        </Panel>
                    </GridStackItem>
                );
            });
        }
    }

    createTools(module, dashboard, title) {
        let tools = [
            {
                type: 'print',
                tooltip: 'Print PDF',
                scope: this
            },
            {
                type: 'maximize',
                tooltip: 'Maximize Panel',
                scope: this
            },
            {
                type: 'close',
                tooltip: 'Close Panel',
                scope: this,
                handler: (panel) => {
                    this.props.dispatch(deleteWidget(module, dashboard, title));
                    panel.destroy();
                }
            }
        ];
        return tools;
    }
}

const mapStateToProps = (state) => {
    return state.main;
}

export default connect(mapStateToProps, null, null, { withRef: true })(Dashboard);