import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview';
import LabelView from '@ckeditor/ckeditor5-ui/src/label/labelview';

import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';

import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';

import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';

import MathView from './mathview';

import '../../theme/mathform.pcss';

export default class MainFormView extends View {
    constructor( engine, locale ) {
        super( locale );

        const t = locale.t;

        // Observable value
        this.set( 'texEq', '' );

        // Create key event & focus trackers
        this._createKeyAndFocusTrackers();

        // equation input
        this.mathInput = this._createInputView();

        // Preview label
        this.previewLabel = new LabelView( locale );
        this.previewLabel.text = t( 'Equation preview' );

        // Math element
        this.mathView = new MathView( engine, locale );

        // Submit button
        this.saveButton = this._createButton( t( 'Save' ), checkIcon, 'ck-button-save', null );
        this.saveButton.type = 'submit';

        // Cancel button
        this.cancelButton = this._createButton( t( 'Cancel' ), cancelIcon, 'ck-button-cancel', 'cancel' );

        // Add UI elements to template
        this.setTemplate( {
            tag: 'form',
            attributes: {
                class: [
                    'ck',
                    'ck-math-form',
                ],
                tabindex: '-1'
            },
            children: [
                {
                    tag: 'div',
                    attributes: {
                        class: [
                            'ck-math-view'
                        ]
                    },
                    children: [
                        this.mathInput,
                        this.previewLabel,
                        this.mathView,
                    ]
                },
                this.saveButton,
                this.cancelButton,
            ],
        } );
    }

    render() {
        super.render();

        // Prevent default form submit event & trigger custom 'submit'
        submitHandler( {
            view: this,
        } );

        // Register form elements to focusable elements
        const childViews = [
            this.mathInput,
            this.saveButton,
            this.cancelButton,
        ];

        childViews.forEach( v => {
            this.focusables.add( v );
            this.focusTracker.add( v.element );
        } );

        // Listen to keypresses inside form element
        this.keystrokes.listenTo( this.element );
    }

    focus() {
        this.focusCycler.focusFirst();
    }

    _createKeyAndFocusTrackers() {
        this.focusTracker = new FocusTracker();
        this.keystrokes = new KeystrokeHandler();
        this.focusables = new ViewCollection();

        this.focusCycler = new FocusCycler( {
            focusables: this.focusables,
            focusTracker: this.focusTracker,
            keystrokeHandler: this.keystrokes,
            actions: {
                focusPrevious: 'shift + tab',
                focusNext: 'tab'
            }
        } );
    }

    _createInputView() {
        const t = this.locale.t;

        // Create equation input
        const mathInput = new LabeledInputView( this.locale, InputTextView );
        const inputView = mathInput.inputView;
        mathInput.infoText = t( 'Insert equation in TeX format' );
        inputView.on( 'input', e => {
            this.mathView.value = e.source.element.value;
        } );

        return mathInput;
    }

    _createButton( label, icon, className, eventName ) {
        const button = new ButtonView( this.locale );

        button.set( { label, icon, tooltip: true } );

        button.extendTemplate( { attributes: { class: className } } );

        if ( eventName ) {
            button.delegate( 'execute' ).to( this, eventName );
        }

        return button;
    }
}
