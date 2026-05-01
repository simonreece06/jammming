import './Button.css';

const Button = ({ className, buttonLabel, onClick, disabled}) => {
    return (
        <button className={className} onClick={onClick} disabled={disabled}>
            {buttonLabel}
        </button>
    )
}

export default Button;