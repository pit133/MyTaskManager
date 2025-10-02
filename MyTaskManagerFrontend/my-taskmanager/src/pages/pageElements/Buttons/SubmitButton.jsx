export default function SubmitButton({text, loading}){

    return(
        <button type="submit" disabled={loading}>
          {text}
        </button>
    )
}