import React, { Component } from 'react';
import Plugin from '../../app/plugin/Plugin';
import PluginManager from '../../app/plugin/PluginManager';
import {
    Panel
} from '@extjs/reactor/modern';

export default class ESLog extends Plugin {

    constructor() {
        super();
    }

    availableWidgets() {
        // need to populate widget list
        return [];
    }

    allowWidgets(user) {
        return [{
            component: {
                render: () => {
                    return (
                        <Panel />
                    )
                },
                x: 0, y: 0, width: 6, height: 30
            },
            iconCls: 'x-fa fa-external-link',
            text: 'My Teams'
        }, {
            component: {
                render: () => {
                    return (
                        <Panel />
                    )
                },
                x: 0, y: 0, width: 6, height: 30
            },
            iconCls: 'x-fa fa-external-link',
            text: 'Chat',
        }];
    }
}

PluginManager.register('ESLog', new ESLog());