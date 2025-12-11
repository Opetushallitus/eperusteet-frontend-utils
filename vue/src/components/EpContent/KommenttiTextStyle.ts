import { Node } from '@tiptap/core';

export const KommenttiTextStyle = Node.create({
  name: 'span',
  inline: true,
  group: 'inline',
  content: 'inline*',
  whitespace: 'pre',
  parseHTML() {
    return [{ tag: 'span' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },
  addAttributes() {
    return {
      kommentti: {
        default: null,
        parseHTML: element => element.getAttribute('kommentti'),
        renderHTML: attributes => {
          if (!attributes.kommentti) return {};
          return { kommentti: attributes.kommentti };
        },
      },
    };
  },
});

