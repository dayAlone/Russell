import current from './default';
import path from 'path';
import { deferConfig as defer } from 'config/defer';

current.domain = 'rh.radia.ru';
//current.mongoose.uri = process.env.MONGOLAB_URI;
current.crypto.hash.iterations = 12000;
current.folders = {
    source: defer(function(cfg) {
        return path.join(cfg.root, 'client/public/');
    }),
    tmp: defer(function(cfg) {
        return path.join(cfg.root, 'client/public/');
    }),
};
export default current;
