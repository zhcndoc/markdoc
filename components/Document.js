import React from 'react';
import Markdoc from '@markdoc/markdoc';
import { Editor, useMarkdocCode } from './Sandbox';
import { EditPagePanel } from './EditPagePanel';

function EditPage({ source: initialDocument }) {
  const [doc, setDoc] = React.useState(initialDocument);
  const { content, config, errors } = useMarkdocCode(doc);

  return (
    <>
      {Markdoc.renderers.react(content.children, React, {
        components: config.components
      })}
      <div
        className="wwads-cn wwads-horizontal"
        style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '1rem auto'
        }}
        data-id="354"
      />
      <EditPagePanel>
        <Editor code={doc} onChange={setDoc} errors={errors} />
      </EditPagePanel>
    </>
  );
}

export function Document({ source, children }) {
  /**
   * Typically you would just render children here, but we are adding
   * this extra branch in order to pop up the editor that reveals
   * the source content for each document
   */
  return (
    <article>
      {source ? (
        <EditPage source={source} />
      ) : (
        <>
          {children}
          <div
            className="wwads-cn wwads-horizontal"
            style={{
              maxWidth: '1200px',
              width: '100%',
              margin: '1rem auto'
            }}
            data-id="354"
          />
        </>
      )}
    </article>
  );
}
