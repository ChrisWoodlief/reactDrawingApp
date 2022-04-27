export default function FullScreenPageText(props){
  return (<>
    <div className="container fullScreenPageTextContainer">
      <div className="row">
        <div className="col-sm-12 col-md-5">
          <h4>{props.pageText}</h4>
        </div>
      </div>
    </div>
  </>);
}
