import path from 'path'
import { deferConfig as defer } from 'config/defer'

export default {

    cdn: `http://164623.selcdn.com/russell`,
    version: process.env.VERSION || 'v1.2.10',
    domain: 'localhost:8000',
    __dirname: defer(function(cfg) {
        return cfg.root
    }),
    mandrill: '1EAsaRQ9dKfahICQfaybRw',
    ftp: {
        host: 'ftp.selcdn.ru',
        folder: `/russell`,
        login: '47651',
        password: '3lQV616N'
    },
    basicAuth: {
        name: 'test',
        pass: 'test'
    },
    selectel: {
        login: '47651',
        password: '3lQV616N'
    },
    kpk: {
        login: 'kruchkov@frogs-studio.ru',
        password: 'manufaktura'    
    },
    folders: {
        source: defer(function(cfg) {
            return path.join(cfg.root, 'client/public/')
        }),
        tmp: defer(function(cfg) {
            return path.join(cfg.root, 'layout')
        }),
    },
    secret: 'mysecret',
    expires: 60 * 60 * 24,
    mongoose: {
        uri: 'mongodb://localhost/testReact',
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1
                },
                poolSize: 5
            }
        }
    },
    crypto: {
        hash: {
            length: 128,
            // may be slow(!): iterations = 12000 take ~60ms to generate strong password
            iterations: 1
        }
    },
    '/': defer(function(cfg) {
        return cfg.root
    }),
    template: {
        // template.root uses config.root
        root: defer(function(cfg) {
            return path.join(cfg.root, 'client/templates')
        })
    },
    facebook: {
        client: {
            id: '1507758476204624',
            secret: '86ccf62d9e619a80d467d594f8e7ff51'
        },
        callback: {
            url: defer(function(cfg) {
                return `http://${cfg.domain}/auth/facebook/callback`
            })
        }
    },
    vk: {
        client: {
            id: '5110739',
            secret: 'Jd3hweCOh1zpqUUX8B9M'
        },
        callback: {
            url: defer(function(cfg) {
                return `http://${cfg.domain}/auth/vk/callback`
            })
        }
    },
    root: process.cwd()
}
