import {
    WIDGET_ADD,
    WIDGET_DELETE,
    DASHBOARD_ADD,
    DASHBOARD_DELETE,
    DASHBOARD_RENAME,
    DASHBOARD_SELECT,
    MODULE_ADD,
    MODULE_DELETE,
    MODULE_RENAME,
    MODULE_SELECT
} from './actions';

const initialState = {
    modules: [{
        title: "Dashboards",
        dashboards: [{title: "My Team", widgets: []}, {title: "Standings", widgets: []}],
        selectedDashboard: 0
    }, {
        title: "Configurations",
        dashboards: []
    }],
    selectedModule: 0
}

export default function mainReducer(state = initialState, action) {
    switch (action.type) {
        case MODULE_ADD: {
            const title = action.payload.title;
            let newModule = {title, dashboards: []};
            let modules = [...state.modules, newModule];
            return {...state, modules};
        }
        case MODULE_DELETE: {
            const title = action.payload.title;
            let modules = [...state.modules];
            modules = modules.filter((item) => {
                return (item.title == title);
            });
            return {...state, modules};
        }
        case MODULE_RENAME: {
            const from = action.payload.from;
            const to = action.payload.to;
            let modules = [...state.modules];
            modules.forEach((item) => {
                if (item.title == from) {
                    item.title = to;
                }
            });
            return {...state, modules};
        }
        case MODULE_SELECT: {
            const title = action.payload.title;
            let modules = [...state.modules];
            let selectedModule;
            for (let i=0; i< modules.length; i++) {
                let item = modules[i];
                if (item.title == title) {
                    selectedModule = i;
                    break;
                }
            }
            return {...state, selectedModule};
        }
        case DASHBOARD_ADD: {
            const module = action.payload.module;
            const title = action.payload.title;
            let modules = [...state.modules];
            modules.forEach((m) => {
                if (m.title == module) {
                    let newDashboard = {title, widgets: []};
                    m.dashboards = [...m.dashboards, newDashboard];
                }
            });
            return {...state, modules};
        }
        case DASHBOARD_DELETE: {
            const module = action.payload.module;
            const dashboard = action.payload.dashboard;
            const title = action.payload.title;
            let modules = [...state.modules];
            modules.forEach((m) => {
                if (m.title == module) {
                    let dashboards = [...m.dashboards];
                    dashboards = dashboards.filter((d) => {
                        return (d.title == dashboard);
                    });
                    m.dashboards = dashboards;
                }
            });
            return {...state, modules};
        }
        case DASHBOARD_RENAME: {
            const module = action.payload.module;
            const from = action.payload.from;
            const to = action.payload.to;
            let modules = [...state.modules];
            modules.forEach((m) => {
                if (m.title == module) {
                    m.dashboards.forEach((item) => {
                        if (item.title == from) {
                            item.title = to;
                        }
                    });
                }
            });
            return {...state, modules};
        }
        case DASHBOARD_SELECT: {
            const module = action.payload.module;
            const title = action.payload.title;
            let modules = [...state.modules];
            for (let i=0; i< modules.length; i++) {
                let item = modules[i];
                if (item.title == module) {
                    let dashboards = [...item.dashboards];
                    for (let j=0; j<dashboards.length; j++) {
                        let d = dashboards[j];
                        if (d.title == title) {
                            item.selectedDashboard = j;
                        }
                    }
                    break;
                }
            }
            return {...state, modules};
        }
        case WIDGET_ADD: {
            const module = action.payload.module;
            const dashboard = action.payload.dashboard;
            const title = action.payload.title;
            const component = action.payload.component;
            const id = Ext.id();
            const key = id;
            let newWidget = {title, ...component, id, key};
            let modules = [...state.modules];
            modules.forEach((m) => {
                if (m.title == module) {
                    m.dashboards.forEach((d) => {
                        if (d.title == dashboard) {
                            d.widgets = [...d.widgets, newWidget];
                        }
                    });
                }
            })
            return {...state, modules};
        }
        case WIDGET_DELETE: {
            const module = action.payload.module;
            const dashboard = action.payload.dashboard;
            const title = action.payload.title;
            let modules = [...state.modules];
            modules.forEach((m) => {
                if (m.title == module) {
                    m.dashboards.forEach((d) => {
                        if (d.title == dashboard) {
                            d.widgets = d.widgets.filter((w) => {
                                return (w.title != title);
                            })
                        }
                    });
                }
            });
            return {...state, modules};
        }
        default: 
            return state;        
    }
}
