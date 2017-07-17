export default class Plugin {

    constructor() {
        this.init();
    }

    init() {
    }

    /**
     * return the list of availableWidgets
     */
    availableWidgets() {
        throw new Error('You have to implement the method availableWidgets!')
    }

    /**
     * return the allow widget list for the current user
     */
    allowWidgets() {
        throw new Error('You have to implement the method allowWidgets!')
    }
}
