import React from 'react';

const textareaField = ({input, label = '', id = 'customTextarea', rows = 3}) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <textarea  {...input} className="form-control" id="exampleFormControlTextarea1" rows={rows}></textarea>
  </div>
)

export default textareaField;
