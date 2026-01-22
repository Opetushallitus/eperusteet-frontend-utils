import type { App } from 'vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpToggleGroup from '@shared/components/forms/EpToggleGroup.vue';
import EpPdfLink from '@shared/components/EpPdfLink/EpPdfLink.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import EpInfoBanner from '@shared/components/EpInfoBanner/EpInfoBanner.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';
import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';
import EpInfoPopover from '@shared/components/EpInfoPopover/EpInfoPopover.vue';

export function registerDefaultComponents(app: App) {
  app.component('EpMaterialIcon', EpMaterialIcon);
  app.component('EpToggle', EpToggle);
  app.component('EpToggleGroup', EpToggleGroup);
  app.component('EpPdfLink', EpPdfLink);
  app.component('EpDatepicker', EpDatepicker);
  app.component('EpMultiSelect', EpMultiSelect);
  app.component('EpFormContent', EpFormContent);
  app.component('EpButton', EpButton);
  app.component('EpSpinner', EpSpinner);
  app.component('EpExternalLink', EpExternalLink);
  app.component('EpInfoBanner', EpInfoBanner);
  app.component('EpCollapse', EpCollapse);
  app.component('EpPaikallinenTarkennus', EpPaikallinenTarkennus);
  app.component('EpLinkki', EpLinkki);
  app.component('EpInfoPopover', EpInfoPopover);
}
