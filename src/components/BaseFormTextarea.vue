<template>
  <BaseFormField :title="title" :error="error">
    <textarea
      v-model="dataValue"
      :type="type"
      class="form__input form__input--area"
      :placeholder="placeholder"
    ></textarea>
  </BaseFormField>
</template>
<script>
    import FormFieldMixin from '@/mixins/FormFieldMixin';

    export default {
       props: {
            type: {
                default: 'text'
            }
        },
        mixins: [FormFieldMixin]
    }
</script>