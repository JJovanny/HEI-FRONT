export const NotFound = ({ string, mb = false }) => {
  return (
    <div
      className={`alert alert-primary m-5 mb-${mb ? '5' : '0'} text-center`}
      role='alert'
    > {string}
    </div>
  )
}
