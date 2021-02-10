import React, { Component } from 'react';
import publicIp from 'public-ip';
import * as bootstrap from 'bootstrap';
import './schemaOutliner.global.scss';
import { InputGroup, FormControl } from 'react-bootstrap';
import OutlinerService from '../../outliner/OutlinerService';
import CollectionOutline from './collectionOutline';

class SchemaOutliner extends Component<{}, { [key: string]: any }> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      collections: [],
      loading: false,
      uri: '',
      dbName: '',
      ip: '',
    };
  }

  async componentDidMount() {
    this.setState({ ip: await publicIp.v4() });
  }

  async getOutlinedData() {
    this.setState({ loading: true });
    try {
      const outlinedCollections = await OutlinerService.getOutlinedData(this.state.uri);
      this.setState({ collections: outlinedCollections }, () => {
        this.setState({ loading: false, connected: true });
      });
    } catch (e) {
      this.setState({ loading: false, connected: false });
      new bootstrap.Alert('err');
    }
  }

  watchForEnter(keyCode: number) {
    if (keyCode === 13) {
      this.getOutlinedData();
    }
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
            value={this.state.uri}
            onChange={(e) => this.setState({ uri: e.target.value })}
            onKeyDown={(e: { keyCode: number }) => this.watchForEnter(e.keyCode)}
          />
          <button
            onClick={() => this.getOutlinedData()}
            className="btn btn-primary"
            type="submit"
            disabled={!this.state.uri}
          >
            Outline
          </button>
        </InputGroup>
        {(() => {
          if (this.state.loading) {
            return <p>Loading...</p>;
          } if (this.state.connected) {
            return (
              <div id='collectionsOutlines'>
                {this.state.collections.map((collection: any) => <CollectionOutline key={collection.name} collection={collection} />)}
              </div>
            );
          }
          return <p>No connection.</p>;
        })()}
        {/* <div id='toastBox'>
          <div className="alert alert-danger" role="alert">
            A simple danger alert—check it out!
          </div>
        </div> */}
      </div>
    );
  }
}

export default SchemaOutliner;
