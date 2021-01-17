import React from 'react';
import './collectionOutline.global.scss';

function CollectionOutline(props: { collection: any }) {
  const { collection } = props;

    return (
      <div className='collection-outline'>
        <div className='outline-top-bar'>
          <p className='collection-name'>{collection.name} ({collection.docsCount})</p>
        </div>
        <ul className='outline-content'>
          {collection.keys.map((key: any) => {
            let className = 'outline-key';
            if(key.percentage < 100) className = className+' warning';
            return (
              <li className={className} key={`${collection.name}_${key.keyName}`}>{key.keyName}: {key.percentage}% {key.percentage<100 ? `(${key.count})` : ''}</li>
            )
          })}
        </ul>
      </div>
    )
}

export default CollectionOutline;
