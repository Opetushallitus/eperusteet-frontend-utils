import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import clickOutsideHandler from "@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler";

import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import MainFormView from "./ui/mainformview";

//import insertMathCommand from "./mathcommand";
import pluginIcon from "../theme/icons/icon.svg";

export default class MathUI extends Plugin {

    static get requires() {
        return [
            ContextualBalloon
        ];
    }

    static get pluginName() {
        return 'MathUI';
    }

    init() {
        const editor = this.editor;

        //this._registerSchema(editor);

        this.formView = this._createFormView(editor);

        this._balloon = editor.plugins.get(ContextualBalloon);

        this._createToolbarMathButton();

        //this._registerEventHandlers(editor);

        //editor.commands.add('insertmath', new insertMathCommand(editor));
    }

    _registerSchema(editor) {
        // Register: <span class='math-tex'></span> element for ckeditor model

        editor.model.schema.register('mathtex', {
            allowWhere: '$text',
            allowContentOf: '$block',
            isLimit: true,
        });

        editor.conversion.elementToElement({
            model: 'mathtex',
            view: {
                name: 'span',
                classes: 'math-tex'
            }
        });
    }

    _createFormView(editor) {
        const engine = 'katex';
        // Todo: use config

        const formView = new MainFormView( engine, editor.locale);

        // Listen to 'submit' button click
        this.listenTo(formView, 'submit', () => {
            editor.execute('insertmath', formView.texEq);
            this._removeFormView();
        });

        // Listen to cancel button click
        this.listenTo(formView, 'cancel', () => {
            this._removeFormView();
        });

        // Close plugin ui, if esc is pressed (while ui is focused)
        formView.keystrokes.set('esc', (data, cancel) => {
            this._removeFormView();
            cancel();
        });

        return formView;
    }

    _createToolbarMathButton() {
        const editor = this.editor;
        const t = editor.t;

        this.editor.ui.componentFactory.add('insertMath', locale => {
            const button = new ButtonView(locale);

            button.isEnabled = true;
            button.label = t('Insert math');
            button.icon = pluginIcon;
            button.tooltip = true;
            button.isToggleable = true;

            this.listenTo(button, 'execute', () => this._showUI(true));

            return button;
        });
    }

    _registerEventHandlers(editor) {
        // Remove UI panel (if esc pressed and ui doesn't have focus)
        editor.keystrokes.set('esc', (data, cancel) => {
            if (this._isFormInPanel) {
                this._removeFormView();
                cancel();
            }
        });

        // Remove UI panel, if user clicks ouside the plugin UI
        clickOutsideHandler({
            emitter: this.formView,
            activator: () => this._isFormInPanel,
            contextElements: [this._balloon.view.element],
            callback: () => this._removeFormView()
        });

        editor.keystrokes.set('Tab', (data, cancel) => {
            if (this._isFormInPanel) {
                this.formView.focus();
                cancel();
            }
        }, {
            priority: 'high',
        });
    }

    _showUI() {
        // Prevent adding ui twice
        if (this._isFormInPanel) {
            return;
        }

        // Create contextual balloon (ui for plugin)
        this._balloon.add({
            view: this.formView,
            position: this._getBalloonPositionData(),
        });
    }

    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;
        const target = view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());
        return { target };
    }

    _removeFormView() {
        this._balloon.remove(this.formView);

        this.editor.editing.view.focus();
    }

    get _isFormInPanel() {
        return this._balloon.hasView(this.formView);
    }

}
