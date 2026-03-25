<template>
  <div>
    <ep-modal
      id="editointi-koodisto-valinta"
      ref="koodistoPickModalRef"
      :header="$t('valitse-koodisto')"
    >
      <div class="flex flex-col mb-2">
        <EpSpinner v-if="!koodistot" />
        <ep-button
          v-for="koodisto in koodistot"
          :key="koodisto.koodistoUri"
          variant="link"
          class="text-left justify-content-start"
          @click="valitseKoodistoJaAvaa(koodisto.koodistoUri!)"
        >
          {{ $kaanna(koodisto.nimi) }}
        </ep-button>
      </div>

      <template #modal-footer>
        <ep-button
          variant="link"
          @click="koodistoPickModalRef.hide?.()"
        >
          {{ $t('peruuta') }}
        </ep-button>
      </template>
    </ep-modal>
    <div class="d-none">
      <EpKoodistoSelect
        ref="codingKoodistoSelectRef"
        :koodisto="koodisto"
        :is-editing="true"
        :editable="false"
        @add="onKoodistoKoodiValittu"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpKoodistoSelect from '../EpKoodistoSelect/EpKoodistoSelect.vue';
import { $t, $success, $fail } from '@shared/utils/globals';
import type { EditointiStore } from './EditointiStore';
import { Koodisto, KoodistoDto } from '@shared/api/eperusteet';
import _ from 'lodash';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpModal from '../EpModal/EpModal.vue';

const props = defineProps<{
  store: EditointiStore;
  codes: string[];
}>();

const koodisto = ref<string>('');
const koodistoPickModalRef = ref<{ hide?: () => void; show?: () => void } | null>(null);
const codingKoodistoSelectRef = ref<InstanceType<typeof EpKoodistoSelect> | null>(null);
const koodistot = ref<KoodistoDto[] | null>(null);

const valitseKoodistoJaAvaa = async (koodistoUri: string) => {
  koodistoPickModalRef.value?.hide?.();
  koodisto.value = koodistoUri;
  await nextTick();
  await codingKoodistoSelectRef.value?.openDialog?.();
};

const aloitaKooditus = async () => {
  const codeList = props.codes || [];
  if (!codeList.length || !props.store?.hooks?.addCoding) {
    return;
  }
  if (codeList.length === 1) {
    await valitseKoodistoJaAvaa(codeList[0]);
  }
  else {
    koodistoPickModalRef.value?.show?.();
    koodistot.value = await Promise.all(_.map(codeList, async k => (await Koodisto.getKoodistoTiedot(k)).data));
  }
};

const onKoodistoKoodiValittu = async (row: any) => {
  try {
    await props.store.addCoding(row);
    await props.store.init();
    $success($t('sisalto-kooditettu') as string);
  }
  catch (err) {
    console.log(err);
    $fail($t('kooditus-epaonnistui') as string);
  }
};

defineExpose({
  aloitaKooditus,
});
</script>
