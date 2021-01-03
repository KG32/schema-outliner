import React, { Component } from 'react';
import './schemaOutliner.global.scss';
import CollectionOutline from './collectionOutline';
import OutlinerService from '../../outliner/OutlinerService';

class SchemaOutliner extends Component<{}, { [key: string]: any }> {

  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      loading: false,
      srv: '',
      uri: '',
      dbName: '',
      connected: false,
    }
  }

  componentDidMount() {
    OutlinerService.startOutliner();
  }

  async getOutlinedData() {
    this.setState({ loading: true, connected: true });
    const outlinedCollections = await OutlinerService.getOutlinedData();
    console.log(outlinedCollections);
    this.setState({ collections: outlinedCollections }, () => {
      this.setState({ loading: false });
    });
  }


  render() {
    return (
      <div id='schemaOutliner'>
        <h1>Schema Outliner <span className='status'></span></h1>
        <div id='controls'>
          <input id='srvInput' value={this.state.srv} onChange={(e) => this.setState({ srv: e.target.value})} placeholder='SRV' />
          <button onClick={()=>this.getOutlinedData()}>Outline</button>
        </div>
        {(() => {
          if(this.state.loading) {
            return <p>Loading...</p>
          } else {
            if (this.state.connected) {
              return (
                <div id='collectionsOutlines'>
                  {this.state.collections.map(collection => {
                    return <CollectionOutline key={collection.name} collection={collection} />
                  })}
                </div>
              )
            } else {
              return <p>No connection.</p>
            }
          }
        })()}
      </div>
    )
  }
}


export default SchemaOutliner;
