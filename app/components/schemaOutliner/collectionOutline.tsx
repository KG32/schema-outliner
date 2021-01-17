import React from 'react';
import './collectionOutline.global.scss';
import { Card } from 'react-bootstrap';

function CollectionOutline(props: { collection: any }) {
  const { collection } = props;

  return (
    <Card
      style={{ width: '18rem' }}
      className="mb-2 collection-outline"
    >
      <Card.Header style={{ fontWeight: 'bold' }}>{collection.name} ({collection.docsCount})</Card.Header>
      <Card.Body>
        <ul className='outline-content'>
          {collection.keys.map((key: any) => {
            let className = 'outline-key';
            if(key.percentage < 100) className = className+' warning';
            return (
              <li className={className} key={`${collection.name}_${key.keyName}`}>{key.keyName}: {key.percentage}% {key.percentage<100 ? `(${key.count})` : ''}</li>
            )
          })}
        </ul>
      </Card.Body>
    </Card>
  )
}

export default CollectionOutline;
