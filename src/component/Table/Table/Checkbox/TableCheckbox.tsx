import React from 'react';
import {
  CheckBoxOutlined,
  CheckBoxOutlinedBlack,
  CheckboxChecked,
  CheckboxCheckedBlack,
  CheckboxIndeterminateBlack,
} from '../../../../assets';

interface Props {
  checked: boolean;
  black?: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}

export const TableCheckbox = ({
  checked,
  black = false,
  indeterminate = false,
  onChange,
}: Props): JSX.Element => {
  return (
    <div className="tableCheckbox">
      <input
        type="checkbox"
        onClick={(e) => e.stopPropagation()}
        className="checkbox"
        checked={checked}
        onChange={onChange}
      />
      {!checked && !black && <CheckBoxOutlined className="outlined" />}
      {checked && !black && <CheckboxChecked />}
      {!checked && black && !indeterminate && <CheckBoxOutlinedBlack />}
      {checked && black && !indeterminate && <CheckboxCheckedBlack />}
      {black && indeterminate && <CheckboxIndeterminateBlack />}
    </div>
  );
};
