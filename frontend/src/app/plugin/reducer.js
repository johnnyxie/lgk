import {
    PLUGIN_REGISTER
} from './actions';
import PLuginManager from './PluginManager';


const initialState = {
    plugins: []
};

export default function pluginReducer(state = initialState, action) {
    switch (action.type) {
        case PLUGIN_REGISTER: {
            const name = action.payload.plugin;
            const instance = PLuginManager.getPlugin(name);
            if (!instance) {
                console.log("Plugin " + name + " not found!");
                return state;
            }
            let newPlugin = {name: name, widgets: instance.allowWidgets()};
            let plugins = [...state.plugins, newPlugin];
            return {...state, plugins};
        }
        default:
            return state;
    }
}