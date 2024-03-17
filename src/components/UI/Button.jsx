const Button = ({ children, textOnly, className, ...props }) => {
  const cssClass = textOnly ? `text-button ${className}` : `button ${className}`;

  return (
    <button className={cssClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
