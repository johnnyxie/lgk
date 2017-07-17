export const PLUGIN_REGISTER = "PLUGIN_REGISTER";





export function registerPlugin(plugin) {
    return {
        type: PLUGIN_REGISTER,
        payload: {
            plugin
        }
    }
}
