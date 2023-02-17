import React from 'react';

const selectField = ({input, className, id = 'customRadio', inline = false, content}) => (
  <section className={`${inline ? 'custom-control-inline' : '' } custom-control custom-checkbox ${className}`}>
    <input {...input} type="checkbox" className="custom-control-input" id={id} />
    <label className="custom-control-label" htmlFor={id}>{content}</label>
  </section>
)

export default selectField;
