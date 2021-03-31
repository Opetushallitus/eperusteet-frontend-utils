<template>
  <div>
    <div v-for="(tavoitealue, tavoitealueIndex) in tavoitealueet" :key="'tavoite'+tavoitealueIndex" class="tavoitealue">
      <template v-if="tavoitealue.tavoiteAlueTyyppi === 'OTSIKKO'">
        <hr v-if="tavoitealueIndex > 0" class="mt-0 mb-5"/>
        <div class="otsikko mb-3">{{$kaanna(tavoitealue.otsikko.nimi)}}</div>
      </template>

      <div v-if="tavoitealue.tavoiteAlueTyyppi === 'TAVOITESISALTOALUE'" class="tavoitesisaltoalue mb-5">

        <div v-if="tavoitealue.tavoitteet && tavoitealue.tavoitteet.length > 0" class="mb-5">
          <div class="tavoitteet mb-2">{{$t('tavoitteet')}}</div>
          <div v-for="(tavoite, index) in tavoitealue.tavoitteet" :key="tavoitealueIndex+'tavoitealue'+index" class="tavoite mb-3">
            {{$kaanna(tavoite.nimi)}}
          </div>
        </div>

        <div v-if="tavoitealue.keskeisetSisaltoalueet && tavoitealue.keskeisetSisaltoalueet.length > 0">
          <div class="tavoitteet mb-2">{{$t('keskeiset-sisaltoalueet')}}</div>
          <div v-for="(keskeisetSisaltoalueet, index) in tavoitealue.keskeisetSisaltoalueet" :key="tavoitealueIndex+'tavoitealue'+index" class="keskeinensisaltoalue p-2">
            {{$kaanna(keskeisetSisaltoalueet)}}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';

@Component
export default class EpTavoitesisaltoalueTavoitealueet extends Vue {
  @Prop({ required: true })
  private tavoitealueet!: any[];
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";
  .tavoitealue{
    .otsikko {
      font-size: 1.1rem;
      font-weight: 400;
    }

    .tavoitesisaltoalue {

      .tavoitteet {
        font-size: 1rem;
        font-weight: 600;
      }

      .keskeinensisaltoalue {
        &:nth-of-type(even) {
          background-color: $table-even-row-bg-color;
        }
        &:nth-of-type(odd) {
          background-color: $table-odd-row-bg-color;
        }
      }
    }
  }

</style>
