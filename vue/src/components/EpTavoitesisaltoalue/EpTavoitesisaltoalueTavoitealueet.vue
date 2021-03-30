<template>
  <div>
    <b-row v-for="(tavoitealue, tavoitealueIndex) in tavoitealueet" :key="'tavoite'+tavoitealueIndex" class="tavoitealue">
      <b-col cols="8">
        <template v-if="tavoitealue.tavoiteAlueTyyppi === 'OTSIKKO'">
          <hr v-if="tavoitealueIndex > 0" class="mt-0"/>
          <div class="otsikko mb-2">{{$kaanna(tavoitealue.otsikko.nimi)}}</div>
        </template>

        <div v-if="tavoitealue.tavoiteAlueTyyppi === 'TAVOITESISALTOALUE'" class="tavoitesisaltoalue mb-4">

          <div v-if="tavoitealue.tavoitteet && tavoitealue.tavoitteet.length > 0" class="mb-4">
            <div class="tavoitteet mb-2">{{$t('tavoitteet')}}</div>
            <div v-for="(tavoite, index) in tavoitealue.tavoitteet" :key="tavoitealueIndex+'tavoitealue'+index" class="tavoite mb-2">
              {{$kaanna(tavoite.nimi)}}
            </div>
          </div>

          <div v-if="tavoitealue.keskeisetSisaltoalueet && tavoitealue.keskeisetSisaltoalueet.length > 0">
            <div class="tavoitteet mb-2">{{$t('keskeiset-sisaltoalueet')}}</div>
            <div v-for="(keskeisetSisaltoalueet, index) in tavoitealue.keskeisetSisaltoalueet" :key="tavoitealueIndex+'tavoitealue'+index" class="keskeinensisaltoalue">
              {{$kaanna(keskeisetSisaltoalueet)}}
            </div>
          </div>

        </div>
      </b-col>
    </b-row>
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
