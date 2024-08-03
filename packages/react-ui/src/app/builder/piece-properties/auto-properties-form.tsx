import React from 'react';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';

import { JsonEditor } from '@/components/custom/json-editior';
import { ApMarkdown } from '@/components/custom/markdown';
import { SearchableSelect } from '@/components/custom/searchable-select';
import { FormControl, FormField } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import {
  PieceProperty,
  PiecePropertyMap,
  PropertyType,
} from '@activepieces/pieces-framework';

import { ArrayProperty } from './array-property';
import { AutoFormFieldWrapper } from './auto-form-field-wrapper';
import { DictionaryProperty } from './dictionary-property';
import { MultiSelectPieceProperty } from './multi-select-piece-property';
import { SelectPieceProperty } from './select-piece-property';
import { TextInputWithMentions } from './text-input-with-mentions/text-input-with-mentions';

type AutoFormProps = {
  props: PiecePropertyMap;
  allowDynamicValues: boolean;
  prefixValue: string;
  markdownVariables?: Record<string, string>;
};

const AutoPropertiesFormComponent = React.memo(
  ({
    markdownVariables,
    props,
    allowDynamicValues,
    prefixValue,
  }: AutoFormProps) => {
    const form = useFormContext();

    return (
      <div className="flex flex-col gap-4 p-1">
        {Object.entries(props).map(([key]) => {
          return (
            <FormField
              key={key}
              name={prefixValue + '.' + key}
              control={form.control}
              render={({ field }) =>
                selectRightComponent(
                  field,
                  key,
                  prefixValue + '.' + key,
                  props[key],
                  allowDynamicValues,
                  markdownVariables ?? {},
                )
              }
            />
          );
        })}
      </div>
    );
  },
);

const selectRightComponent = (
  field: ControllerRenderProps<Record<string, any>, string>,
  key: string,
  inputName: string,
  property: PieceProperty,
  allowDynamicValues: boolean,
  markdownVariables: Record<string, string>,
) => {
  switch (property.type) {
    case PropertyType.ARRAY:
      return (
        <AutoFormFieldWrapper
          property={property}
          propertyKey={key}
          field={field}
          allowDynamicValues={allowDynamicValues}
        >
          <ArrayProperty inputName={inputName}></ArrayProperty>
        </AutoFormFieldWrapper>
      );
    case PropertyType.OBJECT:
      return (
        <AutoFormFieldWrapper
          property={property}
          propertyKey={key}
          field={field}
          allowDynamicValues={allowDynamicValues}
        >
          <DictionaryProperty
            values={field.value}
            onChange={field.onChange}
          ></DictionaryProperty>
        </AutoFormFieldWrapper>
      );
    case PropertyType.CHECKBOX:
      return (
        <AutoFormFieldWrapper
          property={property}
          propertyKey={key}
          field={field}
          allowDynamicValues={allowDynamicValues}
        >
          <FormControl>
            <Switch
              id={key}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </AutoFormFieldWrapper>
      );
    case PropertyType.MARKDOWN:
      return (
        <ApMarkdown
          markdown={property.description}
          variables={markdownVariables}
        />
      );
    case PropertyType.STATIC_DROPDOWN:
      return (
        <AutoFormFieldWrapper
          property={property}
          propertyKey={key}
          field={field}
          allowDynamicValues={allowDynamicValues}
        >
          <SearchableSelect
            options={property.options.options}
            onChange={field.onChange}
            value={field.value}
            placeholder={property.options.placeholder ?? 'Select a option'}
          ></SearchableSelect>
        </AutoFormFieldWrapper>
      );
    case PropertyType.JSON:
      return (
        <AutoFormFieldWrapper
          property={property}
          propertyKey={key}
          field={field}
          allowDynamicValues={allowDynamicValues}
        >
          <JsonEditor
            initial={field.value}
            onChange={field.onChange}
          ></JsonEditor>
        </AutoFormFieldWrapper>
      );
    case PropertyType.STATIC_MULTI_SELECT_DROPDOWN:
      return (
        <AutoFormFieldWrapper
          property={property}
          propertyKey={key}
          field={field}
          allowDynamicValues={allowDynamicValues}
        >
          <MultiSelectPieceProperty
            placeholder={property.options.placeholder ?? 'Select a option'}
            options={property.options.options}
            onChange={field.onChange}
            initialValues={field.value}
            disabled={property.options.disabled}
          ></MultiSelectPieceProperty>
        </AutoFormFieldWrapper>
      );
    case PropertyType.DROPDOWN:
      return (
        <AutoFormFieldWrapper
          property={property}
          propertyKey={key}
          field={field}
          allowDynamicValues={allowDynamicValues}
        >
          <SelectPieceProperty
            refreshers={property.refreshers}
            initial={field.value}
            onChange={field.onChange}
            propertyName={key}
          ></SelectPieceProperty>
        </AutoFormFieldWrapper>
      );
    case PropertyType.DATE_TIME:
    case PropertyType.SHORT_TEXT:
    case PropertyType.LONG_TEXT:
    case PropertyType.FILE:
    case PropertyType.NUMBER:
    case PropertyType.MULTI_SELECT_DROPDOWN:
    case PropertyType.SECRET_TEXT:
      return (
        <AutoFormFieldWrapper
          property={property}
          field={field}
          propertyKey={key}
          allowDynamicValues={allowDynamicValues}
        >
          <TextInputWithMentions
            initialValue={field.value}
            onChange={field.onChange}
          ></TextInputWithMentions>
        </AutoFormFieldWrapper>
      );
    case PropertyType.DYNAMIC:
    case PropertyType.CUSTOM_AUTH:
    case PropertyType.BASIC_AUTH:
    case PropertyType.OAUTH2:
      return <></>;
  }
};
AutoPropertiesFormComponent.displayName = 'AutoFormComponent';
export { AutoPropertiesFormComponent };
