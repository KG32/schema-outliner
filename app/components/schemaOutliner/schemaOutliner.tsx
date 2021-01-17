import React, { Component } from 'react';
import publicIp from 'public-ip';
import './schemaOutliner.global.scss';
import CollectionOutline from './collectionOutline';
import OutlinerService from '../../outliner/OutlinerService';
import { InputGroup, FormControl } from 'react-bootstrap';

class SchemaOutliner extends Component<{}, { [key: string]: any }> {

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      collections: [],
      loading: false,
      uri: '',
      dbName: '',
      connected: false,
      ip: ''
    }
  }

  async componentDidMount() {
    OutlinerService.startOutliner();
    this.setState({ ip: await publicIp.v4() });

    // dev
    this.getOutlinedData();
  }

  async getOutlinedData() {
    this.setState({ loading: true, connected: true });
    const outlinedCollections = await OutlinerService.getOutlinedData();
    this.setState({ collections: outlinedCollections }, () => {
      this.setState({ loading: false });
    });
  }


  render() {
    return (
      <div id='schemaOutliner'>
        <div id='ipDisplay'>{this.state.ip}</div>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">URI</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]"
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={this.state.srv}
            onChange={(e) => this.setState({ uri: e.target.value})}
          />
        </InputGroup>
        {(() => {
          if (this.state.loading) {
            return <p>Loading...</p>
          } else {
            if (this.state.connected) {
              return (
                <div id='collectionsOutlines'>
                  {this.state.collections.map((collection: any) => {
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
