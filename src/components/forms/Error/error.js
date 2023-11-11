const ErrorHandler = ({ error }) => {

  return (
    error &&
    <div className="error">
      {error}
    </div>
  )
}

export default ErrorHandler