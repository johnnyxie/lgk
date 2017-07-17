export const WIDGET_ADD = 'WIDGET_ADD';
export const WIDGET_DELETE = 'WIDGET_DELETE';
export const DASHBOARD_ADD = 'DASHBOARD_ADD';
export const DASHBOARD_DELETE = 'DASHBOARD_DELETE';
export const DASHBOARD_RENAME = 'DASHBOARD_RENAME';
export const DASHBOARD_SELECT = 'DASHBOARD_SELECT';
export const MODULE_ADD = 'MODULE_ADD';
export const MODULE_DELETE = 'MODULE_DELETE';
export const MODULE_RENAME = 'MODULE_RENAME';
export const MODULE_SELECT = 'MODULE_SELECT';

export function addModule(title) {
    return {
        type: MODULE_ADD,
        payload: {
            title
        }
    }
}

export function deleteModule(title) {
    return {
        type: MODULE_DELETE,
        payload: {
            title
        }
    }
}

export function renameModule(from, to) {
    return {
        type: MODULE_RENAME,
        payload: {
            from,
            to
        }
    }
}

export function selectModule(title) {
    return {
        type: MODULE_SELECT,
        payload: {
            title
        }
    }
}

export function addDashboard(module, title) {
    return {
        type: DASHBOARD_ADD,
        payload: {
            module,
            title
        }
    }
}

export function deleteDashboard(module, title) {
    return {
        type: DASHBOARD_DELETE,
        payload: {
            module,
            title
        }
    }
}

export function renameDashboard(module, from, to) {
    return {
        type: DASHBOARD_RENAME,
        payload: {
            module,
            from,
            to
        }
    }
}

export function selectDashboard(module, title) {
    return {
        type: DASHBOARD_SELECT,
        payload: {
            module,
            title
        }
    }
}

export function addWidget(module, dashboard, title, component) {
    return {
        type: WIDGET_ADD,
        payload: {
            module,
            dashboard,
            title,
            component
        }
    }
}

export function deleteWidget(module, dashboard, title) {
    return {
        type: WIDGET_DELETE,
        payload: {
            module,
            dashboard,
            title
        }
    }
}
