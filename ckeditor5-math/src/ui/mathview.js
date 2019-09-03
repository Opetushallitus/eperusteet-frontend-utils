import View from '@ckeditor/ckeditor5-ui/src/view';

export default class MathView extends View {
    constructor( engine, locale ) {
        super( locale );

        this.engine = engine;

        this.set( 'value', '' );

        this.on( 'change:value', () => {
            this.updateMath();
        } );

        this.setTemplate( {
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-math-preview'
                ],
            }
        } );
    }

    updateMath() {
        if ( this.engine === 'mathjax' ) {
            this.element.innerHTML = '\\[' + this.value + '\\]';
            MathJax.Hub.Queue( [ 'Typeset', MathJax.Hub, this.element ] );
        }
        else if ( this.engine === 'katex' ) {
            katex.render( this.value, this.element, {
                displayMode: true,
                throwOnError: false
            } );
        }
    }

    render() {
        super.render();
        this.updateMath();
    }
}
