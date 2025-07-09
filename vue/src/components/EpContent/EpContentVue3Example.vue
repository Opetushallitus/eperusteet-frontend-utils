<template>
  <div>
    <h2>EpContentVue3 Example</h2>
    <div class="row">
      <div class="col-md-12 mb-4">
        <ep-content-vue3
          v-model="content"
          :is-editable="isEditable"
          layout="normal"
          :is-plain-string="false"
          help="content-help-text"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <button class="btn btn-primary" @click="toggleEdit">
          {{ isEditable ? 'View Mode' : 'Edit Mode' }}
        </button>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label>Current Language</label>
          <select class="form-control" v-model="currentLang">
            <option value="fi">Finnish</option>
            <option value="sv">Swedish</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-12">
        <h4>Content Model:</h4>
        <pre>{{ JSON.stringify(content, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Kielet } from '@shared/stores/kieli';
import EpContentVue3 from './EpContentVue3.vue';

// State
const isEditable = ref(true);
const content = ref({
  fi: '<p>Tämä on esimerkkisisältöä suomeksi.</p>',
  sv: '<p>Detta är exempelinnehåll på svenska.</p>',
  en: '<p>This is example content in English.</p>',
});

// Set up language
const currentLang = ref('fi');

// Watch for language changes
watch(currentLang, (newLang) => {
  Kielet.setSisaltoKieli(newLang);
});

// Methods
function toggleEdit() {
  isEditable.value = !isEditable.value;
}
</script>

<style scoped>
pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  max-height: 200px;
  overflow: auto;
}
</style>
