export default function FullScreenPageText(props){
  return (<>
    <div class="container fullScreenPageTextContainer">
      <div class="row">
        <div class="col-sm-12 col-md-5">
          <h4>{props.pageText}</h4>
        </div>
      </div>
    </div>
  </>);
}
