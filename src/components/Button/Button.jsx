

const Button = ({ buttonLabel, onClick }) => {
    return (
        <button onClick={onClick}>
            {buttonLabel}
        </button>
    )
}

export default Button;