import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import MathUI from './mathui';

export default class Math extends Plugin {

    static get requires() {
        return [
            MathUI
        ];
    }

    static get pluginName() {
        return 'Math';
    }

}
