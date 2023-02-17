import React from 'react';

const inputField = ({input, id, label, inline=false,placeholder, type, meta: {touched, error, warning}}) => (
  <section className={`${inline ? 'custom-control-inline' : ''} text-left mb-3`}>
    {label ? <label htmlFor={id} className="mr-2">{label}</label> : ''}
    <input {...input}
           placeholder={placeholder} type={type}
           className={`${touched && error ? 'has-error' : ''} form-control`}/>
    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </section>
)

export default inputField;
