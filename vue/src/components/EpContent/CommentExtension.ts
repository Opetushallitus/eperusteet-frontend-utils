import { Mark } from 'tiptap';
import { updateMark, removeMark, toggleMark, markInputRule, markPasteRule } from 'tiptap-commands';

export default class CommentExtension extends Mark {
  get name() {
    return 'span';
  }

  get schema() {
    return {
      attrs: {
        kommentti: {
          default: null,
        },
      },
      parseDOM: [{
        tag: 'span[kommentti]',
        getAttrs: (dom: any) => {
          return {
            kommentti: dom.getAttribute('kommentti'),
          };
        },
      }],
      toDOM: (node: any) => ['span', {
        ...node.attrs,
      }, 0],
    };
  }

  commands({ type }) {
    return attrs => {
      if (attrs.kommentti) {
        return updateMark(type, attrs);
      }

      return removeMark(type);
    };
  }
}
