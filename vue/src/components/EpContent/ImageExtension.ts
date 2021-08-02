import { Node, Mark, Plugin } from 'tiptap';
import Vue from 'vue';
import VueSelect from 'vue-select';

import { Kielet } from '@shared/stores/kieli';
import { domAttrsGetter, mapNodeAttrs } from '@shared/utils/helpers';
import ImageModal from './ImageModal.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import _ from 'lodash';
import { IKuvaHandler } from './KuvaHandler';

export default class ImageExtension extends Node {
  public constructor(private handler: IKuvaHandler) {
    super();
  }

  get name() {
    return 'image';
  }

  get extensions() {
    return [];
  }

  get schema() {
    return {
      attrs: {
        'data-uid': {
          default: '',
        },
        'alt': {
          default: '',
        },
        'figcaption': {
          default: '',
        },
      },
      content: 'block*',
      group: 'block',
      draggable: true,
      parseDOM: [{
        tag: 'img',
        getAttrs: domAttrsGetter('data-uid', 'alt', 'figcaption'),
      }],
      toDOM: (node: any) => ['img', node.attrs],
    };
  }

  commands({ type }) {
    return (attrs: any) => {
      return (state, dispatch) => {
        const { selection } = state;
        const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
        const node = type.create(attrs);
        const tx = state.tr.insert(position, node);
        dispatch(tx);
      };
    };
  }

  get view() {
    const opsId = this.opsId;
    const self = this;
    return Vue.extend({
      components: {
        ImageModal,
        VueSelect,
        EpButton,
      } as any,
      props: ['node', 'updateAttrs', 'view'],
      data() {
        return {
          isOpen: false,
          liitteet: self.handler,
        };
      },
      mounted() {
        if (!(this as any).node.attrs['data-uid']) {
          (this as any).open();
        }
      },
      methods: {
        async open() {
          if (!this.view.editable) {
            return;
          }

          const self = (this as any);
          const h = this.$createElement;
          const t = (v: string): string => Kielet.i18n.t(v) as string;
          const oldAltText = self.altText;
          const oldFigcaption = self.figcaption;
          const oldDataUid = self.dataUid;
          const uidObs = Vue.observable({ value: self.dataUid });
          const editor = h(ImageModal, {
            props: {
              value: uidObs,
              loader: self.liitteet,
              kuvatekstiProp: self.figcaption,
              vaihtoehtotekstiProp: self.altText,
            },
            on: {
              input: (value: string) => {
                self.dataUid = value;
                uidObs.value = value;
              },
              onKuvatekstichange(value: string) {
                self.figcaption = value;
              },

              onVaihtoehtoinentekstiChange(value: string) {
                self.altText = value;
              },
            },
          });

          this.$bvModal.msgBoxConfirm([editor], {
            buttonSize: 'sm',
            centered: true,
            size: 'lg',
            noCloseOnBackdrop: true,
            noCloseOnEsc: true,
            headerClass: 'pb-0 mb-0',
            title: [h('h2', {}, t('lisaa-kuva'))],
            cancelTitle: t('peruuta'),
            okTitle: t('lisaa-kuva'),
          });

          this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
            if (bvEvent.trigger === 'cancel') {
              if (oldAltText) {
                self.altText = oldAltText;
              }
              if (oldFigcaption) {
                self.figcaption = oldFigcaption;
              }
              if (oldDataUid) {
                self.dataUid = oldDataUid;
              }
            }
            else {
              if (_.isEmpty(self.dataUid) || _.isEmpty(self.altText)) {
                bvEvent.preventDefault();
              }
            }
          });
        },
      },
      computed: {
        ...mapNodeAttrs('title'),
        dataUid: {
          get() {
            return (this as any).node.attrs['data-uid'];
          },
          set(value: any) {
            (this as any).updateAttrs({
              'data-uid': value,
            });
          },
        },
        altText: {
          get() {
            return (this as any).node.attrs['alt'];
          },
          set(value: any) {
            (this as any).updateAttrs({
              'alt': value,
            });
          },
        },
        figcaption: {
          get() {
            return (this as any).node.attrs['figcaption'];
          },
          set(value: any) {
            (this as any).updateAttrs({
              'figcaption': value,
            });
          },
        },
        tempAltText: {
          get() {
            return this.$t('kuvituskuva');
          },
        },
        url() {
          return (this as any).liitteet.url((this as any).dataUid);
        },
      },
      template: `
        <div>

          <div v-if="view.editable" class="ep-editor-component">

            <figure class="text-center" v-if="dataUid">
              <img class="content-image" @click="open()" :data-uid="dataUid" :src="url" :title="title" :alt="figcaption ? altText : tempAltText">
              <figcaption>{{figcaption || altText}}</figcaption>
            </figure>

            <ep-button v-if="!dataUid" variant="outline" icon="plussa" @click="open()">{{$t('lisaa-kuva')}}</ep-button>
          </div>

          <figure v-if="dataUid && !view.editable" class="text-center">
            <img class="content-image" @click="open()" :data-uid="dataUid" :src="url" :title="title" :alt="figcaption ? altText : tempAltText">
            <figcaption>{{figcaption || altText}}</figcaption>
          </figure>

        </div>
      `,
    });
  }
}
