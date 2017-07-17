import { registerPlugin } from './actions';
import { store } from '../store';


export default class PluginManager {

    static plugins = [];
    static schema = null;
    

    static register(name, plugin) {
        PluginManager.plugins.push({name: name, instance: plugin});
        store.dispatch(registerPlugin(name));
    }

    static getPlugin(name) {
        for (let item of PluginManager.plugins) {
            if (item.name == name)
                return item.instance;
        }
    }

    /**
     * return list of plugin allow for the current user
     */
    static allowPlugins() {
        //let currentUser = PluginManager.getUser();
        return PluginManager.plugins;
    }

    /**
     * return widget list from the available plugins
     */
    static availableWidgets() {
        let widgets = [];
        let allowPlugins = PluginManager.allowPlugins();
        Ext.each(allowPlugins, function (plugin) {
            widgets = widgets.concat(plugin.instance.availableWidgets());
        });

        return widgets;
    }

    /**
     * return widget list from the allow plugins with the current user
     */
    static allowWidgets() {
        let widgets = [];
        let allowPlugins = PluginManager.allowPlugins();
        Ext.each(allowPlugins, function (plugin) {
            widgets = widgets.concat(plugin.instance.allowWidgets());
        });

        return widgets;
    }

}
