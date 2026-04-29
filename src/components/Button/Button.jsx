

const Button = ({ buttonLabel, onClick, disabled}) => {
    return (
        <button onClick={onClick} disabled={disabled}>
            {buttonLabel}
        </button>
    )
}

export default Button;