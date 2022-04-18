import React from 'react'
export default class DrawingFeed extends React.Component {
  static async getInitialProps() {
    return {}
  }

  async componentDidMount(){
    try{
      const response = await fetch('/api/hello');
      const data = await response.json();
      console.log(`data: ${JSON.stringify(data)}`);
    }
    catch(error){
        console.log('componentDidMount error');
    }
  }

  render() {
    return <div>Drawing Feed</div>
  }
}
