import React from 'react';

const radioField = ({input, id = 'customRadio', inline = false, className = '', content}) => (
  <section className={`${inline ? 'custom-control-inline' : '' } custom-control custom-radio ${className}`}>
    <input {...input} type="radio" className="custom-control-input" id={id}/>
    <label className="custom-control-label" htmlFor={id}>{content}</label>
  </section>
)

export default radioField;
