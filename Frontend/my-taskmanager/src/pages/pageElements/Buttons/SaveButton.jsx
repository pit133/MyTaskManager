export default function SaveButton({loading}){

    return(
        <button type="submit" disabled={loading}>
          Save
        </button>
    )
}