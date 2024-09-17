<template>
  <div
    class="message"
    :class="{['role-' + message.role]: true, 'no-edit': !isEditing}"
    :ref="message.lastMessage ? 'lastMessage' : message.messageId">
    <EpSpinner v-if="prosessingMessage && message.lastMessage" class="mr-auto"/>
    <div class="d-flex" v-else>
      <template v-if="message.role ==='user'">
        <EpMaterialIcon outlined class="mr-1">person</EpMaterialIcon>
        <strong>
          <slot name="user">
            {{$t('sina')}}
          </slot>
        </strong>
      </template>
      <template v-else>
        <EpMaterialIcon outlined class="mr-1">smart_toy</EpMaterialIcon>
        <strong>OpsAI</strong>
      </template>
    </div>
    <div v-html="message.content"></div>
    <div class="mt-1 d-flex align-items-center" v-if="message.createdAt">
      <span class="message-sent">{{$t('lahetetty')}}: {{$sdt(message.createdAt)}}</span>
      <template v-if="isEditing">
        <template v-if="message.threadId && message.role !== 'user'">
          <span class="ml-2">|</span>
          <span class="ml-2">{{$t('kerro-mita-pidit-vastauksesta')}}:</span>
          <div class="d-inline-block ml-2 link-style clickable" @click="sendFeedbackResult(positiveFeedback)">
            <EpMaterialIcon class="thumb" :outlined="feedbackResult !== positiveFeedback">thumb_up</EpMaterialIcon>
          </div>
          <div class="d-inline-block ml-2 link-style clickable" @click="sendFeedbackResult(negativeFeedback)">
            <EpMaterialIcon class="thumb" :outlined="feedbackResult !== negativeFeedback">thumb_down</EpMaterialIcon>
          </div>
        </template>
        <EpButton
          v-if="feedbackResult && !feedbackOpen && !message.feedback.comment"
          class="ml-3 vapaa-palaute-link"
          variant="link"
          size="sm"
          @click="openFeedback()"
          :paddingx="false">
          {{ $t('anna-vapaamuotoinen-palaute') }}
        </EpButton>
      </template>
    </div>
    <div class="mt-2" v-if="feedbackResult">
      <div class="font-weight-600" v-if="isEditing">
        <template v-if="feedbackOpen">
          {{ $t('opsai-tekstipalaute') }}:
          <div class="d-flex w-100 mt-1">
            <b-form-input class="mr-auto" v-model="message.feedback.comment" :placeholder="$t('kirjoita-palaute-tahan')"></b-form-input>
            <EpButton class="ml-2" @click="sendFeedback()" variant="primary">{{$t('laheta')}}</EpButton>
            <EpButton variant="link" @click="closeFeedback()" :paddingx="false">{{$t('sulje')}}</EpButton>
          </div>
        </template>
        <template v-else>
          {{ $t('opsai-palaute-kiitos') }}
        </template>
      </div>
      <div v-else class="d-flex no-edit feedback p-2">
        <EpMaterialIcon v-if="feedbackResult === positiveFeedback" class="feedback-thumb" >thumb_up</EpMaterialIcon>
        <EpMaterialIcon v-if="feedbackResult === negativeFeedback" class="feedback-thumb" >thumb_down</EpMaterialIcon>
        <div class="font-weight-600 ml-2 feedback-comment">{{message.feedback.comment}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FeedbackDtoResultEnum } from '@shared/api/ai';

@Component({
  components: {

  },
})
export default class EpOpsAiMessage extends Vue {
  @Prop({ required: true })
  private value!: any;

  @Prop({ required: false, default: false })
  private prosessingMessage!: boolean;

  @Prop({ required: false, default: false, type: Boolean })
  private isEditing!: boolean;

  positiveFeedback = FeedbackDtoResultEnum.POSITIVE;
  negativeFeedback = FeedbackDtoResultEnum.NEGATIVE;
  feedbackOpen = false;

  set message(value: any) {
    this.$emit('input', value);
  }

  get message() {
    return this.value;
  }

  sendFeedbackResult(result: FeedbackDtoResultEnum) {
    this.openFeedback();
    this.message.feedback = {
      ...(this.message.feedback && this.message.feedback),
      result: result,
    };
    this.$emit('sendFeedback', this.message);
  }

  sendFeedback() {
    this.closeFeedback();
    this.$emit('sendFeedback', this.message);
  }

  closeFeedback() {
    this.feedbackOpen = false;
  }

  openFeedback() {
    this.feedbackOpen = true;
  }

  get feedbackResult() {
    return this.message?.feedback?.result;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.message {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 1rem;
  border: 1px solid #DADADA;

  &.role-user {
    display: inline-block;
    background-color: #C1EAFF;
    margin-left: auto !important;
    border-bottom-right-radius: 0;
    &.no-edit {
      width: 50%;
      max-width: 50%;
    }
  }

  &.role-assistant {
    display: inline-block;
    max-width: 800px;
    margin-right: auto !important;
    background-color: $white;
    border-top-left-radius: 0;

    &.no-edit {
      background-color: #EDEDED;
      width: 80%;
      max-width: 80%;
    }
  }

  .message-sent {
    font-size: 0.8rem;
    color: #999;
  }

  .feedback-thumb {
    color: $blue-lighten-5;
  }

  .no-edit {
    &.feedback {
      background-color: $white;
      border-radius: 0.5rem;
    }
  }
}

</style>
