import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class Comment extends Plugin {
  static get pluginName() {
    return 'Comment';
  }

  init() {
    const editor = this.editor;
    this._registerElement( editor, 'commentStart', 'comment-start' );
    this._registerElement( editor, 'commentEnd', 'comment-end' );
  }

  _registerElement( editor, modelKey, viewKey ) {
    editor.model.schema.register( modelKey, {
      allowWhere: '$text',
      isObject: true
    } );

    editor.conversion.for( 'upcast' )
        .elementToElement( {
          model: ( viewElement, modelWriter ) => modelWriter.createElement( modelKey, {
            uid: viewElement.getAttribute( 'uid' ),
          } ),
        view: {
          name: viewKey,
        }
      } );

    editor.conversion.for('downcast')
    .elementToElement( {
      model: modelKey,
      view: ( data, writer ) => writer.createAttributeElement( viewKey, {
        uid: data.getAttribute('uid'),
      } ),
    } );
  }
}
